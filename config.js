module.exports = {
    twitter: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 60*1000,
        me: {
            id: process.env.TWITTER_ME_ID,
            screen_name: process.env.TWITTER_ME_NAME
        },
        bot: {
            id: process.env.TWITTER_BOT_ID,
            screen_name: process.env.TWITTER_BOT_NAME
        }
    },
    recast: {
        request_token: process.env.RECAST_REQUEST_TOKEN
    }
};