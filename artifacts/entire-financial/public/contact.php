<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

// Never expose credentials, SMTP diagnostics or PHP warnings in JSON responses.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function headerText(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'error' => 'Please submit the contact form using POST.']);
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    respond(415, ['success' => false, 'error' => 'The request must contain JSON.']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    respond(413, ['success' => false, 'error' => 'Your message is too large.']);
}
$raw = file_get_contents('php://input', false, null, 0, 32769);
if ($raw === false || strlen($raw) > 32768) {
    respond(413, ['success' => false, 'error' => 'Your message is too large.']);
}
try {
    $data = json_decode($raw, false, 16, JSON_THROW_ON_ERROR);
} catch (\JsonException $exception) {
    respond(400, ['success' => false, 'error' => 'The request contains invalid JSON.']);
}
if (!$data instanceof \stdClass) {
    respond(400, ['success' => false, 'error' => 'The request must be a JSON object.']);
}

// Return the same success response to bots without contacting SMTP.
if (isset($data->website) && (!is_string($data->website) || trim($data->website) !== '')) {
    respond(200, ['success' => true]);
}

$fields = [];
$errors = [];
$limits = [
    'fullName' => [2, 128],
    'email' => [1, 254],
    'phone' => [8, 30],
    'enquiryType' => [1, 64],
    'message' => [10, 5000],
    'preferredContact' => [1, 16],
    'bestTime' => [1, 16],
];
foreach ($limits as $key => [$min, $max]) {
    $value = $data->$key ?? null;
    if (!is_string($value)) {
        $errors[$key] = 'Please complete this field.';
        continue;
    }
    $value = trim(str_replace("\0", '', $value));
    if ($key === 'email') {
        $value = headerText($value);
    }
    // Count Unicode characters without requiring the optional mbstring extension.
    $length = preg_match_all('/./us', $value);
    if ($length === false || $length < $min || $length > $max) {
        $errors[$key] = 'Please check the length of this field.';
    }
    $fields[$key] = $value;
}
if (!filter_var($fields['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}
if (!preg_match('/^[+\d(). -]+$/D', $fields['phone'] ?? '')) {
    $errors['phone'] = 'Please enter a valid phone number.';
}
$choices = [
    'enquiryType' => ['initial-consultation', 'superannuation', 'retirement', 'wealth', 'other'],
    'preferredContact' => ['email', 'phone'],
    'bestTime' => ['morning', 'afternoon', 'late', 'anytime'],
];
foreach ($choices as $key => $allowed) {
    if (!in_array($fields[$key] ?? '', $allowed, true)) {
        $errors[$key] = 'Please select one of the available options.';
    }
}
if ($errors !== []) {
    respond(422, ['success' => false, 'error' => 'Please check the required fields.', 'errors' => $errors]);
}

try {
    // Relative to deployed contact.php, NOT the source repository or CWD.
    $configPath = dirname(__DIR__) . '/contact-config.php';
    if (!is_file($configPath) || !is_readable($configPath)) {
        throw new \RuntimeException('Missing mail configuration.');
    }
    $config = require $configPath;
    if (!is_array($config)) {
        throw new \RuntimeException('Invalid mail configuration.');
    }
    foreach (['smtp_host', 'smtp_username', 'smtp_password', 'from_email', 'from_name', 'to_email', 'to_name'] as $key) {
        if (!isset($config[$key]) || !is_string($config[$key]) || trim($config[$key]) === '') {
            throw new \RuntimeException('Incomplete mail configuration.');
        }
    }
    if (($config['smtp_port'] ?? null) !== 465
        || !preg_match('/^[a-z0-9.-]+$/iD', $config['smtp_host'])
        || str_contains($config['smtp_username'], "\r") || str_contains($config['smtp_username'], "\n")
        || $config['smtp_password'] === 'REPLACE_WITH_SMTP_PASSWORD') {
        throw new \RuntimeException('Invalid SMTP configuration.');
    }
    foreach (['from_email', 'to_email'] as $key) {
        if (headerText($config[$key]) !== $config[$key]
            || !filter_var($config[$key], FILTER_VALIDATE_EMAIL)) {
            throw new \RuntimeException('Invalid mail address configuration.');
        }
    }

    require_once __DIR__ . '/lib/Exception.php';
    require_once __DIR__ . '/lib/PHPMailer.php';
    require_once __DIR__ . '/lib/SMTP.php';

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->Port = $config['smtp_port'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
        ],
    ];
    // Temporary diagnostics: send SMTP debug output only to the private server log.
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = static function (string $message, int $level): void {
        error_log('contact_mail_debug: ' . $message);
    };
    $mail->Timeout = 10;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], headerText($config['from_name']));
    $mail->addAddress($config['to_email'], headerText($config['to_name']));
    $mail->addReplyTo($fields['email'], headerText($fields['fullName']));
    $mail->Subject = headerText('New enquiry from entirefs.com.au contact form');
    $mail->isHTML(false);
    $mail->Body = implode("\n", [
        'New website contact enquiry',
        '',
        'Full name: ' . $fields['fullName'],
        'Email: ' . $fields['email'],
        'Phone: ' . $fields['phone'],
        'Enquiry type: ' . $fields['enquiryType'],
        'Preferred contact: ' . $fields['preferredContact'],
        'Best time to contact: ' . $fields['bestTime'],
        '',
        'Message:',
        $fields['message'],
    ]);
    if (!$mail->send()) {
        throw new \RuntimeException('SMTP did not accept the message.');
    }
    respond(200, ['success' => true]);
} catch (\Throwable $exception) {
    // Temporary diagnostics; keep server logs private and remove after troubleshooting.
    error_log('contact_mail_failed: ' . $exception->getMessage() . ' | ' . ($mail->ErrorInfo ?? ''));
    respond(503, ['success' => false, 'error' => 'Your message could not be sent. Please try again or contact us by phone or email.']);
}
