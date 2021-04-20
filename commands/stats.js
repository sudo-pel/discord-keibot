const Discord = require('discord.js');
const { playerdata } = require('../dbObjects');

module.exports = async (message, arguments, client) => {
    const channel = message.channel;

    // figure out whose stats they want using argument, and get player ID
    var targetid;
    if (!arguments[1]) { targetid = message.author.id }
    else {
        targetid = arguments[1].slice(3).slice(0, -1);
    }

    // query player information from database
    const player = await playerdata.findOne({
        where: {
            user_id: targetid,
        }
    });
    if (!player) return channel.send(`Couldn't find the player. They might not've interacted with the bot before.`)
    const playerinfo = client.users.cache.find(user => { return user.id == targetid });

    // generate an embed and post
    const infostring = `Gold: ${player.balance}G\nQuestions correct: ${player.questionsCorrect}\nCurrent streak: ${player.streak}\nMax streak: ${player.maxStreak}`
    const embed = {
        "title": `${playerinfo.tag}'s details`,
        "color": '2EFF09',
        
        "thumbnail": {
            "url": `${playerinfo.avatarURL()}`
        },
        
      
        "fields": [
            {
                "name": "** **",
                "value": `${infostring}`
            }
        ]
    };
    
    channel.send({embed: embed})
}