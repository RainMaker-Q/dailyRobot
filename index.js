const axios = require('axios');        
const cheerio = require('cheerio');    //作用和jqery一样
const qs = require('qs');
const showdown = require('showdown');  //markdown转换为html
const schedule = require('node-schedule');

const { configList } = require('./config');
// const { sendEmail } = require('./sendEmail');

// const words = [];   //爬下来的内容都在里面
const DB_GLOBAL = {};

//获取"一个"是今天的句子
const getOne = async function() {
  const res = await axios.get("http://wufazhuce.com/");   //one的官网，爬取今天的一句
  const $ = cheerio.load(res.data);
  const one_text = $('.fp-one-cita a')[0].children[0].data;   //一个的今日一句
  const one = {
    desc: "one 今天的句子",
    text: one_text
  }
  console.log("一个的今日一句爬取完毕");
  return one;
}

//获取今天的天气
const getWeather = async function(province, city, words) {
 
  let url = "http://tianqi.moji.com/weather/china/" + province + "/" + city;

  const weather = await axios.get(url)
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
      // words["weather"] = weather;
      console.log("今天的天气爬取完毕");
      return weather;
    });
    
    return weather;
}

//获取有道词典的每日一句
const getYdWord = async function(words) {
  const ydWord = await axios.get("http://dict.youdao.com/infoline/style/cardList?style=daily&apiversion=3.0&client=mobile")
          .then(res=> {
            let todayData = res.data[0];  //要今天的
            let ydWord = {  
              chinese: todayData.summary, //这是中文
              english: todayData.title,   //这是英语
              image: todayData.image[0],  //图片
              mp3: todayData.voice,       //发音
              source: todayData.source    //出自哪里
            }
            // words["ydWord"] = ydWord;
            console.log('今天的有道爬取完毕');
            return ydWord;
          })
  return ydWord;
}

const getAllMessage = async function() {
  const [one, ydWord] = await Promise.all([getOne(),  getYdWord()]);
  for(let obj of configList) {
    let { province, city } = obj;
    let key = `${province}_${city}`;
    const weather = await getWeather(province, city);
    DB_GLOBAL[key] = weather;
  }
  DB_GLOBAL['one'] = one;
  DB_GLOBAL['ydWord'] = ydWord;
  console.log('DB_GLOBAL is ', DB_GLOBAL);
}



const getCustomizedMessage = function(person) {
  const words = {};
  let { province, city, extraWord } = person;
  let key = `${province}_${city}`;
  words['one'] = DB_GLOBAL['one'];
  words['ydWord'] = DB_GLOBAL['ydWord'];
  words['weather'] = DB_GLOBAL[key];
  words['extraWord'] = extraWord;
  return words;
}


//处理 天气、一个、有道每日一句的结果
//返回markdown格式的字符串
//设置一个参数forWho，如果是给server酱的，就输出 \r\n\r\n，这个是换行
//如果是发邮件用的，那就是标准的markdown
const dealWords = function(words, forWho="serverChan") {
  let ret = "";
  let weather = words["weather"];
  let one = words["one"];
  let ydWord = words["ydWord"];
  let extraWord = words["extraWord"]
  let nextLine = "";

  let date = new Date();
  let dataStr =  date.getFullYear() +  "."
                   + (date.getMonth()+1) + "."
                   + date.getDate();


  if(forWho=="serverChan") {
    nextLine = " \r\n\r\n";   //这个在微信中显示是换行，应该是它内部处理过
    dataStr = "<h3>" + extraWord + "<h3/>"
              + "**" + dataStr + "**"
              + nextLine
              + "<hr/>";
  } else if(forWho=="email") {
    nextLine = "<br/>"        //标准的markdown
    dataStr = "<h3>" + extraWord + "<h3/>"
              + "**" + dataStr + "**" 
              + nextLine 
              + "<hr/>";
  }
  //添加天气情况
  ret = dataStr +
        "天气: " + weather.weatherState + nextLine +
        "温度: " + weather.temp + nextLine + 
        "湿度: " + weather.humi + nextLine + 
        "风风: " + weather.windDir + " " + weather.windSpeed + nextLine + 
        "空气质量: " + weather.air + nextLine + 
        "温馨提示:" + weather.tips + nextLine +
        "<hr/>" + nextLine;
  //添加one
  ret = ret + 
        "the one: " + one.text + nextLine + 
        "<hr/>" + nextLine;

  //添加有道每日一句
  const source = { ydWord };
  const flag_less = (''+source).indexOf('《');
  ret = ret + 
        "每日一句: " + nextLine +
        "*" + ydWord.english + "*" + nextLine +
        ydWord.chinese + nextLine +
        `出自  ${flag_less ? '' : '《'}` + ydWord.source + `${flag_less ? '' : '》'}` + nextLine +
        "![配图](" + ydWord.image + ")" +
        "<hr/>" + nextLine;
  return ret;
}


const sendServerChan = function(serverChan, words) {
  if(serverChan.isSend===true) {
    let str = dealWords(words, "serverChan");   //将格式转换为server酱所需的格式
    let url = "https://sc.ftqq.com/" + serverChan.authCode + ".send";  //相应的server酱的配置url
    axios.post(url,   //向绑定微信的手机发送消息
      qs.stringify({
        "text": "今日的推送已到达!",
        "desp": str
      }))
    .then((res)=>{
      console.log(res.data)
    })
  }
}

const sendEmailMsg = function(email, words) {
  if(email.isSend == true) {
    let converter = new showdown.Converter();   //markdown变为html所需要的对象
    let str = dealWords(words, "email");    //将数据转化为相应的html
    let html = converter.makeHtml(str);     //这里，markdown变为了html
    sendEmail(html, email.emailBox);          //发送邮件
  }
}

const send = async function() {
  
  await getAllMessage();
  for(let person of configList) {
    const words = getCustomizedMessage(person);
    await sendServerChan(person.serverChan, words);
    // await sendEmailMsg(person.email, words);
  }
}

/*
 *定时任务
 *秒 分 时 日 月 周
*/
schedule.scheduleJob('00 20 05 * * *', async() => {
  await send();
  console.log("======信息已发送======" + new Date());
})

// send()