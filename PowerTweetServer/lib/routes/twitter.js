'use strict';

var express = require('express');
var router = express.Router();
var Twit = require('twit');
var fs = require('fs');
var crypto = require('crypto');

var T = new Twit({
    consumer_key: process.env.Twitter_Consumer_Key.trim(),
    consumer_secret: process.env.Twitter_Consumer_Secret.trim(),
    access_token: process.env.Twitter_Access_Token.trim(),
    access_token_secret: process.env.Twitter_Access_Token_Secret.trim()
});

function getSafeSearch(search) {
    var base64 = new Buffer(search).toString('base64');
    return base64.substring(0, base64.length - 2);
}

function mkDir(dir) {
    console.log("mkDir");
    var result = "";
    var x = dir.split("\\");

    for (var d in x) {
        if (result.length > 0) {
            result = result + "\\";
        }

        result += x[d];

        console.log(result);
        if (!fs.existsSync(result)) {
            fs.mkdirSync(result);
        }
    }
}

function getTokenPath(search, id) {
    console.log("getTokenPath");
    return "tokens\\" + getSafeSearch(search) + "\\" + id;
}

function saveToken(token) {
    console.log("saveToken");
    var basePath = getTokenPath(token.search, token.id);
    mkDir(basePath);
    fs.writeFileSync(basePath + "\\token.json", JSON.stringify(token), "UTF-8", function (err) {
        console.log(err);
    });
}

function saveTweets(token, data) {
    console.log("saveTweets");
    var basePath = getTokenPath(token.search, token.id);
    mkDir(basePath);
    var count = fs.readdirSync(basePath).length;
    fs.writeFileSync(basePath + "\\" + count + ".json", JSON.stringify(data), "UTF-8", function (err) {
        console.log(err);
    });
}

function getToken(tokenId, search) {
    console.log("getToken");
    var result = null;
    var tokenPath = getTokenPath(search, tokenId) + "\\token.json";

    if (fs.existsSync(tokenPath)) {
        result = JSON.parse(fs.readFileSync(tokenPath, "UTF-8"));
    } else {
        result = {
            id: generateToken(8),
            search: search
        };
    }

    return result;
}

function getTweets(token, search) {
    console.log("getTweets");

    var tokenPath = getTokenPath(search, token.id);
    var result = null;

    console.log("reading dirs " + tokenPath);
    var files = fs.readdirSync(tokenPath);
    for (var i in files) {
        var file = files[i];
        console.log("reading file " + file);

        if (file != "tokens.json") {
            var json = JSON.parse(fs.readFileSync(tokenPath + "\\" + file, "UTF-8"));

            if (!result) {
                result = json;
            } else {
                for (var j in json.statuses) {
                    result.statuses.push(json.statuses[j]);
                }
            }

            console.log("items " + result.statuses.length);
        }
    }

    return result;
}

function cleanTweets(twitterResponse) {
    console.log("cleanTweets");
    var origin = twitterResponse.statuses;
    var cleaned = [];

    for (var s in origin) {
        s = origin[s];
        var tweet = {};
        tweet.text = s.text;
        tweet.screen_name = s.user.screen_name;
        cleaned.push(tweet);
    }

    twitterResponse.statuses = cleaned;
    return twitterResponse;
}

function generateToken(len) {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex') // convert to hexadecimal format
    .slice(0, len); // return required number of characters
}

function processTweets(token, data, res) {
    console.log('Processing tweets');
    token.last_id = data.search_metadata.max_id;
    saveToken(token);
    data.token = token.id;
    saveTweets(token, data);
    res.send(data);
}

function getTweetsAsync(query, params) {
    return new Promise(function (resolve, reject) {
        T.get(query, params, function (err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

/* GET users listing. */
router.get('/', function callee$0$0(req, res, next) {
    var search, token, complete, tweetCount, queryParameters, tweets, _tweets;

    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                search = req.query.q;
                token = req.query.token;
                complete = req.query.complete;
                tweetCount = req.query.count || 10;
                queryParameters = {
                    q: search,
                    count: tweetCount
                };
                token = getToken(token, search);

                queryParameters.since_id = token.last_id;

                if (!(complete == "1")) {
                    context$1$0.next = 12;
                    break;
                }

                tweets = getTweets(token, search);

                res.send(tweets);
                context$1$0.next = 23;
                break;

            case 12:
                context$1$0.prev = 12;
                context$1$0.next = 15;
                return regeneratorRuntime.awrap(getTweetsAsync("search/tweets", queryParameters));

            case 15:
                _tweets = context$1$0.sent;

                processTweets(token, _tweets, res);
                context$1$0.next = 23;
                break;

            case 19:
                context$1$0.prev = 19;
                context$1$0.t0 = context$1$0['catch'](12);

                console.log(context$1$0.t0);
                res.status(500).send({ error: context$1$0.t0 });

            case 23:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[12, 19]]);
});

module.exports = router;