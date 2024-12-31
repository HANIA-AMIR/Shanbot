module.exports.config = {
  name: "name",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Add a name to the user's sent image",
  commandCategory: "dpname",
  usages: "name <text>",
  cooldowns: 1
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    const words = text.split(" ");
    const lines = [];
    let line = "";
    while (words.length > 0) {
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
        line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
    }
    lines.push(line.trim());
    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const Canvas = global.nodemodule["canvas"];
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  
  const nameText = args.join(" ").trim();
  if (!nameText) {
    return api.sendMessage("कृपया कमांड के साथ नाम लिखें, जैसे '.name John Doe'.", threadID, messageID);
  }

  // Check if an image is attached with the command
  if (!event.attachments || event.attachments.length === 0 || event.attachments[0].type !== "photo") {
    return api.sendMessage("कृपया इस कमांड के साथ एक तस्वीर भेजें।", threadID, messageID);
  }

  const pathImg = __dirname + `/cache/userImage_${threadID}_${messageID}.png`;

  // Download the user's image
  const userImageUrl = event.attachments[0].url;
  const getImage = (await axios.get(userImageUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

  // Download font if not already cached
  if (!fs.existsSync(__dirname + '/cache/SNAZZYSURGE.ttf')) {
    const getFont = (await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/SNAZZYSURGE.ttf", Buffer.from(getFont, "utf-8"));
  }

  // Load the user's image
  const baseImage = await loadImage(pathImg);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // Set font and text style
  Canvas.registerFont(__dirname + `/cache/SNAZZYSURGE.ttf`, {
    family: "SNAZZYSURGE"
  });
  ctx.font = "30px SNAZZYSURGE";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  
  // Wrap and position the name text
  const wrappedText = await this.wrapText(ctx, nameText, canvas.width - 40);
  ctx.fillText(wrappedText.join("\n"), canvas.width / 2, canvas.height - 50);

  // Convert to image buffer and send
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
