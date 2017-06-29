const config = require('./config');
const di = require('./di');
const T = di.T;
const recast = di.recast;
const botStream = di.botStream;
const botMentions = di.botMentions;
const twt = di.twt;

const me = config.twitter.me.id;

// Bot works
// ========
// When user follows you, kfb user's friends
// Follow javascript and retweet intermittently, in a new streaming class


let stream = T.stream('statuses/filter', { follow: me });
// let stream = T.stream('statuses/filter', { track: 'javascript' });

// twt.kfb(484981415);
// twt.isFollowing(484981415).then(console.log);

console.log('Streaming..');
stream.on('message', function (tweet) {
    console.log('\n\n User status filtering...', tweet);

    // If the message is a reply to the specified user's tweet, then we go to work.
    if (tweet.in_reply_to_user_id_str === me) {
        if (tweet.user.id === 879486067879157800 || tweet.user.id === me) {
            return false;
        }
        recast.converseText(tweet.text)
            .then(function(res) {
                if (res.action) { console.log('Action: ', res.action.slug) }
                const reply = res.reply();
                console.log('Reply: ', reply);
            });
    }

    processTweet(tweet);
});

botStream.startStream();
botMentions.startStream();
const isItMeOrBot = id => id == config.twitter.bot.id || id == config.twitter.me.id;
const isItBot = id => id == config.twitter.bot.id;
const isItMe = id => id == config.twitter.me.id;
const isBotMentioned = mentions => mentions.find(mention => mention.id == config.twitter.bot.id);
const shouldProcessTweet = () => Math.floor(Math.random() * 20) > 10;

const processTweet = (tweet) => {
    if (tweet.user && isItBot(tweet.user.id_str) || isBotMentioned(tweet.entities.user_mentions) || !shouldProcessTweet()) {
        // Don't process tweets from the bot, or if bot is mentioned
        return false;
    }

    if (tweet.retweeted_status && tweet.retweeted_status.created_at) {
        // If retweeting a tweet..
        if (isItMeOrBot(tweet.retweeted_status.user.id_str)) {
            // Don't do anything if the original tweet is from me or the bot
            return false;
        }

        // Retweet the tweet
        twt.retweet(tweet.retweeted_status.id_str);

        // KFB the tweeter
        if (!isItMe(tweet.retweeted_status.user.id_str)) {
            twt.kfb(tweet.retweeted_status.user.id_str);
        }

        // KFB the friends of the tweeter
        // twt.friends(tweet.retweeted_status.user.id_str).then(data => {
        //     if (!data) return;
        //     data.users.forEach(user => {
        //         twt.kfb(user.id_str);
        //     });
        // });

        // KFB the other retweeters
        // twt.retweeters(tweet.retweeted_status.id_str).then(data => {
        //     data.ids.forEach(id => {
        //         twt.kfb(id);
        //     });
        // }).catch(err => console.log(err));
    } else if (tweet.in_reply_to_status_id) {
        // If replying a user..

        // Retweet the tweet
        twt.retweet(tweet.id_str).then(data => {
            console.log(data);
        }).catch(err => console.log(err));

        // KFB the tweeter
        // twt.kfb(tweet.in_reply_to_user_id_str);
    } else {
        // If tweet is original..
        // Retweet the tweet
        twt.retweet(tweet.id_str);
    }
};