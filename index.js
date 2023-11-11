document.onkeydown = function (event) {
  if (event.key == 'Enter') {
    sendMessage();
  }
}

messageId = 0;
currentUser = localStorage.getItem("currentUser");;

function myLogin(){
  var nickname = $("#Nickname").val();
  localStorage.setItem("currentUser", nickname);
  currentUser = nickname;
  $("#myLogin").hide();
}

fetchMessage();

function fetchMessage() {
  if (!currentUser){
    myHistoryTimeout();
    return;
  }

  console.log("Get messages")
  $.get("./app/chats/stas_XFRTS4FT/start_01.json", function (data, status) {
    if (data) {
      $("#messages").empty()
      generateMessageList(data);
    }
  });

  myHistoryTimeout();
}

function generateMessageList(data) {
  for (var i = 0; i < data.messages.length; i++) {
    addNewMessage(data.messages[i].text, data.messages[i].author)
    messageId++;
  }
  scrollToLastMessage();
}

function sendMessage() {

  if (!currentUser){
    openForm();
    return;
  }

  authorName = currentUser;

  var messageText = $("#current_message_text").val();
  addNewMessage(messageText, authorName)

  $.ajax({
    url: "./app/send.php",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "date": Date.now(),
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
    fetchMessage();
  }, myTimer);
}

