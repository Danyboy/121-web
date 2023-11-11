<?php

if (!empty($_POST['data'])) {
  
  $chatId = "stas_XFRTS4FT/start_01.json";

  $chatFile = "../chats/" . $chatId;

  $data[] = $_POST['data'];

  $inplement = file_get_contents($chatFile);
  $tempArray = json_decode($inplement);
  array_push($tempArray, $data);
  $jsonData = json_encode($tempArray);
  file_put_contents($chatFile, $jsonData);
} else {
  error_log("You give me empty query");
}

