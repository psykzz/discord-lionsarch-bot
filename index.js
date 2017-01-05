var express = require('express')
var app = express()

var Bot = require('./lib/bot')

bot = new Bot()

bot.addCommand("!fractals", (args, callback) => {

    bot.getDailyFractals((err, results) => {
        var output = "Today's daily fractals: \n```\n"

        results.forEach(res => {
            var name = res.name.substr("Daily Tier 4".length + 1)
            var points = res.bits.map((obj) => {
                return obj.text.substr(14)
            })

            output += `${name} [${points.join(", ")}]\n`
        })
        output += "```"

        callback(null, output)
    })
})

// Create a redirect to install the bot.
app.set('port', (process.env.PORT || 5000))
app.get('/', function(req, res) {
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=266603466988716032&scope=bot&permissions=0')
})

app.listen(app.get('port'), function() {
  console.log("Running:" + app.get('port'))
})
