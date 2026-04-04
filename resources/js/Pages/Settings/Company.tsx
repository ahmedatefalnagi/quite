import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface CompanySetting {
    company_name: string;
    vat_number: string | null;
    commercial_registration: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    iban: string | null;
    country: string | null;
}

interface CompanyPageProps extends AppPageProps {
    settings: CompanySetting | null;
}

export default function Company() {
    const { auth, flash, settings } = usePage<CompanyPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        company_name: settings?.company_name ?? '',
        vat_number: settings?.vat_number ?? '',
        commercial_registration: settings?.commercial_registration ?? '',
        email: settings?.email ?? '',
        phone: settings?.phone ?? '',
        address: settings?.address ?? '',
        city: settings?.city ?? '',
        iban: settings?.iban ?? '',
        country: settings?.country ?? 'المملكة العربية السعودية',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put('/settings/company');
    };

    return (
        <AuthenticatedLayout user={auth.user} header="إعدادات الشركة">
            <Head title="إعدادات الشركة" />

            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-800">إعدادات الشركة</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        أدخل بيانات المنشأة الأساسية لاستخدامها في الفواتير والـ QR.
                    </p>
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

                <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                اسم المنشأة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.company_name && <p className="mt-2 text-sm text-red-600">{errors.company_name}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">الرقم الضريبي</label>
                            <input
                                type="text"
                                value={data.vat_number}
                                onChange={(e) => setData('vat_number', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.vat_number && <p className="mt-2 text-sm text-red-600">{errors.vat_number}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">السجل التجاري</label>
                            <input
                                type="text"
                                value={data.commercial_registration}
                                onChange={(e) => setData('commercial_registration', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.commercial_registration && (
                                <p className="mt-2 text-sm text-red-600">{errors.commercial_registration}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">الهاتف</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">المدينة</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                        </div>

                        <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">الآيبان</label>
                        <input
                            type="text"
                            value={data.iban}
                            onChange={(e) => setData('iban', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.iban && <p className="mt-2 text-sm text-red-600">{errors.iban}</p>}
                    </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">العنوان</label>
                            <textarea
                                rows={4}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">الدولة</label>
                            <input
                                type="text"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country}</p>}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}