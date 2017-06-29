
class BotStream {
    constructor(config, T) {
        this.T = T;
        this.stream = null;
    }

    startStream() {
        this.stream = this.T.stream('user', { stringify_friend_ids: true });
        console.log('Bot streaming...');

        this.stream.on('user_event', (data) => {
            console.log('BOT ACTIVITY: ', data.event);
            switch (data.event) {
                case 'favorite':
                    // Thank user
                    // Follow user
                    break;
                case 'follow':
                    // KFB the user
                    break;
            }
        });
    }
}

module.exports = BotStream;