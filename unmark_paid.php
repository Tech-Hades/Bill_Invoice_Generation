<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if($data->invoice_id) {
    // We change the status back to 'Pending'
    $stmt = $conn->prepare("UPDATE invoices SET status = 'Pending' WHERE id = ?");
    if($stmt->execute([$data->invoice_id])) {
        echo json_encode(["message" => "Invoice reverted to Pending"]);
    }
}
?>