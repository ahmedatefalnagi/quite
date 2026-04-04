import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface AuthenticatedLayoutProps {
    user?: {
        name?: string;
        email?: string;
    };
    header?: ReactNode;
}

export default function AuthenticatedLayout({
    user,
    header,
    children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const userName = user?.name ?? 'المستخدم';
    const userEmail = user?.email ?? '';

    const navItems = [
        { name: 'لوحة التحكم', href: '/dashboard', active: window.location.pathname === '/dashboard' },
        { name: 'العملاء', href: '/customers', active: window.location.pathname.startsWith('/customers') },
        { name: 'عروض الأسعار', href: '/quotations', active: window.location.pathname.startsWith('/quotations') },
        { name: 'الفواتير', href: '/invoices', active: window.location.pathname.startsWith('/invoices') },
        { name: 'إعدادات الشركة', href: '/settings/company', active: window.location.pathname.startsWith('/settings/company') },
    ];

    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 right-0 z-40 w-72 transform border-l border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } lg:static lg:block`}
                >
                    <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-slate-800">
                                نظام عروض الأسعار
                            </h1>
                            <p className="text-sm text-slate-500">لوحة الإدارة</p>
                        </div>

                        <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="px-4 py-6">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        item.active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
                        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    ☰
                                </button>

                                <div className="min-w-0">
                                    <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                                        {header ?? 'لوحة التحكم'}
                                    </h2>
                                    <p className="hidden text-sm text-slate-500 sm:block">
                                        إدارة النظام بشكل احترافي وسهل
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden text-left sm:block">
                                    <p className="text-sm font-semibold text-slate-700">{userName}</p>
                                    <p className="max-w-[180px] truncate text-xs text-slate-500">
                                        {userEmail}
                                    </p>
                                </div>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
                                        >
                                            {userName.charAt(0)}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href="/profile">الملف الشخصي</Dropdown.Link>
                                        <Dropdown.Link href="/logout" method="post" as="button">
                                            تسجيل الخروج
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-3 py-6 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}