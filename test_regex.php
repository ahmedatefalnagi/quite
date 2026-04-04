<?php
$c = <<<'EOF'
        Pdf::loadHTML($html)
            ->setPaper('a4')
            ->save($path);
EOF;
$c = preg_replace("/Pdf::loadHTML.*?save\(\\\$path\);/s", "Browsershot::html(\$html)->showBackground()->format('A4')->margins(8,8,10,8)->noSandbox()->savePdf(\$path);", $c);
echo $c;
