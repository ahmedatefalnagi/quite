import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface QuotationItem {
    id: number;
    item_name: string;
    description: string | null;
    quantity: string;
    unit_price: string;
    tax_percent: string;
    line_subtotal: string;
    line_tax: string;
    line_total: string;
}

interface Quotation {
    id: number;
    quotation_no: string;
    quotation_date: string;
    status: string;
    subtotal: string;
    tax_amount: string;
    total: string;
    notes: string | null;
    customer: {
        id: number;
        name: string;
        company_name: string | null;
        email: string | null;
        phone: string | null;
        tax_number: string | null;
        address: string | null;
    };
    items: QuotationItem[];
    creator?: {
        id: number;
        name: string;
        email: string;
    };
    invoice?: {
        id: number;
        invoice_no: string;
    } | null;
}

interface ShowQuotationPageProps extends AppPageProps {
    quotation: Quotation;
}

const statusLabels: Record<string, string> = {
    draft: 'مسودة',
    sent: 'مرسل',
    approved: 'معتمد',
    rejected: 'مرفوض',
};

const statusClasses: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

function InfoCard({
    label,
    value,
}: {
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
                {value && String(value).trim() !== '' ? value : '-'}
            </p>
        </div>
    );
}

export default function Show() {
    const { auth, quotation } = usePage<ShowQuotationPageProps>().props;

    const handleConvertToInvoice = () => {
        const confirmed = window.confirm('هل تريد تحويل عرض السعر هذا إلى فاتورة؟');
        if (!confirmed) return;

        router.post(`/quotations/${quotation.id}/convert-to-invoice`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="تفاصيل عرض السعر">
            <Head title={`عرض السعر ${quotation.quotation_no}`} />

            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                                    {quotation.quotation_no}
                                </h1>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        statusClasses[quotation.status] ?? 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {statusLabels[quotation.status] ?? quotation.status}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                تاريخ العرض: {quotation.quotation_date}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <a
                                href={`/quotations/${quotation.id}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 sm:px-5"
                            >
                                تحميل PDF
                            </a>

                            {!quotation.invoice ? (
                                <button
                                    type="button"
                                    onClick={handleConvertToInvoice}
                                    className="rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 sm:px-5"
                                >
                                    تحويل إلى فاتورة
                                </button>
                            ) : (
                                <Link
                                    href={`/invoices/${quotation.invoice.id}`}
                                    className="rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-green-700 sm:px-5"
                                >
                                    عرض الفاتورة المرتبطة
                                </Link>
                            )}

                            <Link
                                href={`/quotations/${quotation.id}/edit`}
                                className="rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-medium text-white hover:bg-amber-600 sm:px-5"
                            >
                                تعديل العرض
                            </Link>

                            <Link
                                href="/quotations"
                                className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 sm:px-5"
                            >
                                رجوع
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-bold text-slate-800">بيانات العميل</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard label="اسم العميل" value={quotation.customer?.name} />
                            <InfoCard label="اسم الشركة" value={quotation.customer?.company_name} />
                            <InfoCard label="البريد الإلكتروني" value={quotation.customer?.email} />
                            <InfoCard label="رقم الجوال" value={quotation.customer?.phone} />
                            <InfoCard label="الرقم الضريبي" value={quotation.customer?.tax_number} />
                            <InfoCard label="العنوان" value={quotation.customer?.address} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-bold text-slate-800">ملخص العرض</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard label="رقم العرض" value={quotation.quotation_no} />
                            <InfoCard label="تاريخ العرض" value={quotation.quotation_date} />
                            <InfoCard label="منشئ العرض" value={quotation.creator?.name} />
                            <InfoCard label="الحالة" value={statusLabels[quotation.status] ?? quotation.status} />
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">ملاحظات</p>
                            <p className="mt-2 text-sm text-slate-800">
                                {quotation.notes && quotation.notes.trim() !== '' ? quotation.notes : 'لا توجد ملاحظات'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-800">بنود عرض السعر</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-right">
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">البند</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الكمية</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">سعر الوحدة</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الضريبة %</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">قبل الضريبة</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الضريبة</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الإجمالي</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {quotation.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                                            <div className="text-sm font-medium text-slate-800">
                                                {item.item_name}
                                            </div>
                                            {item.description && (
                                                <div className="mt-1 text-xs text-slate-400">
                                                    {item.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">{item.quantity}</td>
                                        <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">{item.unit_price}</td>
                                        <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">{item.tax_percent}</td>
                                        <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">{item.line_subtotal}</td>
                                        <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">{item.line_tax}</td>
                                        <td className="px-3 py-3 text-sm font-semibold text-slate-800 sm:px-6 sm:py-4">{item.line_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <p className="text-sm text-slate-500">الإجمالي قبل الضريبة</p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">{quotation.subtotal}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <p className="text-sm text-slate-500">إجمالي الضريبة</p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">{quotation.tax_amount}</p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm sm:p-5">
                        <p className="text-sm text-blue-600">الإجمالي النهائي</p>
                        <p className="mt-2 text-2xl font-bold text-blue-700">{quotation.total}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}