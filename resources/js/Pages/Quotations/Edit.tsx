import QuotationForm from '@/Components/Quotations/QuotationForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
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

interface QuotationItem {
    item_name: string;
    description: string | null;
    quantity: string | number;
    unit_price: string | number;
    tax_percent: string | number;
}

interface Quotation {
    id: number;
    customer_id: number;
    quotation_date: string;
    status: string;
    notes: string | null;
    items: QuotationItem[];
}

interface EditQuotationPageProps extends AppPageProps {
    quotation: Quotation;
    customers: CustomerOption[];
    statuses: StatusOption[];
}

export default function Edit() {
    const { auth, quotation, customers, statuses } = usePage<EditQuotationPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        customer_id: String(quotation.customer_id),
        quotation_date: quotation.quotation_date,
        status: quotation.status,
        notes: quotation.notes ?? '',
        items: quotation.items.map((item) => ({
            item_name: item.item_name ?? '',
            description: item.description ?? '',
            quantity: item.quantity ?? 1,
            unit_price: item.unit_price ?? 0,
            tax_percent: item.tax_percent ?? 15,
        })),
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/quotations/${quotation.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="تعديل عرض السعر">
            <Head title="تعديل عرض السعر" />

            <QuotationForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                customers={customers}
                statuses={statuses}
                title="تعديل عرض السعر"
                description="يمكنك تحديث بيانات العرض والبنود وسيتم إعادة حساب الإجماليات تلقائيًا."
                submitLabel="حفظ التعديلات"
                onSubmit={submit}
                cancelHref="/quotations"
            />
        </AuthenticatedLayout>
    );
}