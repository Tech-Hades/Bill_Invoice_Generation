<?php
error_reporting(0); // Prevents warnings from breaking JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$rawData = file_get_contents("php://input");
$data = json_decode($rawData);

if($data && !empty($data->email) && !empty($data->password)) {
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    $business = $data->business_name ?? 'My Business';
    
    try {
        $query = "INSERT INTO users (business_name, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->execute([$business, $data->email, $hashed_password]);
        
        // Get the ID of the user we just created
        $userId = $conn->lastInsertId();
        
        echo json_encode([
            "message" => "Success",
            "user" => ["id" => $userId, "business_name" => $business]
        ]);
    } catch(Exception $e) {
        echo json_encode(["error" => "Registration failed: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Missing required fields"]);
}
?>