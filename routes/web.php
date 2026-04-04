<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\InvoiceController;
use App\Models\Customer;
use App\Models\Quotation;
use App\Models\Invoice;




Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {

  Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'customers_count' => Customer::count(),
            'quotations_count' => Quotation::count(),
            'invoices_count' => Invoice::count(),
            'draft_quotations_count' => Quotation::where('status', 'draft')->count(),
            'issued_invoices_count' => Invoice::where('status', 'issued')->count(),
            'paid_invoices_count' => Invoice::where('status', 'paid')->count(),
        ],
        'latest_customers' => Customer::latest()->take(5)->get([
            'id',
            'name',
            'company_name',
            'created_at',
        ]),
        'latest_quotations' => Quotation::with('customer')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'customer_id',
                'quotation_no',
                'quotation_date',
                'status',
                'total',
                'created_at',
            ]),
        'latest_invoices' => Invoice::with('customer')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'customer_id',
                'invoice_no',
                'invoice_date',
                'status',
                'total',
                'created_at',
            ]),
    ]);
})->name('dashboard');

    Route::resource('customers', CustomerController::class);
    Route::resource('quotations', QuotationController::class);

    Route::get('/settings/company', [CompanySettingController::class, 'edit']);
    Route::put('/settings/company', [CompanySettingController::class, 'update']);

    Route::post('/quotations/{quotation}/convert-to-invoice', [InvoiceController::class, 'createFromQuotation']);
    Route::resource('invoices', InvoiceController::class);

    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPdf']);
    Route::get('/quotations/{quotation}/pdf', [QuotationController::class, 'downloadPdf']);
    Route::post('/customers/quick-store', [CustomerController::class, 'quickStore']);
});

require __DIR__.'/auth.php';