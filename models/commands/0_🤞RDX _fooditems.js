module.exports.config = {
    name: "food",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Get an image of any food item based on its name",
    commandCategory: "Picture",
    usages: "food [Food Name]",
    cooldowns: 1,
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require('axios');
    const fs = require("fs");

    // Check if user provided a food name
    if (!args[0]) {
        return api.sendMessage("Please provide a food name to get an image!", event.threadID, event.messageID);
    }

    // Get the food name from user input
    const foodName = args.join(" ");
    
    // Google Custom Search API key and Search Engine ID
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API key
    const searchEngineId = 'YOUR_SEARCH_ENGINE_ID'; // Replace with your Search Engine ID
    const endpoint = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(foodName)}&cx=${searchEngineId}&searchType=image&key=${apiKey}`;

    try {
        // Fetch image from Google Custom Search API
        const response = await axios.get(endpoint);

        // Check if there are results
        if (response.data.items && response.data.items.length > 0) {
            const imageUrl = response.data.items[0].link; // Get the first image link

            // Send the image to the chat
            api.sendMessage({
                body: `Here's an image of ${foodName}:`,
                attachment: await axios.get(imageUrl, { responseType: 'arraybuffer' }).then(res => {
                    return Buffer.from(res.data, 'binary');
                })
            }, event.threadID, event.messageID);
        } else {
            // No results found
            api.sendMessage(`Sorry, I couldn't find an image for that food item. Please try a different name.`, event.threadID, event.messageID);
        }
    } catch (error) {
        console.error("Error fetching image:", error.message);
        api.sendMessage("There was an error retrieving the image. Please check back later.", event.threadID, event.messageID);
    }
};
