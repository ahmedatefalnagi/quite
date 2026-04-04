<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\CompanySetting;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Quotation;
use App\Services\InvoiceService;
use App\Services\ZatcaQrService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\DocumentPdfService;

class InvoiceController extends Controller
{
    public function __construct(
        protected InvoiceService $invoiceService,
        protected ZatcaQrService $zatcaQrService,
        protected DocumentPdfService $documentPdfService
    ) {}

    public function index(): Response
    {
        $invoices = Invoice::with('customer')
            ->latest()
            ->paginate(10);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Invoices/Create', [
            'customers' => Customer::select('id', 'name', 'company_name')->latest()->get(),
            'quotations' => Quotation::select('id', 'quotation_no')->latest()->get(),
            'types' => [
                ['value' => 'tax', 'label' => 'فاتورة ضريبية'],
                ['value' => 'simplified', 'label' => 'فاتورة ضريبية مبسطة'],
            ],
            'statuses' => [
                ['value' => 'draft', 'label' => 'مسودة'],
                ['value' => 'issued', 'label' => 'مصدرة'],
                ['value' => 'paid', 'label' => 'مدفوعة'],
                ['value' => 'cancelled', 'label' => 'ملغية'],
            ],
        ]);
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $invoice = $this->invoiceService->create(
            $request->validated(),
            auth()->id()
        );

        return redirect()
            ->to("/invoices/{$invoice->id}")
            ->with('success', 'تم إنشاء الفاتورة بنجاح');
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load(['customer', 'items', 'creator', 'quotation']);

        $company = CompanySetting::first();

        $qrCode = null;

        if ($company && $company->company_name && $company->vat_number) {
            $timestamp = $invoice->created_at?->toIso8601String() ?? now()->toIso8601String();

            $qrCode = $this->zatcaQrService->generate(
                sellerName: $company->company_name,
                vatNumber: $company->vat_number,
                invoiceTimestamp: $timestamp,
                invoiceTotal: (string) $invoice->total,
                vatTotal: (string) $invoice->tax_amount,
            );
        }

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
            'company' => $company,
            'qrCode' => $qrCode,
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        $invoice->load('items');

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'customers' => Customer::select('id', 'name', 'company_name')->latest()->get(),
            'quotations' => Quotation::select('id', 'quotation_no')->latest()->get(),
            'types' => [
                ['value' => 'tax', 'label' => 'فاتورة ضريبية'],
                ['value' => 'simplified', 'label' => 'فاتورة ضريبية مبسطة'],
            ],
            'statuses' => [
                ['value' => 'draft', 'label' => 'مسودة'],
                ['value' => 'issued', 'label' => 'مصدرة'],
                ['value' => 'paid', 'label' => 'مدفوعة'],
                ['value' => 'cancelled', 'label' => 'ملغية'],
            ],
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $invoice = $this->invoiceService->update($invoice, $request->validated());

        return redirect()
            ->to("/invoices/{$invoice->id}")
            ->with('success', 'تم تحديث الفاتورة بنجاح');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()
            ->to('/invoices')
            ->with('success', 'تم حذف الفاتورة بنجاح');
    }

    public function createFromQuotation(Quotation $quotation): RedirectResponse
    {
        if ($quotation->invoice()->exists()) {
            return redirect()
                ->to("/invoices/" . $quotation->invoice->id)
                ->with('error', 'تم إنشاء فاتورة لهذا العرض مسبقًا');
        }

        $invoice = $this->invoiceService->createFromQuotation($quotation, auth()->id());

        return redirect()
            ->to("/invoices/{$invoice->id}")
            ->with('success', 'تم تحويل عرض السعر إلى فاتورة بنجاح');
    }

    public function downloadPdf(Invoice $invoice)
    {
        $path = $this->documentPdfService->generateInvoicePdf($invoice);

        return response()->download($path)->deleteFileAfterSend(false);
    }
}