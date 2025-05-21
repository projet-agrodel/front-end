import { getSession } from 'next-auth/react';

export const getAuthTokenForAdmin = async (): Promise<string | null> => {
    if (typeof window !== 'undefined') {
        try {
            const session = await getSession();
            if (session?.accessToken) {
                return session.accessToken as string;
            }
        } catch (error) {
            console.error('Erro ao obter token de autenticação:', error);
        }
    }
    return null;
}; 