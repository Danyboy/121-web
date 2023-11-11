<?php

$jsonData = file_get_contents('php://input');

var_dump($jsonData);

if (!empty($jsonData)) {
  
  $chatId = "stas_XFRTS4FT/start_01.json";

  $chatFile = "./chats/" . $chatId;

  $data = json_decode($jsonData, true);

  var_dump($data);

  $inplement = file_get_contents($chatFile);
  $tempArray = json_decode($inplement, true);
  array_push($tempArray['messages'], $data);
  $jsonData = json_encode($tempArray, JSON_UNESCAPED_UNICODE);
  file_put_contents($chatFile, $jsonData);

  var_dump(http_response_code(200));
} else {
  error_log("You give me empty query");
}

