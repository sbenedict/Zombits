'use strict';

const TmiClient = require("tmi.js").client;

if (process.platform === "win32") {
  let rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function() {
  // graceful shutdown
  client.disconnect().then(function(data) {
    // data returns [server, port]
    // process.exit();
  }).catch(function(err) {
    console.log("tmi: Error! Failed to disconnect: " + err);
    // process.exit();
  });
});


const options = {
    options: {
        debug: false,
    },
    connection: {
        reconnect: true,
    },
    // identity: {
    //     username: "user",
    //     password: "oauth:xxxxx"
    // },
    channels: ["#ssssammm"],
};

const client = new TmiClient(options);

client.on("logon", function() {
    console.log("tmi: Logged on");
});

client.on("connected", function(address, port) {
   console.log("tmi: Connected to " + address + ":" + port);
});

client.on("disconnected", function(reason) {
    console.log("tmi: Disconnected - " + reason);
});

client.on("message", function(channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Handle different message types..
    switch(userstate["message-type"]) {
        case "action":
            // This is an action message..
            break;
        case "chat":
            // This is a chat message..
            break;
        case "whisper":
            // This is a whisper..
            break;
        default:
            // Something else ?
            console.log("tmi: Unknown message-type: " + userstate["message-type"]);
            break;
    }
});

client.on("cheer", function(channel, userstate, message) {
    // Do your stuff using userstate.bits
    // v5 (might not apply): https://dev.twitch.tv/docs/v5/guides/PubSub/#example-bits-event-message
});

client.connect();

// client.say("channel", "Your message").catch(function(err) {
//     console.log("tmi: Say failed: " + err);
// });
