/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
require('./websocketServer');

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var extend = (extend = require('util')._extend);

// another endpoint for the text to speech service

// For local development, replace username and password or set env properties
var ttsConfig = extend(
  {
    version: 'v1',
    url: 'https://stream.watsonplatform.net/text-to-speech/api',
    username: process.env.TTS_USERNAME || '2253de09-42f8-4b50-9ac2-42cc205f7ec1',
    password: process.env.TTS_PASSWORD || 'ha5vusqf43Tj'
  },
  vcapServices.getCredentials('text_to_speech')
);

var ttsAuthService = watson.authorization(ttsConfig);

app.get('/token', function(req, res) {
  ttsAuthService.getToken({ url: ttsConfig.url }, function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      res.status(500).send('Error retrieving token');
      return;
    }
    res.send(token);
  });
});

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
   username: '94a08f61-e0a4-46bb-aef0-b15c2c26b098',
   password: 'ClJHGWo0CjX5',
   url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || 'b160f56f-7204-4beb-8ba0-276f7e65bb9b'; //b160f56f-7204-4beb-8ba0-276f7e65bb9b //e08301fc-63e2-4cc7-9803-0b65a0319b0e car dashboard
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports = app;
