import InvoiceForm from '@/Components/Invoices/InvoiceForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface CustomerOption {
    id: number;
    name: string;
    company_name: string | null;
}

interface QuotationOption {
    id: number;
    quotation_no: string;
}

interface TypeOption {
    value: string;
    label: string;
}

interface StatusOption {
    value: string;
    label: string;
}

interface CreateInvoicePageProps extends AppPageProps {
    customers: CustomerOption[];
    quotations: QuotationOption[];
    types: TypeOption[];
    statuses: StatusOption[];
}

export default function Create() {
    const { auth, customers, quotations, types, statuses } = usePage<CreateInvoicePageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        quotation_id: null as string | null,
        invoice_date: new Date().toISOString().split('T')[0],
        type: 'tax',
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
        post('/invoices');
    };

    return (
        <AuthenticatedLayout user={auth.user} header="إنشاء فاتورة">
            <Head title="إنشاء فاتورة" />

            <InvoiceForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                customers={customers}
                quotations={quotations}
                types={types}
                statuses={statuses}
                title="إنشاء فاتورة جديدة"
                description="أدخل بيانات الفاتورة وأضف البنود المطلوبة، وسيتم حساب الإجماليات تلقائيًا."
                submitLabel="حفظ الفاتورة"
                onSubmit={submit}
                cancelHref="/invoices"
            />
        </AuthenticatedLayout>
    );
}