import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    tax_number: string | null;
    address: string | null;
}

interface CustomersPagination {
    data: Customer[];
}

interface CustomersPageProps extends AppPageProps {
    customers: CustomersPagination;
}

export default function Index() {
    const { auth, flash, customers } = usePage<CustomersPageProps>().props;

    const handleDelete = (customerId: number, customerName: string) => {
        const confirmed = window.confirm(`هل أنت متأكد من حذف العميل "${customerName}"؟`);

        if (!confirmed) return;

        router.delete(`/customers/${customerId}`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="العملاء">
            <Head title="العملاء" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">إدارة العملاء</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            يمكنك إضافة العملاء وتعديل بياناتهم ومراجعة التفاصيل بسهولة.
                        </p>
                    </div>

                    <Link
                        href="/customers/create"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 sm:px-5"
                    >
                        إضافة عميل
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
                    <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-800">قائمة العملاء</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-right">
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الاسم</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الشركة</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">البريد</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الجوال</th>
                                    <th className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-6 sm:py-4">الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-50">
                                            <td className="px-3 py-3 text-sm font-medium text-slate-800 sm:px-6 sm:py-4">
                                                {customer.name}
                                            </td>
                                            <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">
                                                {customer.company_name ?? '-'}
                                            </td>
                                            <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">
                                                {customer.email ?? '-'}
                                            </td>
                                            <td className="px-3 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">
                                                {customer.phone ?? '-'}
                                            </td>
                                            <td className="px-3 py-3 sm:px-6 sm:py-4">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                                    <Link
                                                        href={`/customers/${customer.id}`}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        عرض
                                                    </Link>

                                                    <Link
                                                        href={`/customers/${customer.id}/edit`}
                                                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-700 hover:bg-amber-100"
                                                    >
                                                        تعديل
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(customer.id, customer.name)}
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
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                                            لا يوجد عملاء حاليًا
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