import axios from "axios";
import * as cheerio from "cheerio";
import { IGetTheOne } from "../types/index";
import { THEONE_URL } from "../constants";

//获取"一个"今天的句子
const getTheOne: IGetTheOne = async function () {
  const res = await axios.get(THEONE_URL); //one的官网，爬取今天的一句
  const $ = cheerio.load(res.data);
  const one_text = ($(".fp-one-cita a")[0] as any).children[0].data; //一个的今日一句
  const one = {
    desc: "one 今天的句子",
    text: one_text,
  };
  console.log("一个的今日一句爬取完毕");
  return one;
};

export default getTheOne;
