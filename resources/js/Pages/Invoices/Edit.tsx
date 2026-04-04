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

interface InvoiceItem {
    item_name: string;
    description: string | null;
    quantity: string | number;
    unit_price: string | number;
    tax_percent: string | number;
}

interface Invoice {
    id: number;
    customer_id: number;
    quotation_id: number | null;
    invoice_date: string;
    type: string;
    status: string;
    notes: string | null;
    items: InvoiceItem[];
}

interface EditInvoicePageProps extends AppPageProps {
    invoice: Invoice;
    customers: CustomerOption[];
    quotations: QuotationOption[];
    types: TypeOption[];
    statuses: StatusOption[];
}

export default function Edit() {
    const { auth, invoice, customers, quotations, types, statuses } = usePage<EditInvoicePageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        customer_id: String(invoice.customer_id),
        quotation_id: invoice.quotation_id ? String(invoice.quotation_id) : null,
        invoice_date: invoice.invoice_date?.substring(0, 10),
        type: invoice.type,
        status: invoice.status,
        notes: invoice.notes ?? '',
        items: invoice.items.map((item) => ({
            item_name: item.item_name ?? '',
            description: item.description ?? '',
            quantity: item.quantity ?? 1,
            unit_price: item.unit_price ?? 0,
            tax_percent: item.tax_percent ?? 15,
        })),
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/invoices/${invoice.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="تعديل الفاتورة">
            <Head title="تعديل الفاتورة" />

            <InvoiceForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                customers={customers}
                quotations={quotations}
                types={types}
                statuses={statuses}
                title="تعديل الفاتورة"
                description="يمكنك تحديث بيانات الفاتورة والبنود وسيتم إعادة حساب الإجماليات تلقائيًا."
                submitLabel="حفظ التعديلات"
                onSubmit={submit}
                cancelHref="/invoices"
            />
        </AuthenticatedLayout>
    );
}