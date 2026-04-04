import type { FormEvent } from 'react';

interface CustomerFormData {
    name: string;
    company_name: string;
    email: string;
    phone: string;
    tax_number: string;
    address: string;
}

interface CustomerFormErrors {
    name?: string;
    company_name?: string;
    email?: string;
    phone?: string;
    tax_number?: string;
    address?: string;
}

interface CustomerFormProps {
    data: CustomerFormData;
    setData: (key: keyof CustomerFormData, value: string) => void;
    errors: CustomerFormErrors;
    processing: boolean;
    title: string;
    description: string;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    cancelHref: string;
}

export default function CustomerForm({
    data,
    setData,
    errors,
    processing,
    title,
    description,
    submitLabel,
    onSubmit,
    cancelHref,
}: CustomerFormProps) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            الاسم <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="أدخل اسم العميل"
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            اسم الشركة
                        </label>
                        <input
                            type="text"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="أدخل اسم الشركة"
                        />
                        {errors.company_name && (
                            <p className="mt-2 text-sm text-red-600">{errors.company_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="example@email.com"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            رقم الجوال
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="05xxxxxxxx"
                        />
                        {errors.phone && (
                            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            الرقم الضريبي
                        </label>
                        <input
                            type="text"
                            value={data.tax_number}
                            onChange={(e) => setData('tax_number', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="أدخل الرقم الضريبي"
                        />
                        {errors.tax_number && (
                            <p className="mt-2 text-sm text-red-600">{errors.tax_number}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            العنوان
                        </label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={5}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="أدخل عنوان العميل"
                        />
                        {errors.address && (
                            <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'جاري الحفظ...' : submitLabel}
                    </button>

                    <a
                        href={cancelHref}
                        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        إلغاء
                    </a>
                </div>
            </form>
        </div>
    );
}