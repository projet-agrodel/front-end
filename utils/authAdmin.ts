export const getAuthTokenForAdmin = (): string | null => {
    if (typeof window !== 'undefined') {

        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0Nzc4ODQzNSwianRpIjoiNDAwNzM1M2YtNTI0OS00OTQ4LTlhMWYtNTAxNTc5NTc0YTNjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NDc3ODg0MzUsImNzcmYiOiI3Mjg0YzBjNi01YmI4LTQ0OTgtOWZmYy01MmNiM2NkZWMzYzIiLCJleHAiOjE3NDc3OTIwMzUsImlzX2FkbWluaXN0cmF0b3IiOnRydWV9.idPNeQqkSmRi-MYxxKyyyuPfwyEsPp2c1AM9q8ksXJM'; 
    }
    return null;
}; 