<?php
include 'db_connection.php';

// Fetch username from GET parameters, if available
$username = isset($_GET['u']) ? $_GET['u'] : '';

// Prepare the SQL query
$sql = "SELECT s.series_id, s.name AS series_name, s.first_airing_date, s.theme_description, 
               h.display_name, h.hermit_id, h.image_color, v.episode_number, v.video_link, v.video_id, 
               IFNULL(uv.watched_state, 0) AS watched_state
        FROM Series s
        LEFT JOIN Hermit_Series hs ON s.series_id = hs.series_id
        LEFT JOIN Hermit h ON hs.hermit_id = h.hermit_id
        LEFT JOIN Video v ON h.hermit_id = v.hermit_id AND s.series_id = v.series_id
        LEFT JOIN User_Video uv ON v.video_id = uv.video_id AND uv.username = ?
        ORDER BY s.first_airing_date DESC";

// Prepare the statement
$stmt = $conn->prepare($sql);

// Ensure username is passed correctly to avoid empty parameter issues
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

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
                'video_link' => $row['video_link'],
                'video_id' => $row['video_id'],
                'watched_state' => $row['watched_state']
            ];
        }
    }
}

echo json_encode(array_values($series));

$conn->close();
?>
