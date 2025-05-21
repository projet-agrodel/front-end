import 'next-auth';
import 'next-auth/jwt';

declare module "next-auth" {
   interface Session {
      accessToken?: string;
      user: {
         id: string;
         name: string;
         email: string;
         role: string;
         image?: string;
      };
   }
   // A interface User é estendida implicitamente pelo provider e pelos callbacks
   // Se AuthUser for a forma final do seu objeto user, não precisa redeclará-la aqui
   // contanto que os callbacks a construam corretamente.
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    // id (sub), name, email são campos mais ou menos padrão ou podem ser adicionados
    // se você os colocar no token no callback jwt.
  }
}
