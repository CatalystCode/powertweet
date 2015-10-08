var React = require('react'),
    MasonryMixin = require('react-masonry-mixin')(React),
    Tweet = require('./tweet'),
    SetIntervalMixin = require('./../Mixin/setinterval'),
    TweetListComponent;

var masonryOptions = {
    transitionDuration: 0
};

TweetListComponent = React.createClass({
    mixins: [SetIntervalMixin, MasonryMixin('masonryContainer', masonryOptions)],

    propTypes: {
        hashtag: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            twitterUrl: null,
            tweets: [],
            dismissedTweets: []
        };
    },

    componentDidMount() {
        this.setState({
            twitterUrl: 'https://partnercatalysthack-powertwitter.azurewebsites.net/twitter?q=' + encodeURIComponent(this.props.hashtag)
        }, () => {
            this._getTweets();
            this.setInterval(this._getTweets, 10000);
        });
    },

    _getTweets() {
        if (!this.state.twitterUrl) return;

        $.ajax({
            url: this.state.twitterUrl,
            dataType: 'json',
            success: (data) => {
                console.log(data);
                if (data && data.statuses) {
                    this.setState({ tweets: data.statuses });
                }
            },
            error: (xhr, status, err) => {
                console.error(this.state.twitterUrl, status, err.toString());
            }
        });
    },

    dismissTweet: function (key) {
        let dismissedTweets = this.state.dismissedTweets;
        dismissedTweets.push(key);
        this.setState({dismissedTweets: dismissedTweets});
    },

    render () {
        let tweets = this.state.tweets || [];
        let dismissedTweets = this.state.dismissedTweets;
        let renderedTweets = [];

        for (let i = 0; i < tweets.length; i = i + 1) {
            if (dismissedTweets.indexOf(tweets[i].id) === -1) {
                console.log(dismissedTweets, tweets[i].id);
                renderedTweets.push(<Tweet tid={tweets[i].id} key={tweets[i].id} tweet={tweets[i]} dismiss={this.dismissTweet} />);
            };
        }

        if (!renderedTweets || renderedTweets.length === 0) {
            renderedTweets = (<img className="spinner" src="../../Images/350.gif" />);
        }

        return (
            <div>
                <div className="tweetlist-header">
                    <h1>Tweets for "{this.props.hashtag}"</h1>
                </div>
                <div ref="masonryContainer">
                    {renderedTweets}
                </div>
            </div>
        );
    }
});

module.exports = TweetListComponent;
