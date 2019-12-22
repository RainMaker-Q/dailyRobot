const axios = require('axios')        
const cheerio = require('cheerio')    //作用和jqery一样
const qs = require('qs')
const showdown = require('showdown')  //markdown转换为html

const {configList} = require('./config')
const {sendEmail} = require('./sendEmail')

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
var getWeather = function(province, city) {
  // let province = configList.lrq.province;
  // let city = configList.lrq.city;
  let url = "http://tianqi.moji.com/weather/china/" + province + "/" + city;
  console.log(url);
  return (
    axios.get(url)
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
  )
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
//设置一个参数forWho，如果是给server酱的，就输出 \r\n\r\n，这个是换行
//如果是发邮件用的，那就是标准的markdown
var dealWords = function(words, forWho="serverChan") {
  let ret = "";
  let weather = words["weather"];
  let one = words["one"];
  let ydWord = words["ydWord"];
  let nextLine = "";

  let date = new Date();
  let dataStr = "**" + date.getFullYear() +  "."
                   + (date.getMonth()+1) + "."
                   + date.getDate();


  if(forWho=="serverChan") {
    nextLine = " \r\n\r\n";   //这个在微信中显示是换行，应该是它内部处理过
    dataStr += "**" + nextLine + nextLine;
  } else if(forWho=="email") {
    nextLine = "<br/>"        //标准的markdown
    dataStr += "**" + nextLine + nextLine;
  }
  //添加天气情况
  ret = dataStr +
        "天气: " + weather.weatherState + nextLine +
        "温度: " + weather.temp + nextLine + 
        "湿度: " + weather.humi + nextLine + 
        "风风: " + weather.windDir + " " + weather.windSpeed + nextLine + 
        "空气质量: " + weather.air + nextLine + 
        "温馨提示:" + weather.tips + nextLine;
  //添加one
  ret = ret + 
        "the one: " + one.text + nextLine;
  //添加有道每日一句
  ret = ret + 
        "每日一句: " + nextLine +
        "*" + ydWord.english + "*" + nextLine +
        ydWord.chinese + nextLine +
        "出自  《" + ydWord.source + "》" + nextLine +
        "![配图](" + ydWord.image + ")";
  return ret;
}



var sendMsg = function(sb) {

  return (
    Promise.all([getOne(), getWeather(sb.province, sb.city), getYdWord()]).then(()=>{

      if(sb.serverChan.isSend == true) {  //如果配置设置了发送server酱
        let str = dealWords(words, "serverChan");   //将格式转换为server酱所需的格式
        let url = "https://sc.ftqq.com/" + sb.serverChan.authCode + ".send";  //相应的server酱的配置url
        axios.post(url,   //向绑定微信的手机发送消息
          qs.stringify({
            "text": "今日的推送已到达!",
            "desp": str
          }))
        .then((res)=>{
          console.log(res.data)
        })
      }

      if(sb.email.isSend == true) {
        let converter = new showdown.Converter();   //markdown变为html所需要的对象
        let str = dealWords(words, "email");    //将数据转化为相应的html
        let html = converter.makeHtml(str);     //这里，markdown变为了html
        sendEmail(html, sb.email.emailBox);          //发送邮件
      }

    })
  )
}


sendMsg(configList.lxq);

