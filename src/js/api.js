// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
        console.log(JSON.parse(http.responseText).output.text );
        var watsonReplyMsg = JSON.parse(http.responseText).output.text[0];
        connectTextToSpeech(watsonReplyMsg);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

    // Send request
    http.send(params);
  }
  function connectTtsWs(token, text) { //connect tts service and play the audio
    var voice = 'en-US_AllisonVoice';
    var format = 'audio/ogg;codecs=opus';
    console.log(token);
    var wsURI = 'wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=' +
      voice + '&watson-token=' + token;
    var websocket = new WebSocket(wsURI);
    var audioParts = [];
    var finalAudio;

    websocket.onopen = function (evt) {
      var message = {
        text: text,
        accept: '*/*'
      };
      websocket.send(JSON.stringify(message));
    };
    websocket.onclose = function(evt) {
      console.log('WebSocket closed', evt.code, evt.reason);
      finalAudio = new Blob(audioParts, {type: format});
      console.log('final audio: ', finalAudio);
      var blobUrl = (URL.createObjectURL(finalAudio));
      var voice = new Audio(blobUrl); //create HTMLAudioElement
      voice.play();
    };
    websocket.onmessage = function (evt) {
      if (typeof evt.data === 'string') {
        console.log('Received string message: ', evt.data)
      } else {
        console.log('Received ' + evt.data.size + ' binary bytes', evt.data.type);
        audioParts.push(evt.data);
      }
    };
    // websocket.onerror = function(evt) { onError(evt) };
  }
  function connectTextToSpeech(text) { //get token for text to speech
    var xmlHttp = new XMLHttpRequest();
    var token = null;
    xmlHttp.open( "GET", '/token', true ); // false for synchronous request
    xmlHttp.send( null );
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200 && xmlHttp.responseText) {
        token = xmlHttp.responseText;
        connectTtsWs(token,text);
      }
    };
  }
}());
module.exports = Api;
