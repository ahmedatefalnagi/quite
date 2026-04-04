<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'invoice_date' => ['required', 'date'],
            'type' => ['required', 'in:tax,simplified'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.item_name' => ['required', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.tax_percent' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_id' => 'العميل',
            'quotation_id' => 'عرض السعر',
            'invoice_date' => 'تاريخ الفاتورة',
            'type' => 'نوع الفاتورة',
            'status' => 'الحالة',
            'notes' => 'الملاحظات',
            'items' => 'البنود',
            'items.*.item_name' => 'اسم البند',
            'items.*.description' => 'الوصف',
            'items.*.quantity' => 'الكمية',
            'items.*.unit_price' => 'سعر الوحدة',
            'items.*.tax_percent' => 'نسبة الضريبة',
        ];
    }
}