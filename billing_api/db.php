<?php
// Database credentials
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "billing_portal";

try {
    // Create connection using PDO (more secure than mysqli)
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    // Set error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
   
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
