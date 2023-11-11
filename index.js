document.onkeydown=function(event){
  if(event.key == 'Enter'){
    sendMessage();
  }
}

messageId = 5;

fetchMessage();

function fetchMessage(){
  $.get("./chats/stas_XFRTS4FT/start_01.json", function (data, status) {
    if (data.length) {
      generateMessageList(JSON.parse(data));
    }
  });
}

function generateMessageList(messages) {
  for (var i = 0; i < messages.length; i++) {
    addNewMessage(messages[i].text, messages[i].author)
  }
}

function sendMessage() {
  messageId++;
  authorName = "Dany"

  var messageText = $("#current_message_text").val();
  addNewMessage(messageText, authorName)
  $("#current_message_text").val('')
  
  document.getElementById(messageId).scrollIntoView();
}

function addNewMessage(messageText, authorName) {
  var newMessage =
    `<div class="message" speech-bubble pright acenter message-color id=`+ messageId +`>
    <div class="title">` + authorName + `</div>
    <p>` + messageText + `</p>
  </div>`;

  $("#messages").append($(newMessage));

}

function myHistoryTimeout() {
  myTimer = 1000 * 5;
  setTimeout(function () {
    getHistory();
  }, myTimer);
}

