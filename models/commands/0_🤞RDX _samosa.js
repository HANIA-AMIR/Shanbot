module.exports.config = {
  name: "samosa", // Changed from "biryani" to "samosa"
  version: "1.0.0",
  hasPermssion: 0,
  credits: "RDX_ZAIN",
  description: "Random samosa image", // Updated description
  commandCategory: "Image",
  usages: "samosa", // Updated usage
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
  
  var link = ["https://i.postimg.cc/BQkc59ym/a89aa57e7b91c725708482abed87c1cf.jpg", "https://i.postimg.cc/6QwZz9hf/d2e19e4f86ed65d1c53731226a8a25a7.jpg", "https://i.postimg.cc/Vk9rJxcr/120edd3b880f0753962a56f7b5c01d1d.jpg", "https://i.postimg.cc/QVGCtb4J/b0fabd4c29ac8e499b64dc2990b2c78a.jpg", "https://i.postimg.cc/YS9WTdJv/7c1e0f89d45343a1cf764ce8ac8a10a8.jpg", "https://i.postimg.cc/zvnbT6Rc/018944cacf0bd71083fb8786897aaf2f.jpg", "https://i.postimg.cc/3J1W7gjm/9b139719f15cf31bc88352e81c0985c8.jpg", "https://i.postimg.cc/vB5HK9H1/84fa279dc94301c9bb6d627eb6d612e4.jpg"];

  // React with 🤤 emoji
  api.setMessageReaction("🤤", event.messageID, (err) => {}, true);

  // Send the initial message
  api.sendMessage("𝗔𝗖𝗛𝗔 𝗚 𝗟𝗚𝗧𝗔 𝗕𝗛𝗢𝗢𝗞 𝗟𝗚 𝗚𝗔𝗘𝗬 𝗛𝗬 𝗝𝗡𝗔𝗕 𝗞𝗢 𝗗𝗘𝗧𝗔 𝗛𝗨 𝗦𝗔𝗠𝗢𝗦𝗔", event.threadID, () => {
    // Once the initial message is sent, proceed to send the image
    var callback = () => api.sendMessage(
      { body: `MADE BY ZAIN PRINCE: ${link.length}`, attachment: fs.createReadStream(__dirname + "/cache/1.jpg") },
      event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/1.jpg"),
      event.messageID
    );

    // Randomly select an image link and download it
    return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
      .pipe(fs.createWriteStream(__dirname + "/cache/1.jpg"))
      .on("close", () => callback());
  });
};
