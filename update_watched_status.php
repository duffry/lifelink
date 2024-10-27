<?php
include 'db_connection.php';

// Get the JSON input
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->video_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$username = $conn->real_escape_string($data->username);
$video_id = $conn->real_escape_string($data->video_id);

// Check if the watched state exists
$sql = "SELECT watched_state FROM User_Video WHERE username = '$username' AND video_id = '$video_id'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Update the existing watched state (toggle between 0 and 1)
    $row = $result->fetch_assoc();
    $newWatchedState = $row['watched_state'] == 1 ? 0 : 1;
    $updateSql = "UPDATE User_Video SET watched_state = '$newWatchedState' WHERE username = '$username' AND video_id = '$video_id'";
    if ($conn->query($updateSql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Watched state updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update watched state']);
    }
} else {
    // Insert a new watched state record
    $insertSql = "INSERT INTO User_Video (username, video_id, watched_state) VALUES ('$username', '$video_id', 1)";
    if ($conn->query($insertSql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Watched state added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add watched state']);
    }
}

$conn->close();
?>
