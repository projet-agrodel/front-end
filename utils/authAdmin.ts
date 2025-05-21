export const getAuthTokenForAdmin = (): string | null => {
    if (typeof window !== 'undefined') {

        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0Nzc5MTY3NCwianRpIjoiNjhmZjgyNjEtY2FiMS00YTIyLTg0MjAtODU1ZDVmZDBiMmZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NDc3OTE2NzQsImNzcmYiOiI1YWUxMGJkOS01ODJiLTQ1NjItYjY2MC0zNTk4NmE2NDVmZjAiLCJleHAiOjE3NDc3OTUyNzQsImlzX2FkbWluaXN0cmF0b3IiOnRydWV9.EyivLJA8z8GfdoBA4V4r18BATk9WFrm2yUAf3ardL8s'; 
    }
    return null;
}; 