import axios from "axios";
import * as cheerio from "cheerio";


import { IGetWeather } from "../types/index";
import { genUrl } from "../constants";

const getWeather: IGetWeather = async function (province, city) {
  const url = genUrl(province, city);

  return await axios.get(url).then((res) => {
    const $ = cheerio.load(res.data);
    const today: any = $(".days")[0]; //第0位是今天的天气
    const weatherState: string = today.children[3].children[2].data.trim();
    const temp: string = today.children[5].children[0].data;
    const windDir: string = today.children[7].children[1].children[0].data;
    const windSpeed: string = today.children[7].children[3].children[0].data;
    const air: string = today.children[9].children[0].children[0].data.trim();
    const wea_about: string = ($(".wea_about") as any)[0].children[1]
      .children[0].data; //湿度
    const wea_tips: string = ($(".wea_tips")[0] as any).children[3].children[0]
      .data; //天气提示

    const result = {
      weatherState,
      temp,
      windDir,
      windSpeed,
      air,
      humi: wea_about.split(" ")[1], //抓取出来的湿度格式是 "湿度 10%"  做一下处理，与温度一致
      tips: wea_tips,
    };

    console.log("今天的天气爬取完毕");
    return result;
  });
};

export default getWeather;
