import getTheOne from "../apis/getTheOne";
import getWeather from "../apis/getWeather";
import getYdWord from "../apis/getYdWord";

import { IMessage, Store } from "../types/index";
import configList, { IConfig } from "../config";
import axios from "axios";

const MessageStore = {} as Store;

const genKey = (...rest: string[]) => rest.join("_");

export const getAllMessage = async function () {
  const [one, ydWord] = await Promise.all([getTheOne(), getYdWord()]);
  const today = new Date().toLocaleDateString();

  for (let person of configList) {
    const { province, city } = person;
    const key = genKey(province, city, today);
    if (!(key in MessageStore)) {
      const weather = await getWeather(province, city);
      MessageStore[key] = weather;
    }
  }
  MessageStore["one"] = one;
  MessageStore["ydWord"] = ydWord;
  console.log("MessageStore is ", MessageStore);
};

export const getCustomizedMessage = function (config: IConfig) {
  const message = {} as IMessage;
  const { province, city, extraWord } = config;
  const today = new Date().toLocaleDateString();
  const key = genKey(province, city, today);

  message["one"] = MessageStore["one"];
  message["ydWord"] = MessageStore["ydWord"];
  message["weather"] = MessageStore[key];
  message["extraWord"] = extraWord;
  return message;
};

export const updateTodayWords = () => {
  axios
    .post("http://localhost:3000/words", {
      yd_ch: MessageStore?.ydWord?.chinese || "",
      yd_en: MessageStore?.ydWord?.english || "",
      yd_img: MessageStore?.ydWord?.image || "",
      yd_mp3: MessageStore?.ydWord?.mp3 || "",
      theone: MessageStore?.one?.text || "",
    })
    .then((res) => {
      console.log("res is ", res.data);
    });
};
