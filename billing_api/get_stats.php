<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

$user_id = $_GET['user_id'];

if($user_id) {
    try {
        // 1. Calculate Revenue (Paid) and Pending (Unpaid)
        $stmt = $conn->prepare("SELECT 
            SUM(CASE WHEN status = 'Paid' THEN total_amount ELSE 0 END) as revenue,
            SUM(CASE WHEN status = 'Pending' THEN total_amount ELSE 0 END) as pending
            FROM invoices WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $finances = $stmt->fetch(PDO::FETCH_ASSOC);

        // 2. Count Total Clients
        $stmt = $conn->prepare("SELECT COUNT(*) as total_clients FROM clients WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $clients = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "revenue" => number_format($finances['revenue'] ?? 0, 2, '.', ''),
            "pending" => number_format($finances['pending'] ?? 0, 2, '.', ''),
            "total_clients" => $clients['total_clients'] ?? 0
        ]);
    } catch(Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
