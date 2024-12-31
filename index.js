const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require("express");
const path = require("path");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 3000;

// Serve index.html for the root route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => logger(`Server is running on port ${port}`, "[ Starting ]"));

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

// Initialize global variables
global.countRestart = 0;

function startBot(message) {
  if (message) logger(message, "[ Starting ]");

  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "SHAAN-KHAN.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (codeExit) => {
    if (codeExit !== 0 && global.countRestart < 5) {
      global.countRestart += 1;
      logger(`Bot restarting... Attempt ${global.countRestart}`, "[ WARNING ]");
      startBot("Restarting...");
    } else if (global.countRestart >= 5) {
      logger("Bot stopped. Exceeded maximum restart attempts.", "[ ERROR ]");
    } else {
      logger("Bot exited normally.", "[ INFO ]");
    }
  });

  child.on("error", (error) => {
    logger("An error occurred: " + error.message, "[ ERROR ]");
  });
}

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

axios
  .get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
  .then((res) => {
    logger(res.data.name, "[ NAME ]");
    logger("Version: " + res.data.version, "[ VERSION ]");
    logger(res.data.description, "[ DESCRIPTION ]");
  })
  .catch((error) => {
    logger("Error fetching update from Github: " + error.message, "[ ERROR ]");
  });

/////////////////////////////////////////////////////////
//========= Start Bot After Initialization =========//
/////////////////////////////////////////////////////////

startBot();
