export const getAuthTokenForAdmin = (): string | null => {
    if (typeof window !== 'undefined') {

        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0Nzc4MzgwMSwianRpIjoiZDA3MTA3NzgtMzBmMi00MjU3LTk2YzAtNGJhN2U4OGViZmRhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NDc3ODM4MDEsImNzcmYiOiI0Y2IyOGI3Yy1jNzhjLTQ1OGMtOGJiYi1jNmFjZDgxYTU5MmYiLCJleHAiOjE3NDc3ODc0MDEsImlzX2FkbWluaXN0cmF0b3IiOnRydWV9.0HpTGnScb7wfI_NGsFzc0Afp0KrcQKCtN8aZW_zzYQo'; 
    }
    return null;
}; 