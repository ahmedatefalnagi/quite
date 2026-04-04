export default function route(name: string): string {
    const routes: Record<string, string> = {
        login: '/login',
        register: '/register',
        logout: '/logout',
        dashboard: '/dashboard',

        'password.confirm': '/confirm-password',
        'password.email': '/forgot-password',
        'password.store': '/reset-password',
        'password.update': '/password',

        'verification.send': '/email/verification-notification',

        'profile.update': '/profile',
        'profile.destroy': '/profile',
    };

    return routes[name] ?? '/';
}