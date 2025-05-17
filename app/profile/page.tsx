'use client';

import { useState, useEffect } from 'react';
import { User, Tab } from '../_components/profile/types';
import { ProfileHeader } from '../_components/profile/ProfileHeader';
import { TabNavigation } from '../_components/profile/TabNavigation';
import { PersonalInfo } from '../_components/profile/tabs/PersonalInfo';
import { Cards } from '../_components/profile/tabs/Cards';
import { Comments } from '../_components/profile/tabs/Comments';
import { ChangePasswordTab } from '../_components/profile/tabs/ChangePasswordTab';

const fetchUserData = async (): Promise<User> => {
  return {
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@exemplo.com',
    phone: '(11) 98765-4321',
    type: 'client',
    avatar: 'https://w7.pngwing.com/pngs/223/244/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-rectangle-black.png',
    cards: [
      { id: 1, number: '**** **** **** 1234', expiry: '12/25' },
      { id: 2, number: '**** **** **** 5678', expiry: '09/24' }
    ],
    comments: [
      { id: 1, productName: 'Smartphone XYZ', text: 'Produto excelente!', rating: 5, date: '2023-11-15' },
      { id: 2, productName: 'Notebook ABC', text: 'Bom custo-benefício', rating: 4, date: '2023-10-22' }
    ]
  };
};

const ProfilePage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserData();
  }, []);

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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