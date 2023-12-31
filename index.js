document.onkeydown = function (event) {
  if ((event.ctrlKey || event.altKey) && event.key == 'Enter') {
    sendMessage();
  }
}

var messageId = 0;
var chatId = 0;
var lastMessageDate = '';
var currentChatId = 'chat_0'
var chatDisplay = false;
var isAddChatShows = false;

currentUser = localStorage.getItem("currentUser");
fetchMessageWithRepeat();

function myLogin() {
  localStorage.setItem("activeChat", "");
  $("#chats").empty()
  $("#messages").empty()

  let nickname = $("#nickname").val().replace(/ /g, '');
  let password = $("#password").val();

  $.ajax({
    url: "./app/login.php",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "user": nickname,
      "password": password
    }),
    success: function (response) {
      localStorage.setItem("currentUser", nickname);
      currentUser = nickname;
      $("#myLogin").hide();
      $("#current_message_text").focus();
      getChats();
      $("#myLogout").show();
    },
    error: function (error) {
      console.log("error " + error);
    }
  });
}

function myLogout() {
  localStorage.setItem("activeChat", "");
  $("#chats").empty()
  $("#messages").empty()
  currentUser = localStorage.setItem("currentUser", '');
  $("#myLogin").show();
  openLoginForm();
}

function showChats() {
  if (!chatDisplay) {
    $('#chats-column').css("visibility", "visible");
    $('#chats-column').css("display", "unset");
    $('#messages-full-column').css("visibility", "hidden");
    $('#messages-full-column').css("display", "none");
    chatDisplay = true;
  } else {
    $('#chats-column').css("visibility", "hidden");
    $('#chats-column').css("display", "none");
    $('#messages-full-column').css("visibility", "visible");
    $('#messages-full-column').css("display", "unset");
    chatDisplay = false;
  }
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

function generateChatList(data) {
  $("#chats").empty()

  for (var i = 0; i < data.chats.length; i++) {
    chatFullPath = data.chats[i].chat_folder + "/" +data.chats[i].last_chat_file
    addNewChat(data.chats[i].chat_name, chatFullPath)
  }
}

function activateChat() {
  activeChatId = localStorage.getItem("activeChatId");
  if (activeChatId) {
    $('#' + activeChatId).click();
  } else {
    $('#chat_0').click();
  }
}

function addChatMenu() {
  if (!isAddChatShows) {
    $("#new-chat").show();
    isAddChatShows = true;
    $('#add-new-chat-text').html('Hide')
  } else {
    $("#new-chat").hide();
    isAddChatShows = false;
    $('#add-new-chat-text').html('Add new chat')
  }
}

function addNewChatUser() {
  let newChatUser = $('#new-chat-user').val().toLowerCase().replace(/ /g, '');

  $.ajax({
    url: "./app/addChat.php",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "user": currentUser,
      "newChatUser": newChatUser
    }),
    success: function (response) {
      let chatFolder = response.chat_folder;
      addNewChat(newChatUser, chatFolder);
      $("#new-chat").hide();
    },
    error: function (error) {
      console.log("error " + error);
    }
  });

}

function createNewChatId(){
  return "chat_" + chatId++;
}

function addNewChat(chatName, chatFolder) {
  let myChatId = createNewChatId();
  var newChat =
    `<div speech-bubble style="--bbColor:#3580ff;cursor: pointer;"
      onclick="showChat('` + myChatId + `', '` + chatFolder + `')"
      id=` + myChatId + `>
    <h3>` + chatName + `</h3>
  </div>`;

  localStorage.setItem(chatName, nickname);

  $("#chats").append($(newChat));
}

function showChat(myChatId, chatHistory) {
  // Change colors for prev chat id to unfocused
  if (currentChatId) {
    $('#' + currentChatId).attr('style', '--bbColor:#3580ff;cursor: pointer;');
  }
  currentChatId = myChatId;
  $('#' + myChatId).attr('style', '--bbColor:#3575ff;cursor: pointer;');

  if (chatHistory) {
    localStorage.setItem("activeChatId", myChatId);
    localStorage.setItem("activeChat", chatHistory);
    fetchMessage(true);
  } else {
    console.log("No chat")
  }
}

function fetchMessage(runCallback) {
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
      if (runCallback) {
        scrollToLastMessage();
      }
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
    openLoginForm();
    return;
  } else {
    authorName = currentUser;
  }

  chatHistory = localStorage.getItem("activeChat");

  if (!chatHistory) {
    return;
  }

  var messageText = replaceUnsafe($("#current_message_text").val()).replace(/\r\n|\r|\n/g, "<br/>");
  
  if(!messageText){
    return;
  }
  
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

function replaceUnsafe(message) {
  return message.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
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
    console.log("Focused on chat and scroll")
    activateChat();
    scrollToLastMessage();
  }, myTimerForScroll);

  clearInterval(myTimerForScroll);
}
