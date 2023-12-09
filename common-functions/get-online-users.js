
const get_online_users = (msg, BOT_ID) => {
    msg.guild.members.fetch() //cache all members in the server
    // console.log(msg.guild.roles.cache)
    const role = msg.guild.roles.cache.find(role => role.name === "@everyone") //the role to check
    const totalAdmin = []
    role.members.map(m => {
        if (m.id != BOT_ID){
            totalAdmin.push(m.id)
        }
    })
    console.log(totalAdmin)

    return totalAdmin

}

export default get_online_users;