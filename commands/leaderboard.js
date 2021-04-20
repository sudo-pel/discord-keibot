const Discord = require('discord.js');

const { playerdata } = require('../dbObjects');

module.exports = async (message, arguments, client) => {
    const channel = message.channel;
    console.log("called");
    // handle arguments
    var lbtype;
    if (!arguments[1]) {
        return channel.send(`It looks like you didn't type the right thing. If you need help, just type '--help lb' or '--help leaderboard'.`)
    } else { lbtype = arguments[1] }

    const server = arguments[2] == "server" || arguments[2] == "s" ? true : false;

    var players = await playerdata.findAll();

    if (server) {
        players = players.filter(player => {
            return message.guild.member(player.user_id)
        })
    }

    if (players.length < 1) return channel.send(`There are no players for this leaderboard!`)

    var leaderboard;

    // leaderboard for current streak
    // --lb c(urrent)s(treak) [server]
    if (lbtype == "cs" || lbtype == "currentstreak") {
        leaderboard = generateLeaderboard(`${server ? message.guild.name + ' - ' : ""}Highest current streak`, '2EFF09', players, 'streak', 10, {}, client)
    }

    // leaderboard for highest streak
    // --lb t(op)s(treak) [server]
    else if (lbtype == "ts" || lbtype == "topstreak") {
        leaderboard = generateLeaderboard(`${server ? message.guild.name + ' - ' : ""}Highest maximum streak`, '2EFF09', players, 'maxStreak', 10, {}, client)
    }

    // leaderboard for most gold
    // --lb g(old) [server]
    else if (lbtype == "g" || lbtype == "gold") {
        leaderboard = generateLeaderboard(`${server ? message.guild.name + ' - ' : ""}Richest users`, '2EFF09', players, 'balance', 10, {addon: 'G'}, client)
    }

    // leaderboard for most questions correct
    // --lb q(uestions) [server]
    else if (lbtype == "q" || lbtype == "questions") {
        leaderboard = generateLeaderboard(`${server ? message.guild.name + ' - ' : ""}Most questions correct`, '2EFF09', players, 'questionsCorrect', 10, {}, client)
    }

    else {
        return channel.send(`It looks like you didn't type the right thing. If you need help, just type '--help lb' or '--help leaderboard'.`)
    }

    channel.send({ embed: leaderboard})

}

function generateLeaderboard(title, colour, users, property, top, options, client) {
    users.sort((a, b) => {
        if (b[property] > a[property]) { return 1 }
        return -1
    })

    console.log(users);
    console.log(users[0]);

    var lbstring = "";
    for (var i = 1; i <= top; i++) {
        if (!users[i-1]) break;
        lbstring += `${i} - **${client.users.cache.find(user => { return user.id == users[i-1].user_id}).tag}** - ${users[i-1][property]}${options.addon ? options.addon : ""}\n`
    }

    const embed = {
        "title": `${title}`,
        "color": colour,
        
        "thumbnail": {
            "url": `${client.users.cache.find(user =>{ return user.id == users[0].user_id }).avatarURL()}`
        },
        
      
        "fields": [
            {
                "name": "** **",
                "value": `${lbstring}`
            }
        ]
    };

    return embed;
}