<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuotationRequest;
use App\Http\Requests\UpdateQuotationRequest;
use App\Models\Customer;
use App\Models\Quotation;
use App\Services\QuotationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\DocumentPdfService;

class QuotationController extends Controller
{
    public function __construct(
        protected QuotationService $quotationService,
        protected DocumentPdfService $documentPdfService
    ) {}

    public function index(): Response
    {
        $quotations = Quotation::with('customer')
            ->latest()
            ->paginate(10);

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Quotations/Create', [
            'customers' => Customer::select('id', 'name', 'company_name')->latest()->get(),
            'statuses' => [
                ['value' => 'draft', 'label' => 'مسودة'],
                ['value' => 'sent', 'label' => 'مرسل'],
                ['value' => 'approved', 'label' => 'معتمد'],
                ['value' => 'rejected', 'label' => 'مرفوض'],
            ],
        ]);
    }

    public function store(StoreQuotationRequest $request): RedirectResponse
    {
        $quotation = $this->quotationService->create(
            $request->validated(),
            auth()->id()
        );

        return redirect()
            ->to("/quotations/{$quotation->id}")
            ->with('success', 'تم إنشاء عرض السعر بنجاح');
    }

    public function show(Quotation $quotation): Response
    {
        $quotation->load(['customer', 'items', 'creator', 'invoice']);

        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation,
        ]);
    }

    public function edit(Quotation $quotation): Response
    {
        $quotation->load('items');

        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'customers' => Customer::select('id', 'name', 'company_name')->latest()->get(),
            'statuses' => [
                ['value' => 'draft', 'label' => 'مسودة'],
                ['value' => 'sent', 'label' => 'مرسل'],
                ['value' => 'approved', 'label' => 'معتمد'],
                ['value' => 'rejected', 'label' => 'مرفوض'],
            ],
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): RedirectResponse
    {
        $quotation = $this->quotationService->update($quotation, $request->validated());

        return redirect()
            ->to("/quotations/{$quotation->id}")
            ->with('success', 'تم تحديث عرض السعر بنجاح');
    }

    public function destroy(Quotation $quotation): RedirectResponse
    {
        $quotation->delete();

        return redirect()
            ->to('/quotations')
            ->with('success', 'تم حذف عرض السعر بنجاح');
    }

    public function downloadPdf(Quotation $quotation)
    {
        $path = $this->documentPdfService->generateQuotationPdf($quotation);

        return response()->download($path)->deleteFileAfterSend(false);
    }
}