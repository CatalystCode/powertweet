﻿var React = require('react'),
    TweetComponent;

TweetComponent = React.createClass({
    render() {
        let t = this.props.tweet;
        let timestamp = new Date(t.created_at).toLocaleString();

        return (
            <div className="ms-PersonaCard">
                <div className="ms-PersonaCard-persona">
                    <div className="ms-Persona ms-Persona--xl">
                        <div className="ms-Persona-imageArea">
                            <i className="ms-Persona-placeholder ms-Icon ms-Icon--person"></i>
                            <img className="ms-Persona-image" src={t.user.profile_image_url_https} />
                        </div>
                        <div className="ms-Persona-presence"></div>
                        <div className="ms-Persona-details">
                            <div className="ms-Persona-primaryText">{t.user.name}</div>
                            <div className="ms-Persona-secondaryText">@{t.user.screen_name}</div>
                            <div className="ms-Persona-tertiaryText">{t.user.location}</div>
                            <div className="ms-Persona-optionalText">{t.user.description}</div>
                        </div>
                    </div>
                </div>
                <ul className="ms-PersonaCard-actions">
                    <li id="chat" className="ms-PersonaCard-action is-active"><i className="ms-Icon ms-Icon--chat"></i></li>
                    <li id="phone" className="ms-PersonaCard-action"><i className="ms-Icon ms-Icon--starEmpty"></i>{t.favorite_count}</li>
                    <li id="video" className="ms-PersonaCard-action"><i className="ms-Icon ms-Icon--noteForward"></i>{t.retweet_count}</li>
                    <li id="mail" className="ms-PersonaCard-action"><i className="ms-Icon ms-Icon--calendar"></i>{timestamp}</li>
                </ul>
                <div className="ms-PersonaCard-actionDetailBox">
                    <p className="tweet-text ms-font-xl">{t.text}</p>
                </div>
            </div>
        );
    }
});

module.exports = TweetComponent;
