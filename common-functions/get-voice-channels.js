const get_voice_channels = (msg) => {

    let voice_channel_dict = {}

    msg.guild.channels.cache.each(channel => {
        if (channel.type == "GUILD_VOICE"){
            voice_channel_dict[String(channel.name)] = channel.id
        }
    })

    return voice_channel_dict

}

export default get_voice_channels