module.exports.config = {
  name: "burger", // Changed from "biryani" to "burger"
  version: "1.0.0",
  hasPermssion: 0,
  credits: "RDX_ZAIN",
  description: "Random joke image",
  commandCategory: "Image",
  usages: "burger", // Changed from "biryani" to "burger"
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, Users, Threads, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  
  var link = [ "https://postimg.cc/RWsqZxyW", "https://postimg.cc/mzqNMmjT", "https://postimg.cc/8Fzh02n1", "https://postimg.cc/DWvgKJm3", "https://postimg.cc/Hr2w3YzZ", "https://postimg.cc/DmJcFKf0", "https://postimg.cc/k2dsfhm4", "https://postimg.cc/14kr3Y4H", "https://postimg.cc/sBTJfjZQ", "https://postimg.cc/LYh3nczy", "https://postimg.cc/nCqYjYDt", "https://postimg.cc/bSt0R1Vk"];

  var max = Math.floor(Math.random() * 6);
  var min = Math.floor(Math.random() * 2);
  var data = await Currencies.getData(event.senderID);
  var exp = data.exp;
  var money = data.money;
  
  if (money < 200) {
    api.sendMessage("You need 200$ to see the photo!", event.threadID, event.messageID);
  } else {
    Currencies.setData(event.senderID, options = { money: money - 200 });
    var callback = () => api.sendMessage(
      { body: `MADE BY ZAIN PRINCE: ${link.length}`, attachment: fs.createReadStream(__dirname + "/cache/1.jpg") },
      event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/1.jpg"),
      event.messageID
    );

    return request(encodeURI(link[Math.floor(Math.random() * link.length)] + (max - min)))
      .pipe(fs.createWriteStream(__dirname + "/cache/1.jpg"))
      .on("close", () => callback());
  }
};
