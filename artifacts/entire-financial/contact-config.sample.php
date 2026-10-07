<?php
declare(strict_types=1);

// Copy to contact-config.php ONE DIRECTORY ABOVE the actual web root.
// Example: /home/CPANEL_USER/contact-config.php when web root is public_html/.
// Keep this file private; never upload it into public_html or commit credentials.
return [
    'smtp_host' => 'entirefs.com.au',
    'smtp_port' => 465,
    'smtp_username' => 'forms@entirefs.com.au',
    'smtp_password' => 'REPLACE_WITH_SMTP_PASSWORD',
    'from_email' => 'forms@entirefs.com.au',
    'from_name' => 'Entire Financial Services',
    'to_email' => 'admin@synapse8.com.au',
    'to_name' => 'Website enquiries',
];
