const schedule = require("node-schedule");

import configList from "./config";
import { sendServerChan } from "./utils/send";
import {
  getAllMessage,
  getCustomizedMessage,
  updateTodayWords,
} from "./utils/messege";

const send = async function () {
  await getAllMessage();
  for (let person of configList) {
    const messege = getCustomizedMessage(person);
    await sendServerChan(person, messege);
  }
  updateTodayWords();
};

/*
 *定时任务
 *秒 分 时 日 月 周
 */
// schedule.scheduleJob("00 20 05 * * *", async () => {
//   await send();
//   console.log("======信息已发送======" + new Date());
// });

send();
