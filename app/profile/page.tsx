'use client';

import { useState, useEffect } from 'react';
import { User, Tab } from '../_components/profile/types';
import { ProfileHeader } from '../_components/profile/ProfileHeader';
import { TabNavigation } from '../_components/profile/TabNavigation';
import { PersonalInfo } from '../_components/profile/tabs/PersonalInfo';
import { Cards } from '../_components/profile/tabs/Cards';
import { Comments } from '../_components/profile/tabs/Comments';
import { ChangePasswordTab } from '../_components/profile/tabs/ChangePasswordTab';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetchUserData = async (token: string | null | undefined): Promise<User | null> => {
  if (!token) {
    console.log("fetchUserData: Nenhum token fornecido.");
    return null;
  }
  try {
    console.log("fetchUserData: Buscando dados com token:", token);
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 404) {
      console.warn(`fetchUserData: Falha na autorização ou rota não encontrada (${response.status}).`);
      return null; 
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar dados do usuário.' }));
      console.error('fetchUserData: Erro HTTP:', response.status, errorData.message);
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }
    
    const userData = await response.json();
    console.log("fetchUserData: Dados recebidos:", userData);
    return {
      ...userData,
      avatar: userData.avatar || 'https://w7.pngwing.com/pngs/223/244/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-rectangle-black.png',
      cards: userData.cards || [],
      comments: userData.comments || [],
    };

  } catch (error) {
    console.error('fetchUserData: Exceção ao buscar dados:', error);
    return null; 
  }
};

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userData, setUserData] = useState<User | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (status === 'loading') {
      setIsProfileLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session) {
      const accessToken = session.accessToken;

      if (!accessToken) {
        console.error("ProfilePage: Token de acesso não encontrado na sessão.");
        router.push('/auth/login');
        return;
      }
      
      const getUserProfileData = async () => {
        setIsProfileLoading(true);
        try {
          const data = await fetchUserData(accessToken as string);
          if (data) {
            setUserData(data);
          } else {
            console.warn("ProfilePage: Não foi possível obter dados do usuário, redirecionando para login.");
          }
        } catch (error) {
          console.error('ProfilePage: Erro ao buscar dados do usuário na página:', error);
        } finally {
          setIsProfileLoading(false);
        }
      };
      
      getUserProfileData();
    }
  }, [status, session, router]);

  const handleUpdateUser = (updatedUser: User) => {
    setUserData(updatedUser);
    // Aqui você faria a chamada à API para atualizar os dados
  };

  if (status === 'loading' || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData && status === 'authenticated') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro ao carregar seus dados de perfil. Sua sessão pode ser inválida ou houve um problema de comunicação.
        </div>
        <button 
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Tentar Login Novamente
        </button>
      </div>
    );
  }
  
  if (!userData) {
    console.warn("ProfilePage: Renderizando sem userData, apesar de autenticado e profile não estar carregando. Verifique fetchUserData e o token.");
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Não foi possível carregar os detalhes do seu perfil no momento.
            </div>
            <button 
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar Novamente
            </button>
        </div>
    );
  }

  const tabs: Tab[] = [
    {
      id: 'info',
      label: 'Informações Pessoais',
      component: <PersonalInfo user={userData} onUpdate={handleUpdateUser} />
    },
    {
      id: 'cards',
      label: 'Cartões',
      component: <Cards cards={userData.cards || []} onUpdate={handleUpdateUser} />
    },
    {
      id: 'comments',
      label: 'Avaliações',
      component: <Comments comments={userData.comments || []} onUpdate={handleUpdateUser} />
    },
    {
      id: 'security',
      label: 'Alterar Senha',
      component: <ChangePasswordTab accessToken={session?.accessToken} />
    }
  ];

  return (
    <div 
      className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in-up opacity-0"
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="bg-white rounded-lg shadow-lg">
        <ProfileHeader user={userData} />
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <div className="p-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 