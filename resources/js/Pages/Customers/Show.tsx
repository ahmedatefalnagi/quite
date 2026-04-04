import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    tax_number: string | null;
    address: string | null;
}

interface ShowPageProps extends AppPageProps {
    customer: Customer;
}

function InfoCard({
    label,
    value,
}: {
    label: string;
    value: string | null;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
                {value && value.trim() !== '' ? value : '-'}
            </p>
        </div>
    );
}

export default function Show() {
    const { auth, customer } = usePage<ShowPageProps>().props;

    return (
        <AuthenticatedLayout user={auth.user} header="تفاصيل العميل">
            <Head title="تفاصيل العميل" />

            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                {customer.name}
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                عرض جميع بيانات العميل المسجلة داخل النظام.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/customers/${customer.id}/edit`}
                                className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-medium text-white hover:bg-amber-600"
                            >
                                تعديل البيانات
                            </Link>

                            <Link
                                href="/customers"
                                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                رجوع
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard label="اسم العميل" value={customer.name} />
                    <InfoCard label="اسم الشركة" value={customer.company_name} />
                    <InfoCard label="البريد الإلكتروني" value={customer.email} />
                    <InfoCard label="رقم الجوال" value={customer.phone} />
                    <InfoCard label="الرقم الضريبي" value={customer.tax_number} />
                    <InfoCard label="العنوان" value={customer.address} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}