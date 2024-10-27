<?php
include 'db_connection.php';

// Fetch series, associated hermits, and videos information, including the video link
$sql = "SELECT s.series_id, s.name AS series_name, s.first_airing_date, s.theme_description, 
               h.display_name, h.hermit_id, h.image_color, v.episode_number, v.video_link
        FROM Series s
        LEFT JOIN Hermit_Series hs ON s.series_id = hs.series_id
        LEFT JOIN Hermit h ON hs.hermit_id = h.hermit_id
        LEFT JOIN Video v ON h.hermit_id = v.hermit_id AND s.series_id = v.series_id
        ORDER BY s.first_airing_date DESC";

$result = $conn->query($sql);

$series = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $seriesId = $row['series_id'];
        if (!isset($series[$seriesId])) {
            $series[$seriesId] = [
                'series_id' => $row['series_id'],
                'name' => $row['series_name'],
                'first_airing_date' => $row['first_airing_date'],
                'theme_description' => $row['theme_description'],
                'hermits' => [],
                'videos' => []
            ];
        }

        if ($row['hermit_id']) {
            $hermitKey = $row['hermit_id'];
            if (!isset($series[$seriesId]['hermits'][$hermitKey])) {
                $series[$seriesId]['hermits'][$hermitKey] = [
                    'hermit_id' => $row['hermit_id'],
                    'display_name' => $row['display_name'],
                    'image_color' => $row['image_color']
                ];
            }
        }

        if ($row['episode_number']) {
            $series[$seriesId]['videos'][] = [
                'hermit_id' => $row['hermit_id'],
                'episode_number' => $row['episode_number'],
                'video_link' => $row['video_link']
            ];
        }
    }
}

echo json_encode(array_values($series));

$conn->close();
?>
