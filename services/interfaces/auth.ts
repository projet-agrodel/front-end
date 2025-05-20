export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    image?: string | null;
 };