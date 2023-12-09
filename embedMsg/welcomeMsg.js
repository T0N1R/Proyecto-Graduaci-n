import { MessageEmbed } from "discord.js";

const welcomeMsg = new MessageEmbed()
    .setColor([0, 255, 255])
    .setTitle("Welcome")
    .setURL("https://youtu.be/wd2mV4KkAG4")
    .setAuthor({
        name: 'Emma Frost',
        iconURL: 'https://insidepulse.com/wp-content/uploads/2019/05/House-of-X-Powers-Of-X-X-Men-logo-symbol-e1558148793647.jpg',
        url: "https://marvel.fandom.com/wiki/Emma_Frost_(Earth-616)?so=search"
    }
    )
    .setDescription("Descripción del Embed Message")
    .setThumbnail("https://geekd-out.com/wp-content/uploads/2021/10/inferno-2-feat.jpeg")
    .addFields(
        {
            name: "Powers",
            value: "Emma welcomes you to Krakoa"
        },
        {
            name: "Col 1",
            value: "Columna 1 descripcion",
            inline: true
        },
        {
            name: "Col 2",
            value: "Columna 2 descripcion",
            inline: true
        }
    )
    .setImage("https://cdn.vox-cdn.com/thumbor/5nAYzWf54TdyHPX3xQo7Ygbf1lY=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/22889116/white_queen_inferno.jpg")
    .setTimestamp()
    .setFooter({
        text: "Emma Frost",
        iconURL: "https://geekd-out.com/wp-content/uploads/2021/10/inferno-2-feat.jpeg"
    })

export default welcomeMsg