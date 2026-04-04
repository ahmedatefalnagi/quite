import { useState } from 'react';
import type { FormEvent } from 'react';

interface CustomerOption {
    id: number;
    name: string;
    company_name: string | null;
}

interface StatusOption {
    value: string;
    label: string;
}

interface QuotationItemForm {
    item_name: string;
    description: string;
    quantity: number | string;
    unit_price: number | string;
    tax_percent: number | string;
}

interface QuotationFormData {
    customer_id: number | string;
    quotation_date: string;
    status: string;
    notes: string;
    items: QuotationItemForm[];
}

interface QuotationFormProps {
    data: QuotationFormData;
    setData: (key: keyof QuotationFormData, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    customers: CustomerOption[];
    statuses: StatusOption[];
    title: string;
    description: string;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    cancelHref: string;
}

export default function QuotationForm({
    data,
    setData,
    errors,
    processing,
    customers,
    statuses,
    title,
    description,
    submitLabel,
    onSubmit,
    cancelHref,
}: QuotationFormProps) {
    const [localCustomers, setLocalCustomers] = useState<CustomerOption[]>(customers);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [customerForm, setCustomerForm] = useState({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        tax_number: '',
        address: '',
    });
    const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});
    const [customerProcessing, setCustomerProcessing] = useState(false);

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                item_name: '',
                description: '',
                quantity: 1,
                unit_price: 0,
                tax_percent: 15,
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (data.items.length === 1) return;

        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (index: number, field: keyof QuotationItemForm, value: string) => {
        const updatedItems = [...data.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };
        setData('items', updatedItems);
    };

    const calcLineSubtotal = (item: QuotationItemForm) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unit_price) || 0;
        return quantity * unitPrice;
    };

    const calcLineTax = (item: QuotationItemForm) => {
        const subtotal = calcLineSubtotal(item);
        const taxPercent = Number(item.tax_percent) || 0;
        return subtotal * (taxPercent / 100);
    };

    const calcLineTotal = (item: QuotationItemForm) => {
        return calcLineSubtotal(item) + calcLineTax(item);
    };

    const subtotal = data.items.reduce((sum, item) => sum + calcLineSubtotal(item), 0);
    const taxAmount = data.items.reduce((sum, item) => sum + calcLineTax(item), 0);
    const total = subtotal + taxAmount;

    const resetCustomerForm = () => {
        setCustomerForm({
            name: '',
            company_name: '',
            email: '',
            phone: '',
            tax_number: '',
            address: '',
        });
        setCustomerErrors({});
    };

    const handleQuickCustomerCreate = async () => {
        setCustomerProcessing(true);
        setCustomerErrors({});

        try {
            const response = await fetch('/customers/quick-store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify(customerForm),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const formattedErrors: Record<string, string> = {};
                    Object.keys(result.errors).forEach((key) => {
                        formattedErrors[key] = result.errors[key][0];
                    });
                    setCustomerErrors(formattedErrors);
                }
                return;
            }

            const newCustomer = result.customer as CustomerOption;

            setLocalCustomers((prev) => [...prev, newCustomer]);
            setData('customer_id', String(newCustomer.id));

            resetCustomerForm();
            setShowCustomerModal(false);
        } catch {
            setCustomerErrors({
                name: 'حدث خطأ أثناء حفظ العميل',
            });
        } finally {
            setCustomerProcessing(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500">{description}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-6 text-lg font-bold text-slate-800">البيانات الأساسية</h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label className="block text-sm font-medium text-slate-700">
                                        العميل <span className="text-red-500">*</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowCustomerModal(true)}
                                        className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        + إضافة عميل
                                    </button>
                                </div>

                                <select
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">اختر العميل</option>
                                    {localCustomers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                            {customer.company_name ? ` - ${customer.company_name}` : ''}
                                        </option>
                                    ))}
                                </select>

                                {errors.customer_id && (
                                    <p className="mt-2 text-sm text-red-600">{errors.customer_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    تاريخ العرض <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.quotation_date}
                                    onChange={(e) => setData('quotation_date', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.quotation_date && (
                                    <p className="mt-2 text-sm text-red-600">{errors.quotation_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    الحالة <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="أدخل أي ملاحظات إضافية"
                                />
                                {errors.notes && (
                                    <p className="mt-2 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">بنود عرض السعر</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    أضف البنود والخدمات والأسعار والضريبة لكل بند.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                إضافة بند
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                                >
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-base font-bold text-slate-700">
                                            البند #{index + 1}
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                                        >
                                            حذف
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                اسم البند <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.item_name}
                                                onChange={(e) =>
                                                    updateItem(index, 'item_name', e.target.value)
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                placeholder="مثال: تصميم موقع"
                                            />
                                            {errors[`items.${index}.item_name`] && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors[`items.${index}.item_name`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                الوصف
                                            </label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(index, 'description', e.target.value)
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                placeholder="وصف مختصر للبند"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                الكمية <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(index, 'quantity', e.target.value)
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                            {errors[`items.${index}.quantity`] && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors[`items.${index}.quantity`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                سعر الوحدة <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.unit_price}
                                                onChange={(e) =>
                                                    updateItem(index, 'unit_price', e.target.value)
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                            {errors[`items.${index}.unit_price`] && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors[`items.${index}.unit_price`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                نسبة الضريبة % <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.tax_percent}
                                                onChange={(e) =>
                                                    updateItem(index, 'tax_percent', e.target.value)
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                            {errors[`items.${index}.tax_percent`] && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors[`items.${index}.tax_percent`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                            <p className="text-sm text-slate-500">الإجمالي قبل الضريبة</p>
                                            <p className="mt-2 text-lg font-bold text-slate-800">
                                                {calcLineSubtotal(item).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                            <p className="text-sm text-slate-500">قيمة الضريبة</p>
                                            <p className="mt-2 text-lg font-bold text-slate-800">
                                                {calcLineTax(item).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                            <p className="text-sm text-slate-500">الإجمالي النهائي</p>
                                            <p className="mt-2 text-lg font-bold text-blue-700">
                                                {calcLineTotal(item).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.items && (
                            <p className="mt-4 text-sm text-red-600">{errors.items}</p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-6 text-lg font-bold text-slate-800">ملخص الأسعار</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                                <p className="text-sm text-slate-500">الإجمالي قبل الضريبة</p>
                                <p className="mt-2 text-2xl font-bold text-slate-800">
                                    {subtotal.toFixed(2)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                                <p className="text-sm text-slate-500">إجمالي الضريبة</p>
                                <p className="mt-2 text-2xl font-bold text-slate-800">
                                    {taxAmount.toFixed(2)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
                                <p className="text-sm text-blue-600">الإجمالي النهائي</p>
                                <p className="mt-2 text-2xl font-bold text-blue-700">
                                    {total.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'جاري الحفظ...' : submitLabel}
                            </button>

                            <a
                                href={cancelHref}
                                className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                إلغاء
                            </a>
                        </div>
                    </div>
                </form>
            </div>

            {showCustomerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold text-slate-800 sm:text-xl">إضافة عميل جديد</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCustomerModal(false);
                                    resetCustomerForm();
                                }}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">الاسم</label>
                                <input
                                    type="text"
                                    value={customerForm.name}
                                    onChange={(e) =>
                                        setCustomerForm({ ...customerForm, name: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                {customerErrors.name && (
                                    <p className="mt-2 text-sm text-red-600">{customerErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">اسم الشركة</label>
                                <input
                                    type="text"
                                    value={customerForm.company_name}
                                    onChange={(e) =>
                                        setCustomerForm({
                                            ...customerForm,
                                            company_name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={customerForm.email}
                                    onChange={(e) =>
                                        setCustomerForm({ ...customerForm, email: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                {customerErrors.email && (
                                    <p className="mt-2 text-sm text-red-600">{customerErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">رقم الجوال</label>
                                <input
                                    type="text"
                                    value={customerForm.phone}
                                    onChange={(e) =>
                                        setCustomerForm({ ...customerForm, phone: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">الرقم الضريبي</label>
                                <input
                                    type="text"
                                    value={customerForm.tax_number}
                                    onChange={(e) =>
                                        setCustomerForm({
                                            ...customerForm,
                                            tax_number: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">العنوان</label>
                                <textarea
                                    rows={3}
                                    value={customerForm.address}
                                    onChange={(e) =>
                                        setCustomerForm({ ...customerForm, address: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleQuickCustomerCreate}
                                disabled={customerProcessing}
                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {customerProcessing ? 'جاري الحفظ...' : 'حفظ العميل'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowCustomerModal(false);
                                    resetCustomerForm();
                                }}
                                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}