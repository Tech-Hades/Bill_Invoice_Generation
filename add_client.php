<?php
error_reporting(0); // Stops hidden PHP warnings from breaking your JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if($data && !empty($data->client_name) && !empty($data->user_id)) {
    try {
        $query = "INSERT INTO clients (user_id, client_name, email) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        // We use $data->email ?? '' to prevent errors if email is left blank
        $stmt->execute([$data->user_id, $data->client_name, $data->email ?? '']);
        
        echo json_encode(["message" => "Client added successfully!"]);
    } catch(Exception $e) {
        // Sends the specific error back to React for debugging
        echo json_encode(["error" => "Failed to add client: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Required data missing (client_name or user_id)"]);
}
?>