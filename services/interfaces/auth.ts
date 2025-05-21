export type AuthUser = {
    id: string;
    name?: string | null;
    email?: string | null;
    role: 'admin' | 'user';
    image?: string | null;
    accessToken?: string;
 };