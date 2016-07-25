// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const app = electron.remote;
const ipc = electron.ipcRenderer;
const toxcore = require('toxcore');
const emojione = require('emojione');
const dateformat = require('date-format');

const ToxStatus = require('./ToxStatus.js');
const stringHelper = require('../helpers/string.js');

console.log("renderer", __dirname);

/**
* Our Tox class.
**/
function Tox () {
  this.mockupMode = false;
  this.latestDirection = null;

  this.init();
  this.initTox();
  if (this.mockupMode) this.mockup();
  this.scrollChatView();
}

Tox.prototype.mockup = function () {
  let friendName = "Frosty Disco Thunder Winter Bear 💙";
  let selfName = this.profile.name;

  this.addMessage("incoming", friendName, "Hey guy, sup'?", "12:51");
  this.addMessage("outgoing", selfName, "I just come back from Paris, awesome city! :ok_hand:", "12:51");
  this.addMessage("outgoing", selfName, "And you? Any progress on your game?", "12:52");
  this.addMessage("incoming", friendName, "I kind of had to leave for a bit, I'm working on the walking cycle right now, though.", "12:52");
  this.addMessage("incoming", friendName, "Nothing too fancy, but that should render nicely :ghost:", "12:52");
  this.addMessage("incoming", friendName, "i hope so, at least :joy:", "12:53");
  this.addMessage("incoming", friendName, "The idea is that he kinda dashes forward like this :metal:", "12:53");
  this.addFileTransfer("incoming", friendName, "player-that-kinda-dashes-forward.zip", "2.31 Mo", "12:53");
  this.addMessage("outgoing", selfName, "Nice ink work mate", "12:54");
  this.addMessage("outgoing", selfName, "so where's the rest of it", "12:54");
  this.addMessage("incoming", friendName, "With full support for emojione!  😀😬😁😂😃😄😅😆😇😉😊🙂🙃☺😋😌😍😘😗😙😚😜😝😛🤑🤓😎🤗😏😶😐😑😒🙄🤔😳😞😟😠😡😔😕🙁☹😣😖😫😩😤😮😱😨😰😯😦😧😢😥😪😓😭😵😲🤐😷🤒🤕😴💤💩😈👿👹👺💀👻👽🤖😺😸😹😻😼😽 and many more ! ", "12:55");
}

Tox.prototype.init = function () {
  // Initialize emojione.
  emojione.imageType = 'png';
  emojione.ascii = true;
  emojione.imagePathPNG = '../assets/images/emojis/png/';
  emojione.imagePathSVG = '../assets/images/emojis/svg/';

  this.profile = {
    name: "SkyzohKey",
    mood: "Cracking the code.",
    status: ToxStatus.OFFLINE,

    _name: document.querySelector('#user-name'),
    _mood: document.querySelector('#user-mood'),
    _status: document.querySelector('#user-presence .contact-presence span'),
    _avatar: document.querySelector('#user-avatar')
  };
  
  console.log(this.profile._status);

  this.profile._name.textContent = this.profile.name;
  this.profile._mood.textContent = this.profile.mood;

  this.entryMessage = document.querySelector('#chatview-entry');
  this.buttonSendMessage = document.querySelector('#chatview-send-message');
  this.buttonAddContact = document.querySelector('#tox-menu #add-contact');
  this.buttonNewGroup = document.querySelector('#tox-menu #new-group');
  this.buttonShowTransfers = document.querySelector('#tox-menu #show-transfers');
  this.buttonShowSettings = document.querySelector('#tox-menu #show-settings');

  this.contactslist = document.querySelector('#contacts-list');
  this.chatview = document.querySelector('#chatview-content');

  this.setTitle("Frosty Disco Thunder Winter Bear 💙");
  this.entryMessage.focus();

  this.bindEvents();
};

Tox.prototype.initTox = function () {
  this.tox = new toxcore.Tox();
  
  this.tox.bootstrapSync('23.226.230.47', 33445, 'A09162D68618E742FFBCA1C2C70385E6679604B2D80EA6E84AD0996A1AC8A074'); // stal 
  this.tox.bootstrapSync('104.219.184.206', 443, '8CD087E31C67568103E8C2A28653337E90E6B8EDA0D765D57C6B5172B4F1F04C'); // Jfreegman 
   
  // Set your name and status message 
  this.tox.setNameSync(this.profile.name);
  this.tox.setStatusMessageSync(this.profile.mood);
  this.tox.setStatusSync(this.profile.status);
  
  // Listen for self connection
  this.tox.on('selfConnectionStatus', this.onSelfConnection.bind(this));
  
  // Listen for friend requests 
  this.tox.on('friendRequest', this.onFriendRequest.bind(this));
  
  // Print out your tox address so others can add it 
  this.addMessage('incoming', 'ToxID', this.tox.getAddressHexSync().toUpperCase());
   
  // Start! 
  this.tox.start();
};

