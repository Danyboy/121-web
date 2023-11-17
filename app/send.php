<?php

$jsonData = file_get_contents('php://input');

saveMessage($jsonData);

function saveMessage($jsonData)
{
  if (!empty($jsonData)) {

    $data = json_decode($jsonData, true);
    $currentChat = $data['current_chat'];

    if (!empty($currentChat)) {
      $chatId = $currentChat;
    } else {
      error_log("No such chat, use default chat");
      $chatId = "stas_XFRTS4FT/start_01.json";
    }

    $chatFile = "./chats/" . $chatId;

    $inplement = file_get_contents($chatFile);
    $tempArray = json_decode($inplement, true);
    array_push($tempArray['messages'], $data);
    $jsonData = json_encode($tempArray, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    file_put_contents($chatFile, $jsonData);
    http_response_code(200);
    echo('{"status":200}');
  } else {
    var_dump(http_response_code(404));
    error_log("You give me empty query");
  }

}
