'use strict';

var express = require('express');
var router = express.Router();

var liveConnect = require('../liveconnect-client');
var createExamples = require('../create-examples');

/* GET Index page */
router.get('/', function (req, res) {
	var authUrl = liveConnect.getAuthUrl();
	res.render('onenote', { title: 'PowerTweet test!', authUrl: authUrl });
});

/* POST Create example request */
router.post('/', function (req, res) {
	var accessToken = req.cookies['access_token'];
	var exampleType = req.body['submit'];

	// Render the API response with the created links or with error output
	var createResultCallback = function createResultCallback(error, httpResponse, body) {
		if (error) {
			return res.render('error', {
				message: 'HTTP Error',
				error: { details: JSON.stringify(error, null, 2) }
			});
		}

		// Parse the body since it is a JSON response
		var parsedBody;
		try {
			parsedBody = JSON.parse(body);
		} catch (e) {
			parsedBody = {};
		}
		// Get the submitted resource url from the JSON response
		var resourceUrl = parsedBody['links'] ? parsedBody['links']['oneNoteWebUrl']['href'] : null;

		if (resourceUrl) {
			res.render('result', {
				title: 'OneNote API Result',
				body: body,
				resourceUrl: resourceUrl
			});
		} else {
			res.render('error', {
				message: 'OneNote API Error',
				error: { status: httpResponse.statusCode, details: body }
			});
		}
	};

	// Request the specified create example
	switch (exampleType) {
		case 'savetweets':
			createExamples.createPageWithSavedTweets(accessToken, createResultCallback);
			break;
	}
});

module.exports = router;