/*
* ----------配置文件-------------
*
* 每个对象的省市(上墨迹天气看相应的url)
* server酱的码、接收的邮箱（如果isSend选项是false的话，就不发送）
*/

var configList = {
  lrq: {
    province: "beijing",
    city: "haidian-district",
    serverChan: {
      isSend: true,
      authCode: "SCU69765T7313a13dbabe2d1e7ed0b9aec63b691b5dfb3a8f3e2fb"
    },
    email: {
      isSend: true,
      emailBox: "lrq_email@163.com"
      // biggfish3147@163.com
    }
  },
  lxq: {
    province: "heilongjiang",
    city: "harbin",
    serverChan: {
      isSend: false,
      authCode: "123"
    },
    email: {
      isSend: true,
      // emailBox: "lrq@bupt.edu.cn"  //调试使用
      emailBox: "lxq_emai@163.com"
    }
  }
}




module.exports = {
  configList: configList
}