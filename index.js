document.onkeydown = function (event) {
  if (event.key == 'Enter') {
    sendMessage();
  }
}

messageId = 0;
chatId = 0;
currentUser = localStorage.getItem("currentUser");
fetchMessageWithRepeat();

function myLogin(){
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

function getChats(){
  $.get("./app/users/" + currentUser.toLowerCase() + ".json", function (data, status) {
    if (data) {
      $("#messages").empty()
      generateChatList(data);
    }
  });
}

function generateChatList(data){
  $("#chats").empty()

  for (var i = 0; i < data.chats.length; i++) {
    addNewChat(data.chats[i].chat_name, data.chats[i].chat_folder, data.chats[i].last_chat_file, chatId)
    chatId++;
  }
}

function addNewChat(chatName, chatFolder, lastChatFile, chatId) {
  chatHistory = chatFolder + "/" + lastChatFile;

  var newChat =
  `<div speech-bubble chat-non-active-color
      onclick="showChat('` + chatId + `', '` + chatHistory + `')"
      id=` + chatId + `>
    <h3>` + chatName + `</h3>
  </div>`;

  localStorage.setItem(chatName, nickname);

  $("#chats").append($(newChat));
}

function showChat(chatId, chatHistory){
  // TODO make chat id tab active
  $('#' + chatId).attr('speech-bubble message-color');
  localStorage.setItem("activeChat", chatHistory);
  fetchMessage();
}

function fetchMessage() {
  chatHistory = localStorage.getItem("activeChat");

  if (!chatHistory){
    return;
  }

  if (!currentUser){
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

  if (!chatHistory){
    myHistoryTimeout();
    return;
  }

  if (!currentUser){
    myHistoryTimeout();
    return;
  }

  fetchMessage();
  myHistoryTimeout();
}

function generateMessageList(data) {
  for (var i = 0; i < data.messages.length; i++) {
    addNewMessage(data.messages[i].text, data.messages[i].author)
    messageId++;
  }
  // scrollToLastMessage();
}

function sendMessage() {

  if (!currentUser){
    openForm();
    return;
  } else {
    authorName = currentUser;
  }

  chatHistory = localStorage.getItem("activeChat");

  if (!chatHistory){
    return;
  }

  var messageText = $("#current_message_text").val();
  addNewMessage(messageText, authorName)

  $.ajax({
    url: "./app/send.php",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "date": Date.now(),
      "current_chat": chatHistory,
      "author": authorName,
      "author_id": "2",
      "text": messageText
    }),
    success: function (response) {
      $("#current_message_text").val('');
    },
    error: function (error) {
      console.log("error" + error);
    }
  }).done( function (response) {
    $("#current_message_text").val('');
  });

  $("#current_message_text").val('');
  scrollToLastMessage();
  messageId++;
}

function scrollToLastMessage(){
  console.log(messageId - 1);
  document.getElementById(messageId - 1).scrollIntoView();
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

