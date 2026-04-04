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

interface CreateQuotationPageProps extends AppPageProps {
    customers: CustomerOption[];
    statuses: StatusOption[];
}

export default function Create() {
    const { auth, customers, statuses } = usePage<CreateQuotationPageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        quotation_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        notes: '',
        items: [
            {
                item_name: '',
                description: '',
                quantity: 1,
                unit_price: 0,
                tax_percent: 15,
            },
        ],
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/quotations');
    };

    return (
        <AuthenticatedLayout user={auth.user} header="إنشاء عرض سعر">
            <Head title="إنشاء عرض سعر" />

            <QuotationForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                customers={customers}
                statuses={statuses}
                title="إنشاء عرض سعر جديد"
                description="أدخل بيانات عرض السعر وأضف البنود المطلوبة، وسيتم حساب الإجماليات تلقائيًا."
                submitLabel="حفظ عرض السعر"
                onSubmit={submit}
                cancelHref="/quotations"
            />
        </AuthenticatedLayout>
    );
}