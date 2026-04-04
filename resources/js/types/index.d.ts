export interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export interface FlashMessages {
    success?: string;
    error?: string;
}

export interface AppPageProps {
    auth: {
        user: AuthUser;
    };
    flash: FlashMessages;
    [key: string]: unknown;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> =
    AppPageProps & T;