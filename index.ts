const schedule = require("node-schedule");

import configList from "./config";
import { sendServerChan } from "./utils/send";
import {
  getAllMessage,
  getCustomizedMessage,
  updateTodayWords,
} from "./utils/message";

const send = async function () {
  await getAllMessage();
  for (let person of configList) {
    const message = getCustomizedMessage(person);
    await sendServerChan(person, message);
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
