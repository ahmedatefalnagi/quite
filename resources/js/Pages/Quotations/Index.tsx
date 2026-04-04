import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface Quotation {
    id: number;
    quotation_no: string;
    quotation_date: string;
    status: string;
    subtotal: string;
    tax_amount: string;
    total: string;
    customer: {
        id: number;
        name: string;
        company_name: string | null;
    };
}

interface QuotationsPagination {
    data: Quotation[];
}

interface QuotationsPageProps extends AppPageProps {
    quotations: QuotationsPagination;
}

const statusClasses: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    draft: 'مسودة',
    sent: 'مرسل',
    approved: 'معتمد',
    rejected: 'مرفوض',
};

export default function Index() {
    const { auth, flash, quotations } = usePage<QuotationsPageProps>().props;

    const handleDelete = (quotationId: number, quotationNo: string) => {
        const confirmed = window.confirm(`هل أنت متأكد من حذف عرض السعر "${quotationNo}"؟`);
        if (!confirmed) return;

        router.delete(`/quotations/${quotationId}`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="عروض الأسعار">
            <Head title="عروض الأسعار" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">إدارة عروض الأسعار</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أنشئ عروض الأسعار وتابع حالتها واعرض تفاصيلها بسهولة.
                        </p>
                    </div>

                    <Link
                        href="/quotations/create"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        إنشاء عرض سعر
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
                        <h2 className="text-lg font-bold text-slate-800">قائمة عروض الأسعار</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-right">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">رقم العرض</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">العميل</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">التاريخ</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">الحالة</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">الإجمالي</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {quotations.data.length > 0 ? (
                                    quotations.data.map((quotation) => (
                                        <tr key={quotation.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                {quotation.quotation_no}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div>{quotation.customer?.name ?? '-'}</div>
                                                {quotation.customer?.company_name && (
                                                    <div className="mt-1 text-xs text-slate-400">
                                                        {quotation.customer.company_name}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {quotation.quotation_date}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        statusClasses[quotation.status] ?? 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {statusLabels[quotation.status] ?? quotation.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                                {quotation.total}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Link
                                                        href={`/quotations/${quotation.id}`}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        عرض
                                                    </Link>

                                                    <Link
                                                        href={`/quotations/${quotation.id}/edit`}
                                                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 hover:bg-amber-100"
                                                    >
                                                        تعديل
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(quotation.id, quotation.quotation_no)
                                                        }
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
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                                            لا توجد عروض أسعار حاليًا
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