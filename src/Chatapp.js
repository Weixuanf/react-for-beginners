import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect} from './js/connect.js'
import {Api} from './js/api.js'

class Chatapp extends Component {
	constructor(props) {
        super(props);
    }

	componentDidMount() {
		
		const common = document.createElement("script");
        common.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/common.js";
        //common.async = true;
        document.body.appendChild(common);
        
        const api = document.createElement("script");
        api.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/api.js";
        //api.async = true;
        document.body.appendChild(api);
        
        const conversation = document.createElement("script");
        conversation.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/conversation.js";
        //conversation.async = true;
        document.body.appendChild(conversation);
        
        const payload = document.createElement("script");
        payload.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/payload.js";
        //payload.async = true;
        document.body.appendChild(payload);
        
        const global = document.createElement("script");
        global.src = "https://s3.amazonaws.com/aws-website-myvqa-olx0m/watsonConversation/global.js";
        //global.async = true;
        document.body.appendChild(global);
        
       
    }  
  render() {
	var Api = {Api};
	
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