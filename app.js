import discord, { MessageAttachment } from 'discord.js';
import sendReg from './embedMsg/sendReg.js'
import dotenv from 'dotenv';
import characters from './characters/characters.js'
import welcomeMsg from './embedMsg/welcomeMsg.js';
import get_online_users from './common-functions/get-online-users.js';
import redirect_voicechat_all from './common-functions/redirect-to-voicechat.js';
import get_voice_channels from './common-functions/get-voice-channels.js';

import AWS from 'aws-sdk'
//const AWS = require('aws-sdk');
const bucketName = '< nombre del bucket de S3 >';
AWS.config.update({
  accessKeyId: '< accessKeyId >',
  secretAccessKey: '< secretAccessKey >',
});
const s3 = new AWS.S3();
const tz = 'America/Guatemala';

dotenv.config();

const prefix = "$"
const client = new discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
let BOT_ID = ""
let ONLINE_USERS = []

let slashCommands = [
    {
        name: "ping",
        description: "Devuelve el ping de el bot",
        run: async (client, interaction) => {
            await interaction.followUp({ content: `Ping: ${client.ws.ping} ms` });
        },
    },
    {
        name: "hola",
        description: "Devuelve un saludo",
        run: async (client, interaction) => {
            await interaction.followUp({ content: "Hola, ¿como estas?" });
        },
    }
    
];

client.slash = new discord.Collection();

// codigo
client.once('ready', async (bot) => {
    BOT_ID = bot.user.id
    console.log(
        `Bot: ${bot.user.username} \n Status: ${bot.presence.status} \n ID: ${bot.user.id}`
    );

    client.user.setStatus('online');
    client.user.setActivity('', { type: "WATCHING" });

    for (let index = 0; index < slashCommands.length; index++) {
        client.slash.set(slashCommands[index].name, slashCommands[index]);
    }

    await client.application.commands.set(slashCommands)

});


client.login(process.env.DISCORD_TOKEN);



/**
 * creado para slash commands
 */
client.on("interactionCreate", async (interaction) => {

    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch((obj) => {
            console.log(obj)
        });

        console.log(client.slash.get(interaction.commandName));

        const command = client.slash.get(interaction.commandName);

        if (!command) {
            return interaction.followUp({ content: "Comando no registrado" });
        }

        const args = [];

        try {
            command.run(client, interaction, args);
        } catch (error) {
            console.log(error)
        }

    }
})

client.on('messageReactionAdd', (reaction, user) => {

    console.log('a reaction has been added');

    console.log(reaction)

    console.log(user)

});

/**
 * Captar mensaje
 */
client.on("messageCreate", (msg) => {

    if (msg.author.bot) {
        return console.log(`Mensaje de ${msg.author.username}`);
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'America/Guatemala' });
    console.log(formattedDate);

    let fileName = formattedDate.split(',')[0].replace(/\//g, '-') + '.txt';

    let msgNOEnter = msg.content.replace(/(\r\n|\n|\r)/gm, " ");

    let messageContent = msg.author.username + " , " + msg.channel + " , " + formattedDate + " , " + msgNOEnter;

    s3.headObject({ Bucket: bucketName, Key: fileName }, (err) => {
  if (err && err.code === 'NotFound') {
    s3.putObject({ Bucket: bucketName, Key: fileName, Body: '' }, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`Successfully created ${fileName}`);

      s3.getObject({ Bucket: bucketName, Key: fileName }, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
    
        const body = data.Body.toString('utf-8');
        const newBody = body + messageContent + "\n";
    
        s3.putObject({ Bucket: bucketName, Key: fileName, Body: newBody }, (err) => {
          if (err) {
            console.log(err);
            return;
          }
    
          console.log(`Successfully added formattedDate to ${fileName}`);
        });
      });

    });
  } else if (err) {
    console.log(err);
    return;
  }

  s3.getObject({ Bucket: bucketName, Key: fileName }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const body = data.Body.toString('utf-8');
    const newBody = body + messageContent + "\n";

    s3.putObject({ Bucket: bucketName, Key: fileName, Body: newBody }, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`Successfully added formattedDate to ${fileName}`);
    });
  });
});

    if (msg.content.startsWith(prefix)) {
        const argumentos = msg.content.slice(prefix.length).split(/ +/);

        const comando = argumentos.shift().toLowerCase();

        console.log(argumentos)
        console.log("comando: " + comando)

        

        /**
         * COMANDO: voiceall
         * mover a todos los usuarios que estan en un voice channel a uno especifico
         */
        if (comando == "voiceall") {
            // obtener los usuarios en linea
            ONLINE_USERS = get_online_users(msg, BOT_ID);

            // diccionario con nombre de voice channel y su id
            let voice_channels_dict = get_voice_channels(msg, BOT_ID);

            let combined_arguments = "";

            // combinar argumentos en un solo string (para ponder reconocer nombres como "Grupo 1")
            for (let index = 0; index < argumentos.length; index++) {
                if (index != 0) {
                    combined_arguments = combined_arguments + " ";
                }
                combined_arguments = combined_arguments + argumentos[index];
            }

            console.log("Combined arguments: " + combined_arguments);

            if (voice_channels_dict[combined_arguments] != undefined) {
                try {
                    redirect_voicechat_all(msg, combined_arguments, voice_channels_dict[combined_arguments], ONLINE_USERS);
                } catch (e) {
                    msg.reply("hubo un problema")
                }
            }

        }

        // AFD

        if (comando == "vchannels") {
            let result_dict = get_voice_channels(msg, BOT_ID);
            console.log(result_dict)
        }

        if (comando == "categorias") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/categorias.png")
        }

        if (comando == "afd100") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afd100.png")
        }

        if (comando == "afd200") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afd200.png")
        }

        if (comando == "afd300") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afd300.png")
        }

        if (comando == "afd400") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afd400.png")
        }

        if (comando == "afd500") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afd500.png")
        }



        // AFN

        if (comando == "afnd100") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afnd100.png")
        }

        if (comando == "afnd200") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afnd200.png")
        }

        if (comando == "afnd300") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afnd300.png")
        }

        if (comando == "afnd400") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afnd400.png")
        }

        if (comando == "afnd500") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/afnd500.png")
        }


        // ANALISIS LEXICO

        if (comando == "analisis_lexico100") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/aLexico100.png")
        }

        if (comando == "analisis_lexico200") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/aLexico200.png")
        }

        if (comando == "analisis_lexico300") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/aLexico300.png")
        }

        if (comando == "analisis_lexico400") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/aLexico400.png")
        }

        if (comando == "analisis_lexico500") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/aLexico500.png")
        }


        // EXPRESIONES REGULARES

        if (comando == "expresion_regular100") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/eRegular100.png")
        }

        if (comando == "expresion_regular200") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/eRegular200.png")
        }

        if (comando == "expresion_regular300") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/eRegular300.png")
        }

        if (comando == "expresion_regular400") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/eRegular400.png")
        }

        if (comando == "expresion_regular500") {
            msg.channel.send("https://discord-bot-bucket-uvg.s3.amazonaws.com/files/eRegular500.png")
        }

        if (comando == "getfile") {

            let combined_arguments = "";

            // combinar argumentos en un solo string (para ponder reconocer nombres como "Grupo 1")
            for (let index = 0; index < argumentos.length; index++) {
                if (index != 0) {
                    combined_arguments = combined_arguments + " ";
                }
                combined_arguments = combined_arguments + argumentos[index];
            }

            console.log("combined_arguments: ")
            console.log(combined_arguments)

            if (combined_arguments == "clase1.txt") {
                console.log("entramos")

                msg.channel.send({
                    files: [
                        "./files/clase1.txt"]
                });

            }

            if (combined_arguments == "clase1.pptx") {
                console.log("entramos")

                msg.channel.send({
                    files: [
                        "./files/clase1.pptx"]
                });

            }

            if (combined_arguments == "clase1Zip.zip") {
                console.log("entramos")

                msg.channel.send({
                    files: [
                        "./files/clase1Zip.zip"]
                });

            }


        }

    }

})

