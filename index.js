document.onkeydown = function (event) {
  if (event.key == 'Enter') {
    sendMessage();
  }
}

var messageId = 0;
var chatId = 0;
var lastMessageDate = '';
var currentChatId = 'chat_0'

currentUser = localStorage.getItem("currentUser");
fetchMessageWithRepeat();

function myLogin() {
  localStorage.setItem("activeChat", "");
  $("#chats").empty()
  $("#messages").empty()

  var nickname = $("#nickname").val();
  localStorage.setItem("currentUser", nickname);
  currentUser = nickname;
  // $("#myLogin").hide();
  $("#current_message_text").focus();
  getChats();
}

function getChats() {
  $.get("./app/users/" + currentUser.toLowerCase() + ".json", function (data, status) {
    if (data) {
      $("#messages").empty();

      generateChatList(data);
      activateChat();
    }
  });
}

function activateChat() {
  activeChatId = localStorage.getItem("activeChatId");
  if (activeChatId) {
    $('#' + activeChatId).click();
  } else {
    $('#chat_0').click();
  }
}

function generateChatList(data) {
  $("#chats").empty()

  for (var i = 0; i < data.chats.length; i++) {
    myChatId = "chat_" + chatId;
    addNewChat(data.chats[i].chat_name, data.chats[i].chat_folder, data.chats[i].last_chat_file, myChatId)
    chatId++;
  }
}

function addNewChat(chatName, chatFolder, lastChatFile, myChatId) {
  chatHistory = chatFolder + "/" + lastChatFile;

  var newChat =
    `<div speech-bubble style="--bbColor:#3580ff"
      onclick="showChat('` + myChatId + `', '` + chatHistory + `')"
      id=` + myChatId + `>
    <h3>` + chatName + `</h3>
  </div>`;

  localStorage.setItem(chatName, nickname);

  $("#chats").append($(newChat));
}

function showChat(myChatId, chatHistory) {
  // Change colocrs for prev chat id to unfocused
  if (currentChatId){
    $('#' + currentChatId).attr('style', '--bbColor:#3580ff');
  }
  currentChatId = myChatId;
  $('#' + myChatId).attr('style', '--bbColor:#3575ff');

  if (chatHistory) {
    localStorage.setItem("activeChatId", myChatId);
    localStorage.setItem("activeChat", chatHistory);
    fetchMessage();
    // myScrollToLastMessage();
  } else {
    console.log("No chat")
  }
}

function fetchMessage() {
  chatHistory = localStorage.getItem("activeChat");

  if (!chatHistory) {
    return;
  }

  if (!currentUser) {
    return;
  }

  console.log("Get messages for chat: " + chatHistory)
  $.get("./app/chats/" + chatHistory, function (data, status) {
    if (data) {
      $("#messages").empty()
      generateMessageList(data);
    }
  });
}

function fetchMessageWithRepeat() {
  chatHistory = localStorage.getItem("activeChat");

  if (!chatHistory) {
    myHistoryTimeout();
    return;
  }

  if (!currentUser) {
    myHistoryTimeout();
    return;
  }

  fetchMessage();
  myHistoryTimeout();
}

function generateMessageList(data) {
  for (var i = 0; i < data.messages.length; i++) {
    let currentMessage = data.messages[i];
    addNewMessage(currentMessage.text, currentMessage.author);
    lastMessageDate = currentMessage.date;
    messageId++;
  }
}

function sendMessage() {

  if (!currentUser) {
    openForm();
    return;
  } else {
    authorName = currentUser;
  }

  chatHistory = localStorage.getItem("activeChat");

  if (!chatHistory) {
    return;
  }

  var messageText = $("#current_message_text").val();
  var messageDate = Date.now();
  addNewMessage(messageText, authorName)

  $.ajax({
    url: "./app/send.php",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "date": messageDate,
      "current_chat": chatHistory,
      "author": authorName,
      "author_id": "2",
      "text": messageText
    }),
    success: function (response) {
      $("#current_message_text").val('');
      lastMessageDate = messageDate;
      scrollToLastMessage();
      messageId++;
    },
    error: function (error) {
      console.log("error " + error);
    }
  });
}

function scrollToLastMessage() {
  if (document.querySelector('#messages > div:last-of-type')) {
    document.querySelector('#messages > div:last-of-type').scrollIntoView();
  }
}

function addNewMessage(messageText, authorName) {
  if (authorName == currentUser) {
    messageOwner = 'pright'
  } else {
    messageOwner = 'pleft'
  }

  var newMessage =
    `<div class="message" speech-bubble ` + messageOwner + ` acenter message-color id=` + messageId + `>
    <div class="title">` + authorName + `</div>
    <p>` + messageText + `</p>
  </div>`;

  $("#messages").append($(newMessage));
}

function myHistoryTimeout() {
  myTimer = 1000 * 8;
  setTimeout(function () {
    fetchMessageWithRepeat();
  }, myTimer);
}

// Dont work, broke myHistoryTimeout - start working every myTimerForScroll
function myScrollToLastMessage() {
  myTimerForScroll = 500 * 1;
  setTimeout(function () {
    console.log("Focused on chat and")
    activateChat();
    scrollToLastMessage();
  }, myTimerForScroll);

  clearInterval(myTimerForScroll);
}
