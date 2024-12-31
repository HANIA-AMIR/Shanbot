module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Upload an image from a link or attachment to Imgur",
    commandCategory: "Game",
    usages: "[reply with image/link]",
    cooldowns: 5,
    dependencies: {
      "axios": ""
    }
};

module.exports.run = async ({ api, event }) => {
    const axios = global.nodemodule['axios'];
  
    // Get the link from the attachment or the message
    const attachment = event.messageReply?.attachments?.[0]?.url;
    const linkanh = attachment || args?.join(" ");

    // Check if there is an image URL or attachment
    if (!linkanh) {
        return api.sendMessage('Please reply with an image or provide a link to an image!', event.threadID, event.messageID);
    }

    try {
        // Make the request to the Imgur API with the image link
        const res = await axios.get(`https://imgur-api-by-koja.xx0xkoja.repl.co/imgur?link=${encodeURIComponent(linkanh)}`);
        
        // Check if the upload was successful
        const img = res.data?.uploaded?.image;
        if (!img) {
            throw new Error('Failed to upload image.');
        }
        
        // Return the Imgur link to the user
        return api.sendMessage(`Uploaded Image: ${img}`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage('An error occurred while uploading the image to Imgur. Please try again later.', event.threadID, event.messageID);
    }
};
