document.onkeydown = function (event) {
  if (event.key == 'Enter') {
    sendMessage();
  }
}

messageId = 5;
currentUser = "Dany";

function myLogin(){
  var nickname = $("#Nickname").val();
  currentUser = nickname;
}

fetchMessage();

function fetchMessage() {
  console.log("Get messages")
  $.get("./chats/stas_XFRTS4FT/start_01.json", function (data, status) {
    if (data) {
      $("#messages").empty()
      generateMessageList(data);
    }
  });

  // myHistoryTimeout();
}

function generateMessageList(data) {
  for (var i = 0; i < data.messages.length; i++) {
    addNewMessage(data.messages[i].text, data.messages[i].author)
  }
}

function sendMessage() {
  messageId++;
  authorName = currentUser;

  var messageText = $("#current_message_text").val();
  addNewMessage(messageText, authorName)
  $.ajax({
    url: "./app/send.php",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: {
      "date": Date.now(),
      "author": authorName,
      "author_id": "2",
      "text": messageText
    },
    success: function (response) {
      $("#current_message_text").val('')
    },
    error: function (error) {
      console.log("error" + error);
    }
  });

  document.getElementById(messageId).scrollIntoView();
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
  myTimer = 1000 * 3;
  setTimeout(function () {
    fetchMessage();
  }, myTimer);
}

