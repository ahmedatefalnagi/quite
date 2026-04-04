<?php
$content = file_get_contents('c:/xampp/htdocs/quote/app/Services/DocumentPdfService.php');
$b64 = base64_encode($content);
$chunks = str_split($b64, 500);
$commands = [];
$commands[] = "rm -f /tmp/b64.txt";
foreach ($chunks as $chunk) {
    $commands[] = "echo -n '$chunk' >> /tmp/b64.txt";
}
$commands[] = "base64 -d < /tmp/b64.txt | sudo tee /var/www/quote/app/Services/DocumentPdfService.php > /dev/null";
file_put_contents('c:/xampp/htdocs/quote/upload_cmds.log', implode("\n", $commands) . "\n");
