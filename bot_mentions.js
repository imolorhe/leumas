
class BotMentions {
    constructor(config, T, recast, twt) {
        this.config = config;
        this.T = T;
        this.recast = recast;
        this.twt = twt;
        this.stream = null;
        this.noReply = [
            ':D',
            'Well..',
            '!',
            'Well it doesn\'t hurt'
        ];
    }

    startStream() {
        this.stream = this.T.stream('statuses/filter', { track: this.config.twitter.bot.screen_name });
        console.log('Bot mentions streaming...');

        this.stream.on('message', (data) => {
            console.log('\n\n From bot mentions..', data);
            if (data.entities && data.entities.user_mentions) {
                if (data.entities.user_mentions.find(mention => mention.id == this.config.twitter.bot.id)) {
                    // If the bot was mentioned, respond..
                    const msg = data.text;
                    const user = data.user.screen_name;

                    this.recast.converseText(msg).then(res => {
                        if (res.action) { console.log('Action: ', res.action.slug) }
                        const reply = res.reply();
                        console.log('Reply: ', reply);
                        if (reply) {
                            this.twt.reply(`@${user} ${reply}`, data.id);
                        } else {
                            this.twt.reply(`@${user} ${this.getNoReply()}`, data.id);
                        }
                    });

                    // KFB the user
                    this.twt.kfb(data.user.id);
                }
            }
        });
    }

    /**
     * Returns a random reply
     * @returns {string}
     */
    getNoReply() {
        return this.noReply[Math.floor(Math.random() * this.noReply.length)];
    }
}

module.exports = BotMentions;