<?php
$lines = file('C:/Users/lenovo/.gemini/antigravity/brain/6d2e7de7-62d6-4311-bdcd-85509a50ae22/.system_generated/steps/100/content.md');
foreach(array_slice($lines, -100) as $line) {
    echo $line;
}
