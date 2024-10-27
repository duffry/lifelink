<?php
include 'db_connection.php';

// Get the JSON input
$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (!isset($data->hermit_id) || !isset($data->series_id) || !isset($data->episode_number) || !isset($data->video_url)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$hermit_id = $conn->real_escape_string($data->hermit_id);
$series_id = $conn->real_escape_string($data->series_id);
$episode_number = $conn->real_escape_string($data->episode_number);
$video_url = $conn->real_escape_string($data->video_url);

// Validate that the URL is a valid YouTube link
if (!preg_match("/^(https?:\\/\\/)?(www\\.)?(youtube\\.com|youtu\\.?be)\\/.+$/", $video_url)) {
    echo json_encode(['success' => false, 'message' => 'Invalid YouTube URL']);
    exit;
}

// Insert the video link into the Video table
$sql = "INSERT INTO Video (series_id, hermit_id, episode_number, video_link) VALUES ('$series_id', '$hermit_id', '$episode_number', '$video_url')
        ON DUPLICATE KEY UPDATE video_link = '$video_url'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Video link added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
}

$conn->close();
?>
