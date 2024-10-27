<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $display_name = $conn->real_escape_string($_POST['display_name']);
    $channel_name = $conn->real_escape_string($_POST['channel_name']);
    $channel_link = $conn->real_escape_string($_POST['channel_link']);
    $image_color = $conn->real_escape_string($_POST['image_color']);
    $image_bw = $conn->real_escape_string($_POST['image_bw']);

    $sql = "INSERT INTO Hermit (display_name, channel_name, channel_link, image_color, image_bw)
            VALUES ('$display_name', '$channel_name', '$channel_link', '$image_color', '$image_bw')";

    if ($conn->query($sql) === TRUE) {
        echo "New hermit added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
