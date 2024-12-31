const axios = require("axios");

const config = {
  name: "zaini",
  version: "1.0.0",
  hasPermission: 0,
  credits: "RDX_ZAIN",
  description: "[ 𝗭𝗮𝗶𝗻 𝗔𝙞 ]",
  commandCategory: "no prefix",
  usages: "𝘼𝙨𝙠 𝘼 𝙌𝙪𝙚𝙨𝙩𝙞𝙤𝙣 𝙁𝙧𝙤𝙢 𝙕𝙖𝙞𝙣 𝘼𝙞",
  cooldowns: 0
};

const handleEvent = async function ({ api, event, client, __GLOBAL }) {

  if (event.body.indexOf("siri") === 0 || event.body.indexOf("Siri") === 0 || event.body.indexOf("zain") === 0 || event.body.indexOf("Zain") === 0)  {
    const { threadID, messageID } = event;
    const input = event.body;
    const message = input.split(" ");

    if (message.length < 2) {
      api.sendMessage("✨ 𝙷𝚎𝚕𝚕𝚘 𝙸 𝙰𝚖 zain bot kia ap bta sakty hy ap ko mare owner sa kia kam hy agr ap kuch time wait kr sakty hy to fine agr zrori baat krni hy to ma unha inbox ma msg kr ka bula sakta hu thanks ♥️♥️ ", event.threadID);
    } else {
      try {
        api.sendMessage(`ℤ𝔸𝕀ℕ 𝔹𝕆𝕋 𝙸𝚜 𝚆𝚘𝚛𝚔𝚒𝚗𝚐`, event.threadID);
        const ris = await axios.get(`https://vw6v4g-3000.csb.app/api/tools/bard?question=${message.slice(1).join(" ")}`);
        const resultai = ris.data.edtmsg;


    api.sendMessage(`${resultai}\n\n\n༺═─────────═༻\n𝚃𝚑𝚒𝚜 𝙸𝚜 𝙰𝚗 𝙰𝚒 𝙻𝚒𝚔𝚎 𝙱𝚊𝚛𝚍 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝙱𝚢 𝙽𝚊𝚞𝚐𝚑𝚝𝚢 𝙰𝚗𝚍 𝙸𝚝 𝙰𝚕𝚜𝚘 𝙷𝚊𝚟𝚎 𝚁𝚎𝚊𝚕-𝚝𝚒𝚖𝚎 𝙳𝚊𝚝𝚊 𝙰𝚌𝚎𝚜𝚜 \n༺═─────────═༻`, event.threadID);
  } catch (err) {
        console.error(err);
        api.sendMessage("𝙷𝚎𝚕𝚕𝚘 𝚉𝚊𝚒𝚗 𝚊𝚋𝚑𝚒 𝚋𝚞𝚜𝚢 𝚑𝚢 𝚊𝚙 𝚝𝚑𝚘𝚛𝚊 𝚠𝚊𝚒𝚝 𝚔𝚛 𝚕𝚢 𝚊𝚐𝚛 𝚘𝚠𝚗𝚎𝚛 𝚗𝚑𝚒 𝚊𝚝𝚢 𝚝𝚘 𝚖𝚊 𝚞𝚗𝚑𝚊 𝚒𝚋 𝚖𝚊 𝚖𝚜𝚐 𝚔𝚛 𝚜𝚊𝚔𝚝𝚊 𝚊𝚐𝚛 𝚣𝚊𝚢𝚊𝚍𝚊 𝚣𝚛𝚘𝚛𝚒 𝚋𝚊𝚊𝚝 𝚑𝚢 𝚝𝚘 𝚊𝚙 𝚒𝚋 𝚖𝚎 𝚖𝚜𝚐 𝚔𝚛 𝚜𝚊𝚔𝚝𝚢 𝚑𝚢 ♥️♥️ owner id♥️https://www.facebook.com/profile.php?id=100086033644262&mibextid=ZbWKwL", event.threadID);
  }
      }
        }
          };

const run = function ({ api, event, client, __GLOBAL }) {
};

module.exports = { config, handleEvent, run };
