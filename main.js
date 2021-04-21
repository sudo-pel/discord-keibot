const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();
const token = process.env.BOT_TOKEN

const shuffle = require('shuffle-array');

const Sequelize = require('sequelize');

const { questions, playerdata, parameters, serversettings } = require('./dbObjects');

const { ask, getQuestion, formatQuestion } = require('./questionHandler');

const answer = require(`./answerHandler`);

const cron = require('node-cron');

const moment = require('moment');

const leaderboard = require('./commands/leaderboard');

const stats = require('./commands/stats');

const help = require('./commands/help');

// HELPER FUNCTIONS

// APP BODY
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.slice(0, 2) != '--') return;

    
    if (message.content.toLowerCase() == "--dailyreset" && message.author.id == "151042614047670272") {
        dailyReset();
    }
    

    const arguments = message.content.toLowerCase().split(' ');
    const command = arguments[0].slice(2);

    if (command == "answer") {
        answer(message.author, message.channel);
    }

    else if (command == "askhere") {
        
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`You need the "Manage Channels" permission to use that command!`)

        var server = await serversettings.findOne({
            where: {
                id: message.guild.id
            }
        });

        if (server) {
            server.questionChannel = message.channel.id;
        }

        else {
            server = await serversettings.create({
                id: message.guild.id,
                questionChannel: message.channel.id,
            })
        }

        await server.save();

        message.channel.send("Questions will be asked in this channel from now on. If you want today's question posted here, just say '--repost'.")

        if (!server.currentQuestion) { ask(message.channel) }
    }

    else if (command == "repost") {
        var server = await serversettings.findOne({
            where: { id: message.guild.id }
        });
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`You need the "Manage Channels" permission to use that command!`)
        if (!server) return message.channel.send(`This bot can't post questions, because it hasn't been set up! Use '--askhere' to set it up.`);
        if (!server.currentQuestion) return message.channel.send(`There is no current question!`);
        const question = await questions.findOne({
            where: { id: server.currentQuestion },
        })
        if (!question.active) {
            message.channek.send(`This question is inactive now. I will generate a new one...`);
            ask(message.channel);
        } else {
            message.channel.send(await formatQuestion(question, moment().utcOffset(1).format("dddd, MMMM Do YYYY")));
        }
    }

    else if (command == "pause") {
        var server = await serversettings.findOne({
            where: { id: message.guild.id }
        });
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`You need the "Manage Channels" permission to use that command!`)
        if (!server) return message.channel.send(`This bot can't be paused, because it hasn't been set up! Use '--askhere' to set it up.`);
        server.status = "paused";
        server.save()
        .then(message.channel.send(`I will not longer ask questions. To unpause me, say '--unpause'.`))
    }

    else if (command == "unpause") {
        var server = await serversettings.findOne({
            where: { id: message.guild.id }
        });
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`You need the "Manage Channels" permission to use that command!`)
        if (!server) return message.channel.send(`This bot can't unpaused, because it hasn't been set up! Use '--askhere' to set it up.`);
        server.status = "on";
        server.save()
        .then(message.channel.send(`I have been unpaused.`));
    }

    else if (command == "status") {
        var server = await serversettings.findOne({
            where: { id: message.guild.id }
        });
        if (!server) { return message.channel.send(`I haven't been set up yet!`)}
        
        message.channel.send(`My current status is ${server.status}.`)
    }

    else if (command == "leaderboard" || command == "lb") {
        leaderboard(message, arguments, client)
    }

    else if (command == "stats") {
        stats(message, arguments, client);
    }

    else if (command == "help") {
        help(message, arguments);
    }

});

var test = false;

async function dailyReset() {
    if (test) return;
    test = true;

    // handle all player stuff
    const players = await playerdata.findAll();
    const updateStack = [];

    players.forEach(
        async (player) => {
            if (!player.answeredToday) { player.streak = 0 }
            player.answeredToday = false;
            player.currentlyAnswering = undefined;
            await player.save();
        }
    )


    const date = moment().utcOffset(1);

    // ask new question in all servers
    var servers = await serversettings.findAll();
    servers.forEach(async server => {
        // ask question
        if (!server.questionChannel || server.status == "paused") return;
        const mainChannel = client.guilds.cache.get(server.id).channels.cache.get(server.questionChannel);
        const questionid = await ask(mainChannel);

        // save question to parameters
        const newParam = await parameters.create({
            guild: server.id,
            date: date,
            qotdID: questionid,
            answered: "",
            channel: mainChannel.id
        });

        await newParam.save();
        
    })

    test = false
};

cron.schedule("0 0 9 */1 * *", dailyReset);

client.once("ready", () => {
    console.log("Kei is ready for action.");
})

client.login(token);