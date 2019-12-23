const nodemailer = require('nodemailer')    //发送邮件必要的包

async function main(md2htmlStr, emailBox) {

  let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    service: "qq",           //使用了内置传输发送邮件
    port: 465,               //SMTP端口
    secure: true,            // true for 465, false for other ports
    auth: {
      user: "651577562@qq.com", // 发送邮箱
      pass: "rpoargxsuacfbdig" //  邮箱的授权码
    }
  });

  let info = await transporter.sendMail({
    from: '"Rain 👻" <651577562@qq.com>', // 是发送的邮箱
    to: emailBox,                         // 接收的邮箱，可以填写多个，用逗号隔开
    subject: "今天有个好心情！",        // 邮件的主题
    text: "Here ...",                     // 没用。。
    html: md2htmlStr                      // html的内容
  });

  console.log("Message sent: %s", info.messageId);

}

main().catch(console.error);



module.exports = {
  sendEmail: main
}