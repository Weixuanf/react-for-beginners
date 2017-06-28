var TextToSpeechWs = (function() {
  return {
    connectTextToSpeech: connectTextToSpeech,
  };

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
module.exports = TextToSpeechWs;
