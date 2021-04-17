const Discord = require('discord.js');

const { getQuestion }  = require('./questionHandler');

const { questions, playerdata, parameters, serversettings } = require('./dbObjects');

module.exports = async function answer(author, mainChannel) {
    const question = await getQuestion(mainChannel.guild);

    if (!question) {
        mainChannel.send(`There is no active question currently!`);
        return;
    }

    if (question.active == false) {
        mainChannel.send(`The current question is inactive. Ask a moderator to post '--repost' to generate a new question.`);
        return;
    }

    const channel = await author.createDM();
    const user = await getUserData(author.id).catch(e => { console.log(e)})

    const userData = user.dataValues

    user.currentlyAnswering = question.id;
    await user.save();

    if (userData.answeredToday) {
        mainChannel.send(`You've already answered a question today!`);
        return;
    }

    await channel.send(`You are currently answering the question ${question.title}. Please input your answer, or input "--stop" to give up.`)

    const answerRecursive = async function() {
        await channel.awaitMessages( msg => { if (msg.author.bot) { return false } else { return true } }, { max: 1, time: 10000, errors: ['time'] } )
        .then(async msgs => {
            const msg = msgs.first();
            if (msg.content.toLowerCase() == "--stop") {
                channel.send(`No longer accepting answers. If you would like to answer the question, please retype "--answer" in the corresponding server.`);
                return;
            }
            else if (msg.content.toLowerCase().replace(" ", "") == question.answer) {
                channel.send(`That's correct! You got ${question.baseReward}G.`);
                user.questionsCorrect ++;
                user.streak ++;
                //user.answeredToday = true; removed for testing purposes
                user.balance += question.baseReward;
                // streak bonus: +10% for first five days, then +7.5% for ten days, then +5%
                var streakBonus;
                if (user.streak < 6 && user.streak > 0) { streakBonus = 0.1 * question.baseReward * (user.streak - 1)}
                else if (user.streak < 16) { streakBonus = (0.1 * question.baseReward) + (0.075 * (user.streak - 6) * question.baseReward)}
                else { streakBonus = (0.05 * question.baseReward) + (0.075 * question.baseReward) + (0.05 * (user.streak - 16) * question.baseReward) } 
                streakBonus = Math.round(streakBonus);
                user.balance += streakBonus;

                // change max streak if applicable
                if (user.streak > user.maxStreak) {
                    user.maxStreak = user.streak;
                }
                await user.save()

                // tell user results
                channel.send(`You got ${question.baseReward + streakBonus}G! (${question.baseReward} + ${streakBonus} streak reward)`)
                channel.send(`You now have ${userData.balance}G`)
                channel.send(`You have a streak of ${user.streak} days.`)


                // Send got correct message to guild
                const server = await serversettings.findOne({
                    where: {
                        id: mainChannel.guild.id,
                    }
                });

                const questionChannel = await mainChannel.guild.channels.cache.get(server.questionChannel);
                questionChannel.send(`${author.username} got the question right!`)
            }
            else {
                channel.send(`That isn't the correct answer. If you think you've just typed it incorrectly, you can say '--help answer' for assistance with the nomenclature.`);
                answerRecursive();
            }

        })
        .catch(e => {
            channel.send(`You ran out of time, or another error occurred.`)
        })
    };

    answerRecursive()
    .then(q => {
        user.save()
    })
}

async function getUserData(id) {
    var userData;

    await playerdata.findOne({
        where: {
            user_id: id
        }
    }).then(u => { user = u })

    if (user) {
        return user
    }
    
    return playerdata.create({
        user_id: id,

    })
}
