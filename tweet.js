
class Tweet {
    constructor(T) {
        this.T = T;
        this.kfbTweets = [
            'Awesome stuff. \uD83D\uDE00',
            `Cool. ${String.fromCodePoint(128076)}`
        ];
    }

    /**
     * Retweet a tweet
     * @param id
     */
    retweet(id) {
        return new Promise((resolve, reject) => {
            this.T.post('statuses/retweet/:id', { id: id }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                console.log('Retweeted.', id);
                return resolve(data);
            });
        });
    }

    /**
     * Follow a user and request for a follow back
     * @param user_id
     */
    kfb (user_id) {
        return this.isFollowing(user_id).then(isFollowing => {
            if (!isFollowing) {
                return this.follow(user_id).then(data => {
                    if (data.screen_name) {
                        this.tweet(`@${data.screen_name} ${this.getKfbTweet()}`).then(data => {
                            console.log('KFBed.', user_id);
                            return data;
                        });
                    }
                });
            }
        });
    }

    /**
     * Follow a user
     * @param user_id
     * @returns {Promise}
     */
    follow (user_id) {
        return new Promise((resolve, reject) => {
            this.T.post('friendships/create', { user_id }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                console.log(data);
                console.log('Followed.', user_id);
                return resolve(data);
            });
        });
    }

    /**
     * Check if bot is following another user
     * @param user_id
     * @returns {Promise}
     */
    isFollowing (user_id) {
        return this.friendship(user_id).then(connections => connections.includes('following'));
    }

    /**
     * Gets the friendship status between the bot and a user
     * @param user_id
     * @returns {Promise}
     */
    friendship (user_id) {
        return new Promise((resolve, reject) => {
            this.T.get('friendships/lookup', { user_id }, (err, data) => {
                if (err) {
                    return reject(err);
                }

                const _data = data[0].connections;
                console.log('Frendship status.', _data);
                return resolve(_data);
            });
        });
    }

    /**
     * Send a tweet
     * @param tweet
     * @param in_reply_to_status_id
     * @returns {Promise}
     */
    tweet (tweet, in_reply_to_status_id) {
        return new Promise((resolve, reject) => {
            this.T.post('statuses/update', { status: tweet, in_reply_to_status_id}, (err, data) => {
                if (err) {
                    return reject(err);
                }
                console.log('Tweeted.', tweet);
                return resolve(data);
            });
        });
    }

    /**
     * Reply a tweet
     * @param tweet
     * @param in_reply_to_status_id
     * @returns {Promise}
     */
    reply(tweet, in_reply_to_status_id) {
        return this.tweet(tweet, in_reply_to_status_id);
    }

    /**
     * Get a list of friends of a user
     * @param user_id
     * @returns {Promise}
     */
    friends (user_id) {
        return new Promise((resolve, reject) => {
            this.T.get('friends/list', { user_id }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    /**
     * Get a list of followers of a user
     * @param user_id
     * @returns {Promise}
     */
    followers (user_id) {
        return new Promise((resolve, reject) => {
            this.T.get('followers/list', { user_id }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }


    /**
     * Get a list of retweeters
     * @param id
     * @returns {Promise}
     */
    retweeters (id) {
        return new Promise((resolve, reject) => {
            this.T.get('statuses/retweeters/ids', { id }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    /**
     * Returns a random KFB tweet
     * @returns {string}
     */
    getKfbTweet() {
        return this.kfbTweets[Math.floor(Math.random() * this.kfbTweets.length)];
    }

}

module.exports = Tweet;