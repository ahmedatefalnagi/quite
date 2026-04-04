import CustomerForm from '@/Components/Customers/CustomerForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { AppPageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Create() {
    const { auth } = usePage<AppPageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        tax_number: '',
        address: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/customers');
    };

    return (
        <AuthenticatedLayout user={auth.user} header="إضافة عميل">
            <Head title="إضافة عميل" />

            <CustomerForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                title="إضافة عميل جديد"
                description="أدخل بيانات العميل الأساسية لحفظه داخل النظام واستخدامه لاحقًا في عروض الأسعار والفواتير."
                submitLabel="حفظ العميل"
                onSubmit={submit}
                cancelHref="/customers"
            />
        </AuthenticatedLayout>
    );
}