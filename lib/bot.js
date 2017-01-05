var async = require('async')
var Discord = require("discord.js")

var API = require('./api');

class Bot {
    constructor(client, apiKey) {

        this.api = new API(apiKey)

        this.commands = []


        var options = {
            disableEveryone: true
        }
        this.client = new Discord.Client(options);
        var token = process.env.DISCORD_TOKEN
        this.client.login(token).then(token => {
            console.log('Successfully logged in');
            this.client.user.setGame('Guild Wars 2');
            this.client.user.setUsername('Lion\'s Arch')
             .then(user => console.log(`Updated username: ${user.username}`))
             .catch(console.log);
        }).catch(error => console.log('There was an error logging in: ' + error));


        this.client.on('message', this.onMessage.bind(this))
    }

    onMessage(message) {
        if (!this.commands || message.author.bot) {
            return;
        }
        this.commands.forEach(command => {
            if(message.content.indexOf(command.prefix) !== 0) {
                return;
            }
            var restOfMessage = message.content.substr(command.prefix.length);
            command.func(restOfMessage, (err, res) => {
                if (err) { message.reply('There was an error handling that, try again later.') }
                if (res) { message.reply(res); }
            })
        })
    }


    addCommand(prefix, func) {
        this.commands.push({
            prefix: prefix,
            func: func
        })
        console.log(`Added new command: ${prefix}`)
    }

    getDailyFractals(callback) {
        var match = "Daily Tier 4"
        var dailys = []

        this.api.getAchievementsByCategory(88, (err, res) => {
            var promises = res.achievements.map((achiev) => {
                return new Promise((resolve, reject) => {
                    this.api.getAchievementDetails(achiev, (err, detail) => {

                        // Check the name is valid
                        if (detail.name.indexOf(match) === -1) {
                            // we don't want to reject here as it fails the entire chain
                            // reject(`${detail.name} has an invalid name`);
                            resolve(null)
                            return
                        }

                        resolve(detail)
                    })
                })
            })

            Promise.all(promises)
            .then(res => {
                var results = res.filter(r => r)
                callback(null, results)
            })
            .catch(err => {
                callback(err)
            })
        })
    }
}


module.exports = Bot
