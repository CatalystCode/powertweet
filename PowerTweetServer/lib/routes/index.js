'use strict';

var express = require('express');
var router = express.Router();

var liveConnect = require('../liveconnect-client');
var createExamples = require('../create-examples');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;