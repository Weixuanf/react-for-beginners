'use strict';

// content of index.js
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const Conversation = require('watson-developer-cloud/conversation/v1');
const SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
const NaturalLanguageUnderstanding = require('watson-developer-cloud/natural-language-understanding/v1');
const streamifier = require('streamifier'); // streamifier converts buffers to streams :-)

const port = 3001;
const server = http.createServer();
var express = require('express'); // app server
var app = express();
app.use(express.static('./WebContent')); // load UI from public folder
// // Also mount the app here
server.on('request', app);
// var express = require('express'); // app server
// var server = express();
// server.use(express.static('./WebContent')); // load UI from public folder
// server.get('/', function (req, res) {
//   res.send('Hello World!')
// });
// server.get('/about', function (req, res) {
//   res.send('<h1>about</h1>')
// });

var speechToText = new SpeechToText({
    username: 'b5a5a1ca-d92d-48de-a1c7-ec0fb020c878',
    password: 'W4KvWXQChRs5'
});

var conversation = new Conversation({
    username: '4f16f47b-08ca-4d65-a891-5c86ed5fa98b',
    password: 'Y6no1fwoZKM3',
    version: 'v1',
    version_date: '2017-04-21'
});

var nlu = new NaturalLanguageUnderstanding({
    username: '9c2368b3-8c87-4791-aa6d-17884d3be7af',
    password: 'NEIz7eAS1OXt',
    version_date: '2017-02-27'
});

var sttParams = {
      model: 'en-US_BroadbandModel',
      content_type: 'audio/ogg', // Firefox supports .ogg, Chrome supports .wav
      max_alternatives: 3,
      word_confidence: false,
      continuous: false
};

function analyze(nluParams) {
    return new Promise(function(resolve, reject) {
        nlu.analyze(nluParams, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

function message(request) {
    return new Promise(function(resolve, reject) {
        conversation.message(request, function(err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

var context = {};
function stt(socket, audioBuffer) {

    var recognizeStream = speechToText.createRecognizeStream(sttParams);
    var audioStream = streamifier.createReadStream(audioBuffer);

    // I like human-readable transcripts
    recognizeStream.setEncoding('utf8');

    // var transcript = 'Find a company in the food industry specializing in dark chocolate.';
    // Listen for speech-to-text transcription event
   recognizeStream.on('data', (event) => {
      //  var transcript = 'hello';
       var transcript = JSON.stringify(event, null, 2);//the speech-to-text result
       console.log(transcript);
       socket.send(transcript );//send speech text of what user said to client

        var nluParams = {
            text: transcript,
            features: {
                entities: {},
//                semantic_roles: {},
//                relations: {}, // same thing :)
//                categories: {}
            }
        };
        analyze(nluParams).then((response) => {
            console.log('Response:', response);

            // NLU-returned entities are not compatible with Conversation entities.
            // Thank you, Watson!
            var entity = response['entities'][0];
            var request = {
                workspace_id: '4846e75a-5757-4b83-9505-69d4c000d346',
                input: { text: transcript },
                context: context,
                entities: entity ? [ { entity: entity['type'], value: entity['text'] } ] : []
            };
            console.log('Req:', request);
            return message(request);
        }).then((response) => {
            console.log('Chat:', JSON.stringify(response, null, 2));
            console.log('Response text:', response['output']['text']);

            context = response['context'];

//             var agentOptions = {
//                 host: '10.171.252.131',
//                 method: 'POST',
//                 path: endpoint,
//                 port: 31117,
//                 rejectUnauthorized: false
//             };
//             var agent = new https.Agent(agentOptions);
//
//             var endpoint = response.output.meta.endpoint;
//             var req = https.request({
// //                host: '10.171.252.131',
// //                method: 'POST',
// //                path: endpoint,
// //                port: 31117,
//                agent: agent
//             }, (res) => {
//                 res.on('data', (chunk) => {
//                     socket.send(chunk);
//                 });
//             });
//             var data = {
//                 criteria: {
//                     subcriteria: {
//                         businessDescription: {
//                             content: 'Find a company in the food industry specializing in dark chocolate.',
//                             maxRetrieve: 0
//                         }
//                     },
//                     maxRetrieve: 1
//                 }
//             };
//             req.write(JSON.stringify(data));
//             req.end();
        }).catch((error) => {
            console.log('Error:', error);
        });
   });

    // Pipe in the audio.
    audioStream.pipe(recognizeStream);
};

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});

//Initialize WebSocket using the previously defined Node HTTP server
const ws = new WebSocket.Server({
    server: server
});

ws.on('connection', function (socket, request) {
    socket.on('message', function (message) {
        stt(socket, message);
    });

});
