<?php

$jsonData = file_get_contents('php://input');

login($jsonData);

function login($jsonData)
{
  if (!empty($jsonData)) {

    $data = json_decode($jsonData, true);
    $currentUser = strtolower($data['user']);
    // $password = password_hash($data['password'], PASSWORD_DEFAULT);

    if (!empty($currentUser)) {
      $userId = $currentUser;
    } else {
      var_dump(http_response_code(404));
      error_log("No user");
      return;
    }

    $userFile = "./users/" . $userId . ".json";

    if (file_exists($userFile)) {
      // check user password
      // password_verify(string $password, string $hash): bool
    } else {
      $defaultChat = array(
        "chat_name"  => "Public chat",
        "last_message_date" => "2023-11-11T11:11:30.000Z",
        "last_message"  => "Привет, давай сделаем свой месенджер?",
        "chat_folder" => "public",
        "last_chat_file" => "start_01.json",
      );
  
      $userInfo = array(
        "username"  => $userId,
        // "password" => $password,
        "chats" => array($defaultChat)
      );
  
      // create new file
      $jsonData = json_encode($userInfo, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
      file_put_contents($userFile, $jsonData);
    }

    http_response_code(200);
    echo('{"status":200}');
  } else {
    var_dump(http_response_code(404));
    error_log("Check login data");
  }
}

function addChats($userFile, $userInfo, $data){
      // add new chats to exist file
      $inplement = file_get_contents($userFile);
      $tempArray = json_decode($inplement, true);
      array_push($tempArray['messages'], $data);

      $jsonData = json_encode($userInfo, JSON_UNESCAPED_UNICODE);
      file_put_contents($userFile, $jsonData);
}