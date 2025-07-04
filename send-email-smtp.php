<?php
// This version uses PHPMailer for Gmail SMTP
// You need to install PHPMailer: composer require phpmailer/phpmailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer (adjust path as needed)
require_once 'vendor/autoload.php';

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type for JSON response
header('Content-Type: application/json');

// Allow CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate input
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    // Gmail SMTP configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'sibghat.developlogix@gmail.com'; // Your Gmail address
    $mail->Password = 'YOUR_APP_PASSWORD_HERE'; // Your Gmail App Password (NOT your regular password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Email settings
    $mail->setFrom('sibghat.developlogix@gmail.com', 'Portfolio Website');
    $mail->addAddress('sibghat.developlogix@gmail.com', 'Sibghat Ullah Baig');
    $mail->addReplyTo($email, $name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Message from Portfolio Website';
    
    $mail->Body = "
    <html>
    <head>
        <title>New Contact Form Message</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #49bf9d; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #49bf9d; margin: 15px 0; }
            .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
                <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
                <p><strong>Message:</strong></p>
                <div class='message-box'>
                    " . nl2br(htmlspecialchars($message)) . "
                </div>
            </div>
            <div class='footer'>
                <p>This message was sent from your portfolio website contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    // Plain text version
    $mail->AltBody = "New Contact Form Message\n\n" .
                     "Name: $name\n" .
                     "Email: $email\n" .
                     "Message: $message\n\n" .
                     "This message was sent from your portfolio website contact form.";

    // Send email
    $mail->send();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! Your message has been sent successfully.'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your message: ' . $mail->ErrorInfo
    ]);
}
?>
