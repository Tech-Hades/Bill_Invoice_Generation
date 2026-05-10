<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if($data && !empty($data->items)) {
    try {
        $conn->beginTransaction(); // Start a transaction

        // 1. Insert Invoice Header
        $stmt = $conn->prepare("INSERT INTO invoices (user_id, client_id, invoice_number, due_date, total_amount) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data->user_id, $data->client_id, $data->invoice_num, $data->due_date, $data->total]);
        $invoice_id = $conn->lastInsertId();

        // 2. Insert Line Items
        $itemStmt = $conn->prepare("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price) VALUES (?, ?, ?, ?)");
        foreach($data->items as $item) {
            $itemStmt->execute([$invoice_id, $item->desc, $item->qty, $item->price]);
        }

        $conn->commit();
        echo json_encode(["message" => "Invoice generated successfully!"]);
    } catch(Exception $e) {
        $conn->rollBack();
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>