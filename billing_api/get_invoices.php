<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

$user_id = $_GET['user_id'];

if($user_id) {
    // Join with clients table to show the client name instead of just ID
    $query = "SELECT i.*, c.client_name 
              FROM invoices i 
              JOIN clients c ON i.client_id = c.id 
              WHERE i.user_id = ? 
              ORDER BY i.id DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
?>
