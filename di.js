const config = require('./config');
const Twit = require('twit');
const recastai = require('recastai');
const recastClient = new recastai.request(config.recast.request_token, 'en');

const BotStream = require('./bot_stream');
const BotMentions = require('./bot_mentions');
const Tweet = require('./tweet');

const T = new Twit({
    consumer_key:         config.twitter.consumer_key,
    consumer_secret:      config.twitter.consumer_secret,
    access_token:         config.twitter.access_token,
    access_token_secret:  config.twitter.access_token_secret,
    timeout_ms:           config.twitter.timeout_ms,  // optional HTTP request timeout to apply to all requests.
});

const twt = new Tweet(T);

module.exports = {
    T: T,
    recast: recastClient,
    botStream: new BotStream(config, T, recastClient, twt),
    botMentions: new BotMentions(config, T, recastClient, twt),
    twt: twt,
};
