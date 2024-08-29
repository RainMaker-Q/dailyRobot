import axios from "axios";
import qs from "qs";
// import showdown from "showdown"; //markdown转换为html
// const { sendEmail } = require("./sendEmail");

import { SEND_TYPE } from "../constants";
import { ISendServerChan } from "../types";
import formatMessege from "./formatter";

export const sendServerChan: ISendServerChan = function (person, messege) {
  if (person.serverChan.isSend === true) {
    let str = formatMessege(messege, SEND_TYPE.serverChan); // 将格式转换为server酱所需的格式
    let url = "https://sctapi.ftqq.com/" + person.serverChan.authCode + ".send"; // 相应的server酱的配置url
    axios
      .post(
        url, //向绑定微信的手机发送消息
        qs.stringify({
          text: "今日的推送已到达!",
          desp: str,
        })
      )
      .then((res: any) => {
        console.log(res.data);
      });
  }
};

// export const sendEmailMsg: ISendEmailMsg = function (config, messege) {
//   if (config.email.isSend == true) {
//     let converter = new showdown.Converter(); //markdown变为html所需要的对象
//     let str = formatMessege(messege, SEND_TYPE.email); //将数据转化为相应的html
//     let html = converter.makeHtml(str); //这里，markdown变为了html
//     sendEmail(html, config.email.emailBox); //发送邮件
//   }
// };
