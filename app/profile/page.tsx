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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetchUserData = async (token: string | null): Promise<User | null> => {
  if (!token) {
    // Não há token, não precisa nem tentar buscar
    return null;
  }
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 404) { // Não autorizado ou não encontrado
      localStorage.removeItem('token'); // Limpar token inválido
      return null; // Indica que o usuário deve ser redirecionado
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar dados do usuário.' }));
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }
    
    const userData = await response.json();
    // Simular dados que podem não vir do backend ou precisam de tratamento
    return {
      ...userData,
      avatar: userData.avatar || 'https://w7.pngwing.com/pngs/223/244/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-rectangle-black.png', // Placeholder se não houver avatar
      cards: userData.cards || [],
      comments: userData.comments || [],
    };

  } catch (error) {
    console.error('Falha ao buscar dados do usuário:', error);
    localStorage.removeItem('token'); // Limpar token em caso de erro na requisição
    return null; // Indica que o usuário deve ser redirecionado
  }
};

const ProfilePage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const getUserData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserData(token);
        if (data) {
          setUserData(data);
        } else {
          localStorage.removeItem('token');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário na página:', error);
        localStorage.removeItem('token');
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserData();
  }, [router]);

  const handleUpdateUser = (updatedUser: User) => {
    setUserData(updatedUser);
    // Aqui você faria a chamada à API para atualizar os dados
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro ao carregar dados do usuário. Por favor, tente novamente mais tarde.
        </div>
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
      component: <Cards cards={userData.cards} onUpdate={handleUpdateUser} />
    },
    {
      id: 'comments',
      label: 'Avaliações',
      component: <Comments comments={userData.comments} onUpdate={handleUpdateUser} />
    },
    {
      id: 'security',
      label: 'Alterar Senha',
      component: <ChangePasswordTab />
    }
  ];

  return (
    <div 
      className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in-up opacity-0"
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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