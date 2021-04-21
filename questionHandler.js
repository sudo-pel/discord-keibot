const Sequelize = require('sequelize');
// need for random command
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const { questions, playerdata, parameters, serversettings } = require('./dbObjects');

const shuffle = require('shuffle-array');
const Discord = require('discord.js');
const moment = require('moment');

var currentQuestion = undefined;

async function ask(channel) {
    console.log("aaaa");
    // find random question (I don't think getting a question that hasn't been asked before is worth it)
    var question;

    await questions.findOne({
        order: sequelize.random(),
        where: {
            active: true
        }
    })
    .then(q => { question = q.dataValues } )
    .catch(e => { channel.send(`Couldn't find a question for some reason.`) })

    // set current to question
    var thisserversettings = await serversettings.findOne({
        where: {
            id: channel.guild.id,
        }
    })
    if (!thisserversettings) {
        thisserversettings = serversettings.create({
            id: channel.guild.id,
            currentQuestion: question.id
        })
    } else {
        thisserversettings.currentQuestion = question.id;
    };
    thisserversettings.save();

    // post question in designated channel
    await channel.send(await formatQuestion(question, moment().utcOffset(1).format("dddd, MMMM Do YYYY")));
    
    return question.id;
}

async function getQuestion(guild) {
    var thisserversettings = await serversettings.findOne({
       where: {
            id: guild.id
        }
    })
    if (!thisserversettings) return false;
    var questionid = thisserversettings.currentQuestion;
    if (!questionid) return false;
    return await questions.findOne({
        where: {
            id: questionid,
        }
    })
}

async function formatQuestion(question, date) {
    const embedToSend = new Discord.MessageEmbed()
        .setAuthor(date)
        .setDescription(question.description)
        .setTitle(question.title)
        .setImage(question.diagram)

    return embedToSend
}

module.exports = { getQuestion, ask, formatQuestion };
