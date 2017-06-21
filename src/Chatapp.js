import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class Chatapp extends Component {
	constructor(props) {
        super(props);
    }

	componentDidMount() {
		
		const common = document.createElement("script");
        common.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/common.js";
        common.async = false;
        document.body.appendChild(common);
        
        const api = document.createElement("script");
        api.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/api.js";
        api.async = false;
        document.body.appendChild(api);
        
        const conversation = document.createElement("script");
        conversation.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/conversation-new.js";
        conversation.async = false;
        document.body.appendChild(conversation);
        
        const payload = document.createElement("script");
        payload.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/payload.js";
        payload.async = false;
        document.body.appendChild(payload);
        
        const global = document.createElement("script");
        global.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/global.js";
        global.async = false;
        document.body.appendChild(global);
        
        const css = document.createElement("link");
        css.rel = "stylesheet"
        css.href = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/app.css";
        document.head.appendChild(css);
    }  
  render() {
	
    return (
      
      <div className="App">
	    <div id="contentParent" className="responsive-columns-wrapper">
	      <div id="chat-column-holder" className="responsive-column content-column">
	        <div className="chat-column">
	          <div id="scrollingChat"></div>
	          <label htmlFor="textInput" className="inputOutline">
	            <input id="textInput" className="input responsive-column"
	              placeholder="Type something" type="text"
	              onkeydown="ConversationPanel.inputKeyDown(event, this)"/>
	          </label>
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