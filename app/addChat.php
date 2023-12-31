<?php

$jsonData = file_get_contents('php://input');

login($jsonData);

function login($jsonData)
{
  if (!empty($jsonData)) {

    $data = json_decode($jsonData, true);
    $newChatWithUser = strtolower($data['newChatUser']);
    $user = strtolower($data['user']);

    if (!empty($user) && !empty($newChatWithUser)) {
      $userId = $user;
      $newChatWithUserId = $newChatWithUser;
    } else {
      var_dump(http_response_code(404));
      error_log("No chat user or current user");
      return;
    }

    //Get first user for first position in chat folder
    $chatFolderName = $userId . "_" . $newChatWithUserId;

    // Add chat to initialaser
    $chatFullPath = addChatToUser($userId, $newChatWithUserId, $chatFolderName);
    // Add chat to second user
    addChatToUser($newChatWithUserId, $userId, $chatFolderName);
    createChatJson($chatFolderName, $chatFullPath, $userId);

    http_response_code(200);
    echo ('{"status":200, "chat_folder": "' . $chatFullPath . '"}');
  } else {
    var_dump(http_response_code(404));
    error_log("You give me empty login data");
  }
}

function addChatToUser($userId, $newChatWithUserId, $chatFolderName)
{
  $userFile = "./users/" . $userId . ".json";

  if (file_exists($userFile)) {
    $last_chat_file = "start_01.json";

    $newChatData = array(
      "chat_name" => $newChatWithUserId,
      "last_message_date" => "2023-11-11T11:11:30.000Z",
      "last_message" => "Приветствую тебя в новом месенджере!",
      "chat_folder" => $chatFolderName,
      "last_chat_file" => $last_chat_file,
    );

    $newChatJsonFile = file_get_contents($userFile);
    $tempArray = json_decode($newChatJsonFile, true);

    array_push($tempArray['chats'], $newChatData);
    $jsonData = json_encode($tempArray, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    file_put_contents($userFile, $jsonData);

    $chatFullPath = $chatFolderName . '/' . $last_chat_file;

    return $chatFullPath;
  } else {
    var_dump(http_response_code(404));
    error_log("Check new chat data");
  }
}

function createChatJson($chatFolderName, $filePath, $newChatWithUserId)
{
  $newChatData = array(
    "chat_name" => $newChatWithUserId,
    "chat_id" => "1",
    "messages" => []
  );
 
  $myChatsFolder = "chats/";
  $chatPath = $myChatsFolder . $chatFolderName;
  if (!file_exists($chatPath)) {
    mkdir($chatPath, 0777, true);
  }

  $fullChatPath = $myChatsFolder . $filePath;

  if (!file_exists($fullChatPath)) {
    file_put_contents($fullChatPath, json_encode($newChatData, JSON_UNESCAPED_UNICODE));
  } 
}