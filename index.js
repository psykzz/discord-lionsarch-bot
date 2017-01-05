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