Tox.prototype.onSelfConnection = function (e) {
  if (e.isConnected()) {
    this.profile._status.classList.remove('offline');
    this.profile._status.classList.remove('away');
    this.profile._status.classList.remove('busy');
    this.profile._status.classList.add('online');
  } else {
    this.profile._status.classList.remove('online');
    this.profile._status.classList.remove('away');
    this.profile._status.classList.remove('busy');
    this.profile._status.classList.add('offline');
  }
};

Tox.prototype.onFriendRequest = function (e) {  
  try {
    console.log(e);
    this.addMessage('outgoing', 'Friendship', e.publicKeyHex().toUpperCase() + "\r\nMessage: " + e._message);
    this.tox.addFriendNoRequestSync(e.publicKeyHex());
  } catch (err) {
    console.log("Cannot add friend. Error:", err);
  }
};

Tox.prototype.bindEvents = function () {
  // We handle profile name/mood/status/avatar changes.
  this.profile._name.addEventListener('input', function (e) {
    this.profile.name = e.target.textContent;
    this.onNameChange (e, this.profile.name);
  }.bind(this));

  this.profile._mood.addEventListener('input', function (e) {
    this.profile.mood = e.target.textContent;
    this.onMoodChange (e, this.profile.mood);
  }.bind(this));

  // We handle message sending via button click.
  this.buttonSendMessage.addEventListener('click', function (e) {
    if (this.entryMessage.value.replace(' ', '') == '') {
      return false;
    }

    this.addMessage("outgoing", this.profile.name, this.entryMessage.value);
  }.bind(this));

  // We handle message sending via Enter / We handle shift+enter newline.
  this.entryMessage.addEventListener('keydown', function (e) {
    if (e.shiftKey && e.keyCode == 13) {
      return true;
    } else if (e.keyCode == 13) { // Message sending.
      e.preventDefault();

      if (this.entryMessage.value.replace(' ', '') == '') {
        return false;
      }

      this.addMessage("outgoing", this.profile.name, this.entryMessage.value);
      return false;
    }
  }.bind(this));
  
  // Menu buttons:
  this.buttonShowSettings.addEventListener('click', function (e) {
    this.contactslist.classList.toggle('compact');
  }.bind(this));
}

Tox.prototype.scrollChatView = function () {
  var elem = document.querySelector('#chatview-content');
  elem.scrollTop = elem.scrollHeight;
};

Tox.prototype.setTitle = function (friendName) {
  const title = "Tox - " + this.profile.name + " - " + friendName;
  document.title = title;
}

Tox.prototype.addMessage = function (direction, author, message, timestamp) {
  let _author;
  if (this.latestDirection == direction) _author = "";
  else _author = author;
  this.latestDirection = direction;

  if (timestamp === undefined) {
    timestamp = dateformat('hh:mm', new Date());
  }

  const tpl = `<article class="message message-${direction}">
    <span class="message-author unselectable ellipsis">${_author.escape()}</span>
    <span class="message-content"><div>${emojione.toImage(message.escape().nl2br())}</div></span>
    <span class="message-timestamp unselectable">${timestamp.escape()}</span>
  </article>`;

  const c = this.chatview.innerHTML;
  this.chatview.innerHTML = c + tpl;
  this.entryMessage.value = ''; // Clear the entry once message added.
  this.scrollChatView();
}

Tox.prototype.addFileTransfer = function (direction, author, filename, filesize, timestamp) {
  let _author;
  if (this.latestDirection == direction) _author = "";
  else _author = author;
  this.latestDirection = direction;

  if (timestamp === undefined) {
    timestamp = dateformat('hh:mm', new Date());
  }

  const tpl = `<article class="message message-${direction}">
    <span class="message-author unselectable ellipsis">${_author.escape()}</span>
    <span class="transfer-content">
      <img class="transfer-icon unselectable" src="../assets/images/icons/file.svg">
      <span class="transfer-name">${filename.escape()}</span>
      <span class="transfer-size">${filesize.escape()}</span>
      <div class="transfer-actions unselectable">
        <button class="transfer-accept">Accept</button>
        <button class="transfer-reject">Reject</button>
      </div>
    </span>
    <span class="message-timestamp unselectable">${timestamp.escape()}</span>
  </article>`;

  const c = this.chatview.innerHTML;
  this.chatview.innerHTML = c + tpl;
  this.scrollChatView();
}

Tox.prototype.test = function () {
  alert("teeest");
};

Tox.prototype.onNameChange = function (e, name) {
  console.log("Name changed.", name);
  this.setTitle("Frosty Disco Thunder Winter Bear 💙");

  var _messages = document.querySelectorAll('.message-outgoing span.message-author');
  for (var message in _messages) {
    if (_messages.hasOwnProperty(message)) {
      message.textContent = this.profile.name;
    }
  }
}

window.app = new Tox();

ipc.on('protocol-activated', function (e, url) {
  console.log("tox://" + url, "activated!");
  if (url == "test") {
    window.app.test();
  }
});
