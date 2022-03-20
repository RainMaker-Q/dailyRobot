export enum SEND_TYPE {
  serverChan,
  email,
}

export const THEONE_URL = "http://wufazhuce.com/";

export const genUrl = (province: string, city: string) => {
  return `http://tianqi.moji.com/weather/china/${province}/${city}`;
};

export const YOUDAO_URL =
  "http://dict.youdao.com/infoline/style/cardList?style=daily&apiversion=3.0&client=mobile";
