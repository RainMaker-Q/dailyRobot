import axios from "axios";
import { IGetYdWord } from "../types/index";
import { YOUDAO_URL } from "../constants";

const getYdWord: IGetYdWord = async function () {
  return await axios.get(YOUDAO_URL).then((res) => {
    const todayData = res.data[0]; //今天的每日一句
    const ydWord = {
      chinese: todayData.summary,
      english: todayData.title,
      image: todayData.image[0],
      mp3: todayData.voice,
      source: todayData.source,
    };

    console.log("今天的有道爬取完毕");
    return ydWord;
  });
};

export default getYdWord;
