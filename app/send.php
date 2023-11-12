<?php

$jsonData = file_get_contents('php://input');

saveMessage();

function saveMessage()
{
  if (!empty($jsonData)) {

    $currentChat = $jsonData['current_chat'];
    if (!empty($currentChat)) {
      $chatId = "stas_XFRTS4FT/start_01.json";
    } else {
      var_dump(http_response_code(404));
      error_log("No such chat");
      return;
    }

    $chatFile = "./chats/" . $chatId;

    $data = json_decode($jsonData, true);

    $inplement = file_get_contents($chatFile);
    $tempArray = json_decode($inplement, true);
    array_push($tempArray['messages'], $data);
    $jsonData = json_encode($tempArray, JSON_UNESCAPED_UNICODE);
    file_put_contents($chatFile, $jsonData);

    var_dump(http_response_code(200));
  } else {
    error_log("You give me empty query");
  }

}
