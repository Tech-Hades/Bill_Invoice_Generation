<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if($data->invoice_id) {
    // Because of 'ON DELETE CASCADE' we set in the DB, 
    // deleting the invoice will automatically delete its items!
    $stmt = $conn->prepare("DELETE FROM invoices WHERE id = ?");
    $stmt->execute([$data->invoice_id]);
    echo json_encode(["message" => "Invoice deleted"]);
}
?>