import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import type { AppPageProps } from '@/types';

interface DashboardPageProps extends AppPageProps {
    stats: {
        customers_count: number;
        quotations_count: number;
        invoices_count: number;
    };
    latest_customers: any[];
    latest_quotations: any[];
    latest_invoices: any[];
    [key: string]: unknown;
}

export default function Dashboard() {
    const { auth, stats, latest_customers, latest_quotations, latest_invoices } =
        usePage<DashboardPageProps>().props;

    return (
        <AuthenticatedLayout user={auth.user} header="لوحة التحكم">
            <Head title="لوحة التحكم" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm text-gray-500">العملاء</h3>
                    <p className="text-2xl font-bold">{stats.customers_count}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm text-gray-500">عروض الأسعار</h3>
                    <p className="text-2xl font-bold">{stats.quotations_count}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm text-gray-500">الفواتير</h3>
                    <p className="text-2xl font-bold">{stats.invoices_count}</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <h3 className="font-bold mb-3">آخر العملاء</h3>

                {latest_customers.map((c) => (
                    <div key={c.id} className="border-b py-2">
                        {c.name}
                    </div>
                ))}
            </div>

            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <h3 className="font-bold mb-3">آخر عروض الأسعار</h3>

                {latest_quotations.map((q) => (
                    <div key={q.id} className="border-b py-2">
                        {q.quotation_no} - {q.total}
                    </div>
                ))}
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-bold mb-3">آخر الفواتير</h3>

                {latest_invoices.map((i) => (
                    <div key={i.id} className="border-b py-2">
                        {i.invoice_no} - {i.total}
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}