//处理 天气、一个、有道每日一句的结果
//返回markdown格式的字符串

import { SEND_TYPE } from "../constants/index";
import { IFormatMessage } from "../types/index";

const formatMessage: IFormatMessage = function (
  message,
  sendType = SEND_TYPE.serverChan
) {
  let ret = "";
  let weather = message["weather"];
  let one = message["one"];
  let ydWord = message["ydWord"];
  let extraWord = message["extraWord"];
  let toadyInHistory = message["toadyInHistory"];
  let nextLine = "";

  let date = new Date();
  let dataStr =
    date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

  if (sendType === SEND_TYPE.serverChan) {
    nextLine = " \r\n\r\n"; //这个在微信中显示是换行，应该是它内部处理过
    dataStr = "### " + extraWord + nextLine + "**" + dataStr + "**" + nextLine;
  } else if (sendType === SEND_TYPE.email) {
    dataStr =
      "<h3>" + extraWord + "<h3/>" + "**" + dataStr + "**" + nextLine + "<hr/>";
  }

  //添加天气情况
  ret =
    dataStr +
    "天气: " +
    weather.weatherState +
    nextLine +
    "温度: " +
    weather.temp +
    nextLine +
    "湿度: " +
    weather.humi +
    nextLine +
    "风风: " +
    weather.windDir +
    " " +
    weather.windSpeed +
    nextLine +
    "空气质量: " +
    weather.air +
    nextLine +
    "温馨提示: " +
    weather.tips +
    nextLine;
  //添加one
  ret = ret + "### " + "the one: " + nextLine + one.text + nextLine;

  // 历史上的今天
  ret += "### " + "历史上的今天: " + nextLine + toadyInHistory.replaceAll('\n', nextLine) + nextLine;

  //添加有道每日一句
  const source = { ydWord };
  const flag_less = ("" + source).indexOf("《");
  ret =
    ret +
    "### " +
    "每日一句: " +
    nextLine +
    "*" +
    ydWord.english +
    "*" +
    nextLine +
    ydWord.chinese +
    nextLine +
    `出自  ${flag_less ? "" : "《"}` +
    ydWord.source +
    `${flag_less ? "" : "》"}` +
    nextLine +
    "![配图](" +
    ydWord.image +
    ")" +
    nextLine;

  // console.log('ret is ', ret);
  return ret;
};

export default formatMessage;
