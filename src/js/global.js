
/* global ConversationPanel: true, PayloadPanel: true*/
/* eslint no-unused-vars: "off" */
var ConversationPanel = require('./conversation');
var PayloadPanel = require('./payload');
// Other JS files required to be loaded first: apis.js, conversation.js, payload.js
(function() {
  // Initialize all modules
  ConversationPanel.init();
  PayloadPanel.init();
})();
