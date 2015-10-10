(function () {
    "use strict";

    function initialize() {
        $(document).ready(function () {
            let React = require('react');
            let PowerTweet = require('./components/powertweet.js');

            app.initialize();
            React.render(<PowerTweet />, document.getElementById('content-main'));
        });
    }

    // Checking for Office
    if (window.external.GetContext) {
        // The initialize function must be run each time a new page is loaded
        Office.initialize = (reason) => initialize();
    } else {
        // We're probably *not* running in Office, but let's still start the app
        // If you want to run/debug in Edge/Chrome, you totally can!
        initialize();
    }
})();
