export type ITheOneRes = {
  desc: string;
  text: string;
};

export type IGetTheOne = () => Promise<ITheOneRes>;

export type IWeatherRes = {
  weatherState: string; // 大体状况，晴还是多云
  temp: string; // 温度
  windDir: string; // 风向
  windSpeed: string; // 风速
  air: string; // 空气质量
  humi: string; // 湿度
  tips: string; // 建议
};

// 根据省市 获取今天的天气
export type IGetWeather = (
  province: string,
  city: string
) => Promise<IWeatherRes>;

export type IYdWordRes = {
  chinese: string; // 中文内容
  english: string; // 英文内容
  image: string; // 图片
  mp3: string; // 发音
  source: string; // 内容来源
};
//获取有道词典的每日一句
export type IGetYdWord = () => Promise<IYdWordRes>;

import { SEND_TYPE } from "../constants/index";

export type IMessage = {
  weather: IWeatherRes;
  one: ITheOneRes;
  ydWord: IYdWordRes;
  extraWord: string;
  toadyInHistory: string;
};

export type IFormatMessage = (message: IMessage, sendType: SEND_TYPE) => string;

import { IConfig } from "../config";
export type ISendServerChan = (config: IConfig, message: IMessage) => void;

export type ISendEmailMsg = (config: IConfig, message: IMessage) => void;

export type Store = IMessage & {
  [key: string]: any;
};
