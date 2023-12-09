
const redirect_voicechat_all = (interaction, voice_channel_name , voice_channel_destination, users_id) => {
    for (let index = 0; index < users_id.length; index++) {
        interaction.guild.members.cache.get(users_id[index]).voice.setChannel(voice_channel_destination);
    }

    interaction.reply(`cambio al canal: **${voice_channel_name}**`)
}

export default redirect_voicechat_all;