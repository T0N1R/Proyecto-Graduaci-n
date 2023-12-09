import { MessageEmbed } from "discord.js";

/**
 * embedMessage with confirming registration, the character sending the message is based on chat location
 * @param {object} charaterInfo object with character name,url and images
 * @param {object} messageContent obect with message content
 * @returns embedMessage
 */
const sendReg = (charaterInfo, messageContent) => {
    let registerMessage = new MessageEmbed()
        .setColor(charaterInfo.emColor)
        .setAuthor({
            name: charaterInfo.name,
            iconURL: charaterInfo.iconURL,
            url: charaterInfo.url
        })
        .setImage(charaterInfo.image)
        .setTimestamp();
    
    for (let i = 0; i < messageContent.length; i++) {
        registerMessage.addFields(messageContent[i]);
    }

    return registerMessage;
}

export default sendReg;