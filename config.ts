/*
 * ----------配置文件-------------
 * 每个对象的省市(上墨迹天气看相应的url)
 * server酱的码、接收的邮箱（如果isSend选项是false的话，就不发送）
 */

export type IConfig = {
  province: string; // 查询天气的省
  city: string; // 查询天气的市、区
  extraWord: string; // 信息中想说的话
  // server酱配置信息
  serverChan: {
    isSend: boolean;
    authCode: string;
  };
  // 邮件配置信息
  email: {
    isSend: boolean;
    emailBox: string;
  };
};

const configList: IConfig[] = [
  {
    province: "beijing",
    city: "haidian-district",
    extraWord: "今天，又是充满希望的一天！", //在title想说的话
    serverChan: {
      isSend: true,
      authCode: "123", // 自己的server酱授权码
    },
    email: {
      isSend: true,
      emailBox: "lrq_email@163.com",
    },
  },
  {
    province: "beijing",
    city: "haidian-district",
    extraWord: "早上好啊，sweet heart~",
    serverChan: {
      isSend: true,
      authCode: "123",
    },
    email: {
      isSend: true,
      emailBox: "lrq@bupt.edu.cn", //调试使用
    },
  },
];

export default configList;
