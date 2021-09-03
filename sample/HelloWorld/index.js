/* eslint-disable no-console, no-path-concat */

// Dependencies
var express = require('express');
var OpenTok = require('../../lib/opentok');
var app = express();

var opentok;
var apiKey = process.env.VO;
var apiSecret = process.env.API_SECRET;
var appId = process.env.VONAGE_APP_ID;
var keyPath = process.env.VONAGE_PRIVATE_KEY_PATH;
var env = process.env.VONAGE_VIDEO_API_SERVER_URL;
var otOptions = {
  vgAuth: !!appId,
  env: env
};

// Verify that either the OpenTok API key and API secret
// or the VG app ID and private key path are defined
if (!(apiKey && apiSecret) && !(appId && keyPath)) {
  console.log('You must specify API_KEY and API_SECRET or VONAGE_APP_ID and VONAGE_PRIVATE_KEY_PATH environment variables');
  process.exit(1);
}

// Starts the express app
function init() {
  app.listen(3000, function () {
    console.log('You\'re app is now ready at http://localhost:3000/');
  });
}

// Initialize the express app
app.use(express.static(__dirname + '/public')); //

// Initialize OpenTok
if (otOptions.vgAuth) {
  opentok = new OpenTok(appId, keyPath, otOptions);
}
else {
  opentok = new OpenTok(apiKey, apiSecret, otOptions);
}

// Create a session and store it in the express app
opentok.createSession(function (err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get('/', function (req, res) {
  var sessionId = app.get('sessionId');
  // generate a fresh token for this client
  var token = opentok.generateToken(sessionId);
  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    otjsSrcUrl: process.env.OPENTOK_JS_URL || 'https://static.dev.tokbox.com/v2/js/opentok.js'
  });
});
