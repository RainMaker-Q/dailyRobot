# dailyRobot

爬取墨迹天气、一个、有道词典的每日一句，通过server酱发送给相应的微信，发送邮件给相应的用户。  

---

## 更新

使用ts重构，看到两年前写的代码和语气，比较亲切了。
2022.03.20

重构代码逻辑，减小耦合
修改体验bug: 有道的每日一句的source有可能会是两个`《《今天的来源》》`
2021.1.31

---

微信效果图如下：  
![微信效果图](https://github.com/LRQLRQ/picture/blob/master/wechatRobotPic.png?raw=true)  
邮件效果图如下：  
![邮件效果图](https://github.com/LRQLRQ/picture/blob/master/emailRobotPic.png?raw=true)

## 前言

去年刚开始接触node，在网上找到一个每天定时给女朋友发消息的代码，开始用了一段时间，也没好好看代码。当时只是觉得能写出这种功能应该很NB。最近看了很多基础的知识，对前端有了更多的认识，js也了解的更深入了，就自己动手做了一个。

### 使用

1. ` git clone `这份代码，或者下载到本地。
2. 进入根目录，然后`npm install`
3. 修改`config.js`,设置收件人的相关信息（收件人的邮箱，server酱的码，以及额外要说的话）。
4. 修改`sendEmail.js`,修改发件人的邮箱，授权码，修改发送邮件的主题等。
5. 设置相应的server酱的码。（只需要中间的那串）详细访问[server酱官网](http://sc.ftqq.com/3.version)。

---

### 有待优化

- [x] 各个模块分成不同的文件，`index.js`内容变少一些
- [x] 请求one和有道词典每日一句的接口只需要一次就可以，有空了再改改逻辑优化。

2019.12.23  
written by Rain  


## 重构下逻辑
- [ ] 天气使用 wttr.in
- [ ] cheerio 部分引入问题
- [ ] 添加历史上的今天