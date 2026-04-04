import CustomerForm from '@/Components/Customers/CustomerForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Customer {
    id: number;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    tax_number: string | null;
    address: string | null;
}

interface EditPageProps extends AppPageProps {
    customer: Customer;
}

export default function Edit() {
    const { auth, customer } = usePage<EditPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: customer.name ?? '',
        company_name: customer.company_name ?? '',
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        tax_number: customer.tax_number ?? '',
        address: customer.address ?? '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/customers/${customer.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="تعديل العميل">
            <Head title="تعديل العميل" />

            <CustomerForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                title="تعديل بيانات العميل"
                description="يمكنك تحديث بيانات العميل الحالية، وسيتم حفظ التعديلات مباشرة داخل النظام."
                submitLabel="حفظ التعديلات"
                onSubmit={submit}
                cancelHref="/customers"
            />
        </AuthenticatedLayout>
    );
}