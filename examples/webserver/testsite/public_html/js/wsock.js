/*
 * Copyright 2016 Austin Lehman
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var textArea, msgArea, sock;

/**
 * Initializes the text areas and connects the socket.
 */
function init () {
    textArea = document.getElementById("text-area");
    msgArea = document.getElementById("msg-area");

    sock = new WebSocket("wss://" + window.location.host);

    sock.onmessage = function (evt) { 
       var msg = evt.data, ctnt;
       ctnt = msg.substring(msg.indexOf(":") + 1, msg.length).trim();
       if (ctnt.length > 2 && ctnt.substring(0, 2) === "/e") {
           eval(ctnt.substring(2, ctnt.length));
       } else {
           addMessage(msg);
       }
    };

    sock.onclose = function() {
        textArea.value += "Websocket connection closed.\n";
    };

    addMessage("Welcome to the IC9 websockets test page. Type text into the red text area and hit the enter key to send a message to all websockets that are listening.");
}

/**
 * Appends the message and then scrolls the text area.
 */
function addMessage (msg) {
    textArea.value += msg + "\n";
    textArea.scrollTop = textArea.scrollHeight;
}

/**
 * On keyup on the msgArea, if the enter key was pressed 
 * send the message and then clear the msgArea.
 */
function onTextAreaKeyPress(e) {
    var event = e || window.event.keyCode;
    var key = event.keyCode;
    if (key == 13) {
        if (msgArea.value.trim() !== "") {
            sock.send(msgArea.value.trim());
        }
        msgArea.value = "";
        return false;
    } else {
        return true;
    }
}

// Run init.
init();