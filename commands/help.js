module.exports = (message, arguments) => {
    const channel = message.channel;
    if (!arguments[1]) {
        return channel.send(`If you need help setting up the bot, say '--help setup'. If you need help with the leaderboard command, say '--help lb/leaderboard'. If you need help answering questions, say '--help answer'. If you just want to see all the commands, say '--help commands'. `)
    }
    if (arguments[1] == 'lb' || arguments [1] == 'leaderboard') {
        const embed = {
              "title": "Keibot - Leaderboard help",
              "color": 3079945,
          
              "fields": [
                {
                  "name": "** **",
                  "value": "There are a couple of different leaderboards you can view. To view a version of the leaderboard that only shows members of your server, just add ' server' or ' s' onto the end of your command."
                },
                {
                  "name": "--leaderboard/lb currentstreak/cs",
                  "value": "View the players with the top 10 current streaks."
                },
                {
                  "name": "--leaderboard/lb topsreak/ts",
                  "value": "View the players with the top 10 streaks of all time."
                },
                {
                  "name": "--leaderboard/lb gold/g",
                  "value": "View the top 10 richest players."
                },
                {
                  "name": "--leaderboard/lb questions/q",
                  "value": "View the players who have answered the top 10 most questions."
                }
                
                
          
              ]
        }
        channel.send({embed: embed})
    }

    if (arguments[1] == 'setup') {
        const embed = {
                  "title": "Keibot - Setup",
                  "color": 3079945,
              
                  "fields": [
                    {
                      "name": "** **",
                      "value": "Setting up the bot is really simple. Once a day, it will post a question in a channel that you specify. To specify a channel, type '--askhere' in whatever channel you would like Kei to post in. Players can input '--answer' in any channel they want, but will answer the question via a DM from the bot."
                    }
                    
                    
              
                  ]

        }
        channel.send({embed: embed})
    }

    if (arguments[1] == 'answer') {
        const embed = {
              "title": "Keibot - Answering questions",
              "color": 3079945,
          
              "fields": [
                {
                  "name": "** **",
                  "value": "To answer a question, input '--answer' in any channel. Just ensure that it's in the correct server. Kei will DM you, and you can respond with the answer. Just make sure that you give it in the exact format requested by the question."
                },
                {
                  "name": "** **",
                  "value": "Most of the questions will have answers that are very easy to type, such as simple numbers or decimals."
                },
                {
                  "name": "** **",
                  "value": "Kei will automatically ignore white spaces in your answer, so don't worry too much about those."
                },
                {
                  "name": "** **",
                  "value": "If you need to input a fraction, do so like this: 5/7. If you need to input a more complicated fraction, use parenthesis; e.g (a+b)/(c+d) = 5/7 if a + b = 5 and c + d = 7."
                },
                {
                  "name": "** **",
                  "value": "Any other notation used should be common nomenclature, but here are a few more pointers in case you're unaware."
                },
                {
                  "name": "Indices",
                  "value": "3² = 3^2"
                },
                {
                  "name": "Logarithms",
                  "value": "Logarithms: logb(a) = log with base b of a (the natural logarithm is ln; e.g lne = 1)"
                }
                
                
                
                
          
              ]
            }
            channel.send({embed: embed})
    }

    if (arguments[1] == "commands") {
        const embed = {
              "title": "Keibot - Commands list",
              "color": 3079945,
          
              "fields": [
                {
                  "name": "leaderboard/lb [parameters] server/s",
                  "value": "Display the top 10 users according to a certain criteria. 'Server' can be omitted to show a leaderboard pertaining to all server. Say '--help leaderboard/lb' for more information."
                },
                {
                  "name": "askhere",
                  "value": "Set the channel wherein Kei will ask questions. The 'Manage Channels permission is needed to run this command.'"
                },
                {
                  "name": "pause",
                  "value": "Stop Kei from asking questions until unpaused. The 'Manage Channels' permission is needed to run this command."
                },
                {
                  "name": "unpause",
                  "value": "Unpause Kei. The 'Manage Channels' permission is needed to run this command."
                },
                {
                  "name": "status",
                  "value": "Show whether Kei is paused or not."
                },
                {
                  "name": "stats [player]",
                  "value": "Show the stats of a user. If a user is omitted, it will display the stats of the poster. If a user has not interacted with Kei bot (i.e not answered any questions), it may not be possible to use this command on them."
                },
                {
                  "name": "repost",
                  "value": "Repost the question for the day. The 'Manage Channels' permission is needed to run this command."
                },
                {
                  "name": "answer",
                  "value": "Attempt to answer a question. The bot will repond via DM asking for an answer."
                },
                {
                  "name": "help",
                  "value": "Gives some useful information."
                }
                
                
                
                
          
              ]
            }
            channel.send({embed: embed})
    }



}