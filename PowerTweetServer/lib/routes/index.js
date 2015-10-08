'use strict';

var express = require('express');
var router = express.Router();

var liveConnect = require('../liveconnect-client');
var createExamples = require('../create-examples');

/* GET Index page */
router.get('/onenote', function (req, res) {
	var authUrl = liveConnect.getAuthUrl();
	res.render('index', { title: 'PowerTweet!', authUrl: authUrl });
});

/* POST Create example request */
router.post('/onenote', function (req, res) {
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
/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

module.exports = router;