<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$user_id = $_GET['user_id'];

if($user_id) {
    $query = "SELECT * FROM clients WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);
    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($clients);
}
?>
