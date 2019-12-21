const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')
const {configList} = require('./config')

const words = [];   //爬下来的内容都在里面

//获取"一个"是今天的句子
var getOne = function() {
  return axios.get("http://wufazhuce.com/")
  .then(function(res) {
    let $ = cheerio.load(res.data);
    var one_text = $('.fp-one-cita a')[0].children[0].data;   //一个的今日一句
    var one = {
      desc: "one 今天的句子",
      text: one_text
    }
    words["one"] = one;
    console.log("一个的今日一句爬取完毕");
  })
}

//获取今天的天气
var getWeather = function() {
  let province = configList.lrq.province;
  let city = configList.lrq.city;
  let url = "http://tianqi.moji.com/weather/china/" + province + "/" + city;
  console.log(url);
  return axios.get(url)
  .then(res=>{
    let $ = cheerio.load(res.data);

    let today = $('.days')[0];  //第0位是今天的天气
    let weatherState = today.children[3].children[2].data.trim(); //今天晴还是多云
    let temp = today.children[5].children[0].data;                //获取今天的温度
    let windDir = today.children[7].children[1].children[0].data; //获取今天的风向
    let windSpeed = today.children[7].children[3].children[0].data; //获取今天的风速
    let air = today.children[9].children[0].children[0].data.trim();  //获取今天的空气
    let wea_about = $('.wea_about')[0].children[1].children[0].data;  //湿度
    let wea_tips = $('.wea_tips')[0].children[3].children[0].data;    //天气提示


    let weather = {
      weatherState: weatherState,
      temp: temp,
      windDir: windDir,
      windSpeed: windSpeed,
      air: air,
      humi: wea_about.split(" ")[1],    //抓取出来的湿度格式是 "湿度 10%"  做一下处理，与温度一致
      tips: wea_tips
    }
    words["weather"] = weather;
    console.log("今天的天气爬取完毕");
  })
}

//获取有道词典的每日一句
var getYdWord = function() {
  return axios.get("http://dict.youdao.com/infoline/style/cardList?style=daily&apiversion=3.0&client=mobile")
          .then(res=> {
            let todayData = res.data[0];  //要今天的
            let ydWord = {  
              chinese: todayData.summary, //这是中文
              english: todayData.title,   //这是英语
              image: todayData.image[0],  //图片
              mp3: todayData.voice,       //发音
              source: todayData.source    //出自哪里
            }
            words["ydWord"] = ydWord;
          })
}

//处理 天气、一个、有道每日一句的结果
//返回markdown格式的字符串
var dealWords = function(words) {
  let ret = "";
  let weather = words["weather"];
  let one = words["one"];
  let ydWord = words["ydWord"];

  //添加天气情况
  ret = "天气: " + weather.weatherState + " \r\n\r\n" +
        "温度: " + weather.temp + " \r\n\r\n" + 
        "湿度: " + weather.humi + " \r\n\r\n" + 
        "风风: " + weather.windDir + " " + weather.windSpeed + " \r\n\r\n" + 
        "空气质量: " + weather.air + " \r\n\r\n" + 
        "温馨提示:" + weather.tips + " \r\n\r\n";
  //添加one
  ret = ret + 
        "the one: " + one.text + " \r\n\r\n";
  //添加有道每日一句
  ret = ret + 
        "每日一句: " + " \r\n\r\n" +
        "*" + ydWord.english + "* \r\n\r\n" +
        ydWord.chinese + " \r\n\r\n" +
        "出自  《" + ydWord.source + "》 \r\n\r\n" +
        "![配图](" + ydWord.image + ")";
  return ret;
}

Promise.all([getOne(), getWeather(), getYdWord()]).then(()=>{
  let str = dealWords(words);
  console.log(str);
  let authCode = configList.lrq.authCode;
  let url = "https://sc.ftqq.com/" + authCode + ".send";
  axios.post(url,
    qs.stringify({
      "text": "今日的推送已到达!",
      "desp": str
    }))
  .then((res)=>{
    console.log(res.data)
  })
})





