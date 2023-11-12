<?php

$jsonData = file_get_contents('php://input');

saveMessage($jsonData);

// error_log(var_dump($jsonData));

function saveMessage($jsonData)
{
  if (!empty($jsonData)) {

    $data = json_decode($jsonData, true);
    $currentChat = $data['current_chat'];

    if (!empty($currentChat)) {
      $chatId = $currentChat;
    } else {
      var_dump(http_response_code(404));
      error_log("No such chat");
      return;
    }

    $chatFile = "./chats/" . $chatId;

    $inplement = file_get_contents($chatFile);
    $tempArray = json_decode($inplement, true);
    array_push($tempArray['messages'], $data);
    $jsonData = json_encode($tempArray, JSON_UNESCAPED_UNICODE);
    file_put_contents($chatFile, $jsonData);
    http_response_code(200);
    echo('{"status":200}');
  } else {
    var_dump(http_response_code(404));
    error_log("You give me empty query");
  }

}
