<?php

namespace App\Services;

use App\Models\Quotation;
use Illuminate\Support\Facades\DB;

class QuotationService
{
    public function create(array $data, int $userId): Quotation
    {
        return DB::transaction(function () use ($data, $userId) {
            $totals = $this->calculateTotals($data['items']);

            $quotation = Quotation::create([
                'customer_id' => $data['customer_id'],
                'quotation_no' => $this->generateQuotationNumber(),
                'quotation_date' => $data['quotation_date'],
                'status' => $data['status'],
                'subtotal' => $totals['subtotal'],
                'tax_amount' => $totals['tax_amount'],
                'total' => $totals['total'],
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $index => $item) {
                $lineSubtotal = (float) $item['quantity'] * (float) $item['unit_price'];
                $lineTax = $lineSubtotal * ((float) $item['tax_percent'] / 100);
                $lineTotal = $lineSubtotal + $lineTax;

                $quotation->items()->create([
                    'item_name' => $item['item_name'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_percent' => $item['tax_percent'],
                    'line_subtotal' => round($lineSubtotal, 2),
                    'line_tax' => round($lineTax, 2),
                    'line_total' => round($lineTotal, 2),
                    'sort_order' => $index + 1,
                ]);
            }

            return $quotation->load(['customer', 'items']);
        });
    }

    public function update(Quotation $quotation, array $data): Quotation
    {
        return DB::transaction(function () use ($quotation, $data) {
            $totals = $this->calculateTotals($data['items']);

            $quotation->update([
                'customer_id' => $data['customer_id'],
                'quotation_date' => $data['quotation_date'],
                'status' => $data['status'],
                'subtotal' => $totals['subtotal'],
                'tax_amount' => $totals['tax_amount'],
                'total' => $totals['total'],
                'notes' => $data['notes'] ?? null,
            ]);

            $quotation->items()->delete();

            foreach ($data['items'] as $index => $item) {
                $lineSubtotal = (float) $item['quantity'] * (float) $item['unit_price'];
                $lineTax = $lineSubtotal * ((float) $item['tax_percent'] / 100);
                $lineTotal = $lineSubtotal + $lineTax;

                $quotation->items()->create([
                    'item_name' => $item['item_name'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_percent' => $item['tax_percent'],
                    'line_subtotal' => round($lineSubtotal, 2),
                    'line_tax' => round($lineTax, 2),
                    'line_total' => round($lineTotal, 2),
                    'sort_order' => $index + 1,
                ]);
            }

            return $quotation->load(['customer', 'items']);
        });
    }

    protected function calculateTotals(array $items): array
    {
        $subtotal = 0;
        $taxAmount = 0;
        $total = 0;

        foreach ($items as $item) {
            $lineSubtotal = (float) $item['quantity'] * (float) $item['unit_price'];
            $lineTax = $lineSubtotal * ((float) $item['tax_percent'] / 100);
            $lineTotal = $lineSubtotal + $lineTax;

            $subtotal += $lineSubtotal;
            $taxAmount += $lineTax;
            $total += $lineTotal;
        }

        return [
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($taxAmount, 2),
            'total' => round($total, 2),
        ];
    }

    protected function generateQuotationNumber(): string
    {
        $lastId = Quotation::max('id') ?? 0;
        $nextId = $lastId + 1;

        return 'QUO-' . str_pad((string) $nextId, 5, '0', STR_PAD_LEFT);
    }
}