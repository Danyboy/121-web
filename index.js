messageId = 5;

function sendMessage() {
  messageId++;

  var messageText = $("#current_message_text").val();
  var newMessage =
    `<div class="message" speech-bubble pright acenter message-color id=`+ messageId +`>
    <div class="title">Dany</div>
    <p>` + messageText + `</p>
  </div>`;
  $("#current_message_text").val('')

  $("#messages").append($(newMessage));
  
  document.getElementById(messageId).scrollIntoView();
}

document.onkeydown=function(event){
  if(event.key == 'Enter'){
    sendMessage();
  }
}

