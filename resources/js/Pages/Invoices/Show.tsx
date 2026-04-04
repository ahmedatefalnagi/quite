import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Company {
    company_name: string;
    vat_number: string | null;
    commercial_registration: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
}

interface InvoiceItem {
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

interface Invoice {
    id: number;
    invoice_no: string;
    invoice_date: string;
    type: string;
    status: string;
    subtotal: string;
    tax_amount: string;
    total: string;
    notes: string | null;
    quotation?: {
        id: number;
        quotation_no: string;
    } | null;
    customer: {
        id: number;
        name: string;
        company_name: string | null;
        email: string | null;
        phone: string | null;
        tax_number: string | null;
        address: string | null;
    };
    items: InvoiceItem[];
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

interface ShowInvoicePageProps extends AppPageProps {
    invoice: Invoice;
    company: Company | null;
    qrCode: string | null;
}

const statusLabels: Record<string, string> = {
    draft: 'مسودة',
    issued: 'مصدرة',
    paid: 'مدفوعة',
    cancelled: 'ملغية',
};

const statusClasses: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    issued: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const typeLabels: Record<string, string> = {
    tax: 'فاتورة ضريبية',
    simplified: 'فاتورة ضريبية مبسطة',
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
    const { auth, invoice, company, qrCode } = usePage<ShowInvoicePageProps>().props;

    return (
        <AuthenticatedLayout user={auth.user} header="عرض الفاتورة">
            <Head title={`الفاتورة ${invoice.invoice_no}`} />

            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                                    {invoice.invoice_no}
                                </h1>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        statusClasses[invoice.status] ?? 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {statusLabels[invoice.status] ?? invoice.status}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                {typeLabels[invoice.type] ?? invoice.type} - بتاريخ {invoice.invoice_date}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:px-5"
                            >
                                طباعة
                            </button>

                            <a
                                href={`/invoices/${invoice.id}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 sm:px-5"
                            >
                                تحميل PDF
                            </a>

                            <Link
                                href={`/invoices/${invoice.id}/edit`}
                                className="rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-medium text-white hover:bg-amber-600 sm:px-5"
                            >
                                تعديل الفاتورة
                            </Link>

                            <Link
                                href="/invoices"
                                className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 sm:px-5"
                            >
                                رجوع
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
                        <h2 className="mb-4 text-lg font-bold text-slate-800">بيانات المنشأة</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard label="اسم المنشأة" value={company?.company_name} />
                            <InfoCard label="الرقم الضريبي" value={company?.vat_number} />
                            <InfoCard label="السجل التجاري" value={company?.commercial_registration} />
                            <InfoCard label="البريد الإلكتروني" value={company?.email} />
                            <InfoCard label="الهاتف" value={company?.phone} />
                            <InfoCard
                                label="العنوان"
                                value={[company?.address, company?.city, company?.country].filter(Boolean).join(' - ')}
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-bold text-slate-800">QR الزكاة</h2>

                        {qrCode ? (
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCode)}`}
                                        alt="ZATCA QR Code"
                                        className="mx-auto w-full max-w-[220px]"
                                    />
                                </div>

                                <p className="text-xs leading-6 text-slate-500">
                                    تم توليد QR اعتمادًا على بيانات المنشأة والفاتورة الحالية.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                يرجى استكمال اسم المنشأة والرقم الضريبي من إعدادات الشركة لعرض QR.
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-bold text-slate-800">بيانات العميل</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard label="اسم العميل" value={invoice.customer?.name} />
                            <InfoCard label="اسم الشركة" value={invoice.customer?.company_name} />
                            <InfoCard label="البريد الإلكتروني" value={invoice.customer?.email} />
                            <InfoCard label="رقم الجوال" value={invoice.customer?.phone} />
                            <InfoCard label="الرقم الضريبي" value={invoice.customer?.tax_number} />
                            <InfoCard label="العنوان" value={invoice.customer?.address} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-bold text-slate-800">ملخص الفاتورة</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard label="رقم الفاتورة" value={invoice.invoice_no} />
                            <InfoCard label="تاريخ الفاتورة" value={invoice.invoice_date} />
                            <InfoCard label="نوع الفاتورة" value={typeLabels[invoice.type] ?? invoice.type} />
                            <InfoCard label="الحالة" value={statusLabels[invoice.status] ?? invoice.status} />
                            <InfoCard label="عرض السعر" value={invoice.quotation?.quotation_no} />
                            <InfoCard label="منشئ الفاتورة" value={invoice.creator?.name} />
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">الملاحظات</p>
                            <p className="mt-2 text-sm text-slate-800">
                                {invoice.notes && invoice.notes.trim() !== '' ? invoice.notes : 'لا توجد ملاحظات'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-800">بنود الفاتورة</h2>
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
                                {invoice.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                                            <div className="text-sm font-medium text-slate-800">{item.item_name}</div>
                                            {item.description && (
                                                <div className="mt-1 text-xs text-slate-400">{item.description}</div>
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
                        <p className="mt-2 text-2xl font-bold text-slate-800">{invoice.subtotal}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <p className="text-sm text-slate-500">إجمالي الضريبة</p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">{invoice.tax_amount}</p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm sm:p-5">
                        <p className="text-sm text-blue-600">الإجمالي النهائي</p>
                        <p className="mt-2 text-2xl font-bold text-blue-700">{invoice.total}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}