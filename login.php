<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if($data && !empty($data->email) && !empty($data->password)) {
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists and password is correct
    if($user && password_verify($data->password, $user['password'])) {
        // In a real app, you'd start a session here
        echo json_encode([
            "message" => "Login successful!",
            "user" => [
                "id" => $user['id'],
                "business_name" => $user['business_name']
            ]
        ]);
    } else {
        echo json_encode(["error" => "Invalid email or password"]);
    }
}
?>