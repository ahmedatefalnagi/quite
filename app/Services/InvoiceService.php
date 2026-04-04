<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Quotation;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    public function create(array $data, int $userId): Invoice
    {
        return DB::transaction(function () use ($data, $userId) {
            $totals = $this->calculateTotals($data['items']);

            $invoice = Invoice::create([
                'customer_id' => $data['customer_id'],
                'quotation_id' => $data['quotation_id'] ?? null,
                'invoice_no' => $this->generateInvoiceNumber(),
                'invoice_date' => $data['invoice_date'],
                'type' => $data['type'],
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

                $invoice->items()->create([
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

            return $invoice->load(['customer', 'items']);
        });
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        return DB::transaction(function () use ($invoice, $data) {
            $totals = $this->calculateTotals($data['items']);

            $invoice->update([
                'customer_id' => $data['customer_id'],
                'quotation_id' => $data['quotation_id'] ?? null,
                'invoice_date' => $data['invoice_date'],
                'type' => $data['type'],
                'status' => $data['status'],
                'subtotal' => $totals['subtotal'],
                'tax_amount' => $totals['tax_amount'],
                'total' => $totals['total'],
                'notes' => $data['notes'] ?? null,
            ]);

            $invoice->items()->delete();

            foreach ($data['items'] as $index => $item) {
                $lineSubtotal = (float) $item['quantity'] * (float) $item['unit_price'];
                $lineTax = $lineSubtotal * ((float) $item['tax_percent'] / 100);
                $lineTotal = $lineSubtotal + $lineTax;

                $invoice->items()->create([
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

            return $invoice->load(['customer', 'items']);
        });
    }

    public function createFromQuotation(Quotation $quotation, int $userId): Invoice
    {
        return DB::transaction(function () use ($quotation, $userId) {
            $quotation->load(['items', 'customer']);

            $invoice = Invoice::create([
                'customer_id' => $quotation->customer_id,
                'quotation_id' => $quotation->id,
                'invoice_no' => $this->generateInvoiceNumber(),
                'invoice_date' => now()->toDateString(),
                'type' => 'tax',
                'status' => 'draft',
                'subtotal' => $quotation->subtotal,
                'tax_amount' => $quotation->tax_amount,
                'total' => $quotation->total,
                'notes' => $quotation->notes,
                'created_by' => $userId,
            ]);

            foreach ($quotation->items as $index => $item) {
                $invoice->items()->create([
                    'item_name' => $item->item_name,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'tax_percent' => $item->tax_percent,
                    'line_subtotal' => $item->line_subtotal,
                    'line_tax' => $item->line_tax,
                    'line_total' => $item->line_total,
                    'sort_order' => $index + 1,
                ]);
            }

            return $invoice->load(['customer', 'items']);
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

    protected function generateInvoiceNumber(): string
    {
        $lastId = Invoice::max('id') ?? 0;
        $nextId = $lastId + 1;

        return 'INV-' . str_pad((string) $nextId, 5, '0', STR_PAD_LEFT);
    }
}