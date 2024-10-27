<?php
include 'db_connection.php';

if (!isset($_GET['u'])) {
    echo json_encode(['access_code' => 0]);
    exit;
}

$username = $conn->real_escape_string($_GET['u']);
$sql = "SELECT access_code FROM User WHERE username = '$username' LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['access_code' => $row['access_code']]);
} else {
    echo json_encode(['access_code' => 0]);
}

$conn->close();
?>