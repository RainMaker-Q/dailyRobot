import axios from "axios";
import { TodayInHistory_Url } from "../constants";


const getTodayInHistory = async function () {
  const res = await axios.get(TodayInHistory_Url); // 历史上的今天
  const his = res?.data?.data || [];

  const val = his.map(({year, title}: any) => {
    return `${year}年: ${title}`
  }).sort(() => Math.random() > 0.5).slice(0, 3).join('\n');
  // console.log("val is ", val);
  return val;
};

export default getTodayInHistory;
