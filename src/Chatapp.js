import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MicButton from './MicButton';
import './style/app.css'
import './style/chatbot.scss'

class Chatapp extends Component {
	constructor(props) {
        super(props);
    }
	componentWillMount() { //add font-awsome lib
		const fontawesome = document.createElement("script");
		fontawesome.src = "https://use.fontawesome.com/776012486e.js";
		document.head.appendChild(fontawesome);
	}
	componentDidMount() {
		require('./js/global');
		this.connectWebsocket(); //speech to text
		// this.connectTextToSpeech();
		var tts = require('./js/TextToSpeechWs');
		tts.connectTextToSpeech('hello world');
  }

	connectWebsocket() {
		// Create WebSocket connection.
		const socket = new WebSocket('ws://localhost:3001');
		// Listen for messages
		socket.onmessage = function (event) {
				console.log('Message from server:', event.data);
				var textArea = document.getElementById('textInput');
				var text = event.data;
				textArea.value = text.substring(1,text.length-2);//cut the bracket and set text area value to speech text
				//fire a key down event
				var eventObj = document.createEvent("Events");
				eventObj.initEvent("keydown", true, true);
				eventObj.which = 13;
				eventObj.keyCode = 13;
				textArea.dispatchEvent(eventObj);

				var reader = new FileReader();
				reader.addEventListener('loadend', () => {
						console.log(reader.result);
				})
				reader.readAsText(event.data);
		};

		// Goof detection
		socket.onerror = function(event) {
			console.log("ya blew it", event);
		};
		var i = 0;
		// appends an audio element to playback and download recording
		function createAudioElement(blobUrl) {
				const downloadEl = document.createElement('a');
				downloadEl.style = 'display: block';
				downloadEl.innerHTML = 'download';
				downloadEl.download = 'audio.ogg';
				downloadEl.href = blobUrl;
				// document.body.appendChild(downloadEl);

				const audioEl = document.createElement('audio');
				audioEl.controls = true;
				const sourceEl = document.createElement('source');
				sourceEl.src = blobUrl;
				sourceEl.type = 'audio/ogg';
				audioEl.appendChild(sourceEl);
				document.body.appendChild(audioEl);
		}

		// request permission to access audio stream
		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
				// store streaming data chunks in array
				const chunks = [];
				// create media recorder instance to initialize recording
				const recorder = new MediaRecorder(stream);
				// function to be called when data is received
				var hasNotRecorded = true;
				recorder.ondataavailable = e => {
					// add stream data to chunks
					chunks.push(e.data);
				// convert stream data chunks to a 'ogg' audio format as a blob
				const blob = new Blob(chunks, { type: 'audio/ogg' });
					socket.send(blob);

					// if recorder is 'inactive' then recording has finished
					if (recorder.state == 'inactive' && hasNotRecorded) {
					// convert blob to URL so it can be assigned to a audio src attribute
					createAudioElement(URL.createObjectURL(blob));
					hasNotRecorded = false;
						}
				};
				// start recording with 1 second time between receiving 'ondataavailable' events
				// recorder.start(1000);
				recorder.start();
				// setTimeout to stop recording after 5 seconds
				setTimeout(() => {
						// this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
						recorder.stop();
				}, 3000);
		 }).catch(console.error);
	}
  render() {

    return (

      <div className="App" style={{height:'100%'}}>
	    <div id="contentParent" className="responsive-columns-wrapper">
	      <div id="chat-column-holder" className="responsive-column content-column" style={{    background: '#FFF'}}>
	        <div className="chat-column" >
	          <div id="scrollingChat"></div>
	          <label htmlFor="textInput" className="inputOutline">
	            <input id="textInput" className="input responsive-column"
	              placeholder="Type something" type="text"/>
	          </label>
						<MicButton/>
	        </div>
	      </div>
	      <div id="payload-column" className="fixed-column content-column">
	        <div id="payload-initial-message">
	          Type something to see the output
	        </div>
	        <div id="payload-request" className="payload"></div>
	        <div id="payload-response" className="payload"></div>
	      </div>
	    </div>
      </div>
    );
  }
}

export default Chatapp;
