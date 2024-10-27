<?php
include 'db_connection.php';

$series_id = isset($_GET['series_id']) ? intval($_GET['series_id']) : 0;

if ($series_id > 0) {
    // Fetch all hermits and their video links for a given series
    $sql = "SELECT h.display_name, h.image_color, h.image_bw, v.video_link, v.episode_number
            FROM Hermit h
            LEFT JOIN Video v ON h.hermit_id = v.hermit_id AND v.series_id = $series_id
            ORDER BY h.display_name, v.episode_number";
    
    $result = $conn->query($sql);
    $data = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$conn->close();
?>
