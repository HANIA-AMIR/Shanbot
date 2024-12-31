const moment = require("moment-timezone");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require("child_process");
const logger = require("./utils/log.js");
const login = require("fca-priyansh");
const axios = require("axios");
const { Sequelize, sequelize } = require("./includes/database");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

// Global objects
global.client = {
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: [],
    handleSchedule: [],
    handleReaction: [],
    handleReply: [],
    mainPath: process.cwd(),
    configPath: "",
    getTime: (option) => {
        const formatOptions = {
            seconds: "ss",
            minutes: "mm",
            hours: "HH",
            date: "DD",
            month: "MM",
            year: "YYYY",
            fullHour: "HH:mm:ss",
            fullYear: "DD/MM/YYYY",
            fullTime: "HH:mm:ss DD/MM/YYYY",
        };
        return moment.tz("Asia/Kolkata").format(formatOptions[option] || "HH:mm:ss DD/MM/YYYY");
    }
};

global.data = {
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: [],
    allUserID: [],
    allCurrenciesID: [],
    allThreadID: []
};

global.utils = require("./utils");
global.nodemodule = {};
global.config = {};
global.configModule = {};
global.moduleData = [];
global.language = {};

// Load config file
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    const configValue = require(global.client.configPath);
    Object.assign(global.config, configValue);
    writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), "utf8");
    logger.loader("Config file loaded successfully.");
} catch (err) {
    logger.loader("Error loading config file!", "error");
    process.exit(1);
}

// Load language file
try {
    const langFile = readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, "utf-8").split(/\r?\n|\r/);
    langFile.filter(line => line && !line.startsWith("#")).forEach(line => {
        const [key, ...value] = line.split("=");
        const head = key.split(".")[0];
        const tail = key.slice(head.length + 1);
        global.language[head] = global.language[head] || {};
        global.language[head][tail] = value.join("=").replace(/\\n/g, "\n");
    });
    logger.loader("Language file loaded successfully.");
} catch (err) {
    logger.loader("Error loading language file!", "error");
    process.exit(1);
}

global.getText = (head, key, ...args) => {
    if (!global.language[head] || !global.language[head][key]) throw new Error(`Language key not found: ${head}.${key}`);
    return args.reduce((text, arg, i) => text.replace(new RegExp(`%${i + 1}`, "g"), arg), global.language[head][key]);
};

// Load appState
let appState;
try {
    const appStatePath = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    appState = require(appStatePath);
    logger.loader(global.getText("priyansh", "foundPathAppstate"));
} catch (err) {
    logger.loader(global.getText("priyansh", "notFoundPathAppstate"), "error");
    process.exit(1);
}

// Login and start bot
const startBot = async ({ models }) => {
    try {
        login({ appState }, async (error, api) => {
            if (error) throw error;
            api.setOptions(global.config.FCAOption);
            writeFileSync(resolve(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"), JSON.stringify(api.getAppState(), null, 4));
            global.client.api = api;

            logger.loader("Successfully logged in!");

            // Load commands
            const commandsPath = join(global.client.mainPath, "models/commands");
            const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                try {
                    const command = require(join(commandsPath, file));
                    if (!command.config || !command.run) throw new Error("Invalid command format.");
                    global.client.commands.set(command.config.name, command);
                    logger.loader(`Loaded command: ${command.config.name}`);
                } catch (err) {
                    logger.loader(`Failed to load command ${file}: ${err.message}`, "error");
                }
            }

            // Load events
            const eventsPath = join(global.client.mainPath, "models/events");
            const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));
            for (const file of eventFiles) {
                try {
                    const event = require(join(eventsPath, file));
                    if (!event.config || !event.run) throw new Error("Invalid event format.");
                    global.client.events.set(event.config.name, event);
                    logger.loader(`Loaded event: ${event.config.name}`);
                } catch (err) {
                    logger.loader(`Failed to load event ${file}: ${err.message}`, "error");
                }
            }

            // Listen for messages
            api.listenMqtt((error, message) => {
                if (error) return logger(`Listener error: ${error.message}`, "error");
                if (!["message", "event"].includes(message.type)) return;
                const listener = require("./includes/listen");
                listener(message);
            });

            logger.loader("Bot started successfully.");
        });
    } catch (err) {
        logger.loader(`Error starting bot: ${err.message}`, "error");
        process.exit(1);
    }
};

// Connect to database and start the bot
(async () => {
    try {
        await sequelize.authenticate();
        const models = require("./includes/database/model")({ Sequelize, sequelize });
        logger.loader("Database connected successfully.");
        startBot({ models });
    } catch (err) {
        logger.loader(`Database connection error: ${err.message}`, "error");
        process.exit(1);
    }
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger(`Unhandled Rejection: ${reason.message || reason}`, "error");
});
