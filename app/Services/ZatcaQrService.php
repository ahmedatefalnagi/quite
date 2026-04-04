<?php

namespace App\Services;

class ZatcaQrService
{
    public function generate(
        string $sellerName,
        string $vatNumber,
        string $invoiceTimestamp,
        string $invoiceTotal,
        string $vatTotal
    ): string {
        $tlv = '';
        $tlv .= $this->buildTag(1, $sellerName);
        $tlv .= $this->buildTag(2, $vatNumber);
        $tlv .= $this->buildTag(3, $invoiceTimestamp);
        $tlv .= $this->buildTag(4, $invoiceTotal);
        $tlv .= $this->buildTag(5, $vatTotal);

        return base64_encode($tlv);
    }

    protected function buildTag(int $tag, string $value): string
    {
        return chr($tag) . chr(strlen($value)) . $value;
    }
}