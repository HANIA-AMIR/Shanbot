module.exports.config = {
  name: "notworking",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "RDX_ZAIN",
  description: "Random sexy photos for a fee",
  commandCategory: "Image",
  usages: "not working",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Currencies }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");

  // Your Facebook UID
  const adminUID = '100086033644262'; 

  // Check if the sender is the admin
  if (event.senderID !== adminUID) {
    return api.sendMessage("You do not have permission to use this command.", event.threadID, event.messageID);
  }

  var money = (await Currencies.getData(event.senderID)).money;
  if (money >= 1000) {
    axios.get('http://api.vangbanlanhat.tk/image?type=sexy').then(res => {
      var callback = function () {
        api.sendMessage({
          attachment: fs.createReadStream(__dirname + '/cache/trai.jpg')
        }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/trai.jpg'), event.messageID);
      };
      request(res.data.data).pipe(fs.createWriteStream(__dirname + '/cache/trai.jpg')).on("close", callback).then(Currencies.setData(event.senderID, { money: money - 1000 }));
    });
  }
}
