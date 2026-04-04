<?php

namespace App\Services;

use App\Models\CompanySetting;
use App\Models\Invoice;
use App\Models\Quotation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\File;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Spatie\Browsershot\Browsershot;

class DocumentPdfService
{
    public function generateInvoicePdf(Invoice $invoice): string
    {
        $invoice->load(['customer', 'items', 'creator', 'quotation']);
        $company = CompanySetting::firstOrFail();

        $qrBase64 = $this->generateInvoiceQrBase64($invoice, $company);

        $html = view('pdf.documents.document', [
            'title' => 'فاتورة ضريبية',
            'documentType' => 'invoice',
            'number' => $invoice->invoice_no,
            'date' => optional($invoice->invoice_date)->format('Y/m/d') ?? $invoice->invoice_date,
            'supplyDate' => optional($invoice->invoice_date)->format('Y/m/d') ?? $invoice->invoice_date,
            'customerName' => $invoice->customer?->name,
            'customerVat' => $invoice->customer?->tax_number,
            'company' => [
                'name' => $company->company_name,
                'vat_number' => $company->vat_number,
                'commercial_registration' => $company->commercial_registration,
                'iban' => $company->iban,
                'logo' => public_path('images/logo.png'),
            ],
            'items' => $invoice->items->map(function ($item) {
                return [
                    'name' => $item->item_name,
                    'unit' => 'عدد',
                    'qty' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->line_subtotal,
                ];
            })->toArray(),
            'subtotal' => $invoice->subtotal,
            'taxAmount' => $invoice->tax_amount,
            'total' => $invoice->total,
            'qrCodeBase64' => $qrBase64,
        ])->render();

        $path = storage_path('app/public/invoice-' . $invoice->id . '.pdf');

        Browsershot::html($html)
            ->showBackground()
            ->format('A4')
            ->margins(8, 8, 10, 8)
            ->noSandbox()
            ->savePdf($path);

        return $path;
    }

    public function generateQuotationPdf(Quotation $quotation): string
    {
        $quotation->load(['customer', 'items', 'creator']);
        $company = CompanySetting::firstOrFail();

        $html = view('pdf.documents.document', [
            'title' => 'عرض سعر',
            'documentType' => 'quotation',
            'number' => $quotation->quotation_no,
            'date' => optional($quotation->quotation_date)->format('Y/m/d') ?? $quotation->quotation_date,
            'supplyDate' => optional($quotation->quotation_date)->format('Y/m/d') ?? $quotation->quotation_date,
            'customerName' => $quotation->customer?->name,
            'customerVat' => $quotation->customer?->tax_number,
            'company' => [
                'name' => $company->company_name,
                'vat_number' => $company->vat_number,
                'commercial_registration' => $company->commercial_registration,
                'iban' => $company->iban,
                'logo' => public_path('images/logo.png'),
            ],
            'items' => $quotation->items->map(function ($item) {
                return [
                    'name' => $item->item_name,
                    'unit' => 'عدد',
                    'qty' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->line_subtotal,
                ];
            })->toArray(),
            'subtotal' => $quotation->subtotal,
            'taxAmount' => $quotation->tax_amount,
            'total' => $quotation->total,
            'qrCodeBase64' => null,
        ])->render();

        $path = storage_path('app/public/quotation-' . $quotation->id . '.pdf');

        Browsershot::html($html)
            ->showBackground()
            ->format('A4')
            ->margins(8, 8, 10, 8)
            ->noSandbox()
            ->savePdf($path);

        return $path;
    }

    protected function generateInvoiceQrBase64(Invoice $invoice, CompanySetting $company): ?string
    {
        if (!$company->company_name || !$company->vat_number) {
            return null;
        }

        $zatca = app(ZatcaQrService::class)->generate(
            sellerName: $company->company_name,
            vatNumber: $company->vat_number,
            invoiceTimestamp: $invoice->created_at?->toIso8601String() ?? now()->toIso8601String(),
            invoiceTotal: (string) $invoice->total,
            vatTotal: (string) $invoice->tax_amount,
        );

        return base64_encode(
            QrCode::format('svg')->size(180)->margin(1)->generate($zatca)
        );
    }
}