import getTheOne from "../apis/getTheOne";
import getWeather from "../apis/getWeather";
import getYdWord from "../apis/getYdWord";

import { IMessege, Store } from "../types/index";
import configList, { IConfig } from "../config";

const MessegeStore = {} as Store;

const genKey = (...rest: string[]) => rest.join("_");

export const getAllMessage = async function () {
  const [one, ydWord] = await Promise.all([getTheOne(), getYdWord()]);
  const today = new Date().toLocaleDateString();

  for (let person of configList) {
    const { province, city } = person;
    const key = genKey(province, city, today);
    if (!(key in MessegeStore)) {
      const weather = await getWeather(province, city);
      MessegeStore[key] = weather;
    }
  }
  MessegeStore["one"] = one;
  MessegeStore["ydWord"] = ydWord;
  console.log("MessegeStore is ", MessegeStore);
};

export const getCustomizedMessage = function (config: IConfig) {
  const messege = {} as IMessege;
  const { province, city, extraWord } = config;
  const today = new Date().toLocaleDateString();
  const key = genKey(province, city, today);

  messege["one"] = MessegeStore["one"];
  messege["ydWord"] = MessegeStore["ydWord"];
  messege["weather"] = MessegeStore[key];
  messege["extraWord"] = extraWord;
  return messege;
};
