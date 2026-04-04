import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface Invoice {
    id: number;
    invoice_no: string;
    invoice_date: string;
    type: string;
    status: string;
    total: string;
    customer: {
        id: number;
        name: string;
        company_name: string | null;
    };
}

interface InvoicesPagination {
    data: Invoice[];
}

interface InvoicesPageProps extends AppPageProps {
    invoices: InvoicesPagination;
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

export default function Index() {
    const { auth, flash, invoices } = usePage<InvoicesPageProps>().props;

    const handleDelete = (invoiceId: number, invoiceNo: string) => {
        const confirmed = window.confirm(`هل أنت متأكد من حذف الفاتورة "${invoiceNo}"؟`);
        if (!confirmed) return;

        router.delete(`/invoices/${invoiceId}`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="الفواتير">
            <Head title="الفواتير" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">إدارة الفواتير</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أنشئ الفواتير واعرضها وعدّلها مع دعم QR داخل صفحة الفاتورة.
                        </p>
                    </div>

                    <Link
                        href="/invoices/create"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        إنشاء فاتورة
                    </Link>
                </div>

                {flash.success && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h2 className="text-lg font-bold text-slate-800">قائمة الفواتير</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-right">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">رقم الفاتورة</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">العميل</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">التاريخ</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">النوع</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">الحالة</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">الإجمالي</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {invoices.data.length > 0 ? (
                                    invoices.data.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                {invoice.invoice_no}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div>{invoice.customer?.name ?? '-'}</div>
                                                {invoice.customer?.company_name && (
                                                    <div className="mt-1 text-xs text-slate-400">
                                                        {invoice.customer.company_name}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">{invoice.invoice_date}</td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {typeLabels[invoice.type] ?? invoice.type}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        statusClasses[invoice.status] ?? 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {statusLabels[invoice.status] ?? invoice.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                                {invoice.total}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Link
                                                        href={`/invoices/${invoice.id}`}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        عرض
                                                    </Link>

                                                    <Link
                                                        href={`/invoices/${invoice.id}/edit`}
                                                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 hover:bg-amber-100"
                                                    >
                                                        تعديل
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(invoice.id, invoice.invoice_no)}
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                                            لا توجد فواتير حاليًا
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}