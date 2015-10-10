## PowerTweet
Twitter, but inside PowerPoint: This is the source code for an (unreleased) little Office add-in allowing users to search for and display tweets in a live-feed inside PowerPoint. It's mostly written using modern JavaScript (ES6/ES7) and then compiled down to ES5. The service runs in Node.js, while the add-in is written as a modern Office Add-In (formerly known as Office Apps or Office.js). They are cross-platform and support PowerPoint on iPads, Android Tablets, or in a web browser. You can't find the addon in the Office Store, but this is some great source code if you'd like to check it out yourself.

![Gif](https://raw.githubusercontent.com/CatalystCode/powertweet/master/powertweet.gif)

### PowerTweetWeb
This is the add-in itself - written in ES6, the code in `PowerTweetWeb/Source` is compiled down to ES5 using Babel. Visual Studio should handle this for you, but be sure to run `npm install` inside `PowerTweetWeb` if Babel fails. To make things less horrible during development, we used React.JS for components.

### PowerTweetServer
Twitter makes it really hard (read: impossible) to call their search API from a client (aka a script running locally), meaning that we needed to create a little "man in the middle" script that calls Twitter for you. It's a small Node.js server (nothing fancy and certainly not fit for production), but it gets the job done. It too is compiled down to ES5, so be sure to watch out for our usage of `async/await`.

## License
Copyright (C) 2015 Microsoft Corporation, licensed as MIT. Please see `LICENSE` for details.
