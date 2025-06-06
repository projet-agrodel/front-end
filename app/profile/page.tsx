'use client';

import { useState, useEffect } from 'react';
import { User, Cartao as ApiCartao } from '@/services/interfaces/interfaces';
import { Tab, Card as LocalCard, Comment as LocalComment } from '../_components/profile/types';
import { ProfileHeader } from '../_components/profile/ProfileHeader';
import { TabNavigation } from '../_components/profile/TabNavigation';
import { PersonalInfo } from '../_components/profile/tabs/PersonalInfo';
import { Cards } from '../_components/profile/tabs/Cards';
import { Comments } from '../_components/profile/tabs/Comments';
import { ChangePasswordTab } from '../_components/profile/tabs/ChangePasswordTab';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchUserData = async (token: string | null | undefined): Promise<User | null> => {
  if (!token) {
    return null;
  }
  try {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401 || response.status === 404) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('session_invalid', 'true');
        const sessionInvalidEvent = new CustomEvent('session_invalid');
        window.dispatchEvent(sessionInvalidEvent);
      }
      return null;
    }
    if (!response.ok) {
      throw new Error('Falha ao buscar dados do usuário');
    }
    const fetchedUser: User = await response.json(); 
    return fetchedUser;
  } catch (error) {
    console.error('fetchUserData: Exceção:', error);
    return null; 
  }
};


interface ProfileViewModel extends User {
  avatar?: string;
}

const mapApiCartaoToLocalCard = (apiCartao: ApiCartao): LocalCard => {
  return {
    id: apiCartao.id,
    number: `${apiCartao.card_brand || 'Cartão'} final ${apiCartao.card_number_last4 || '****'}`,
    expiry: apiCartao.card_expiration_date_str || 'N/A',
  };
};



const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userData, setUserData] = useState<User | null>(null);
  const [avatarUrl, /* setAvatarUrl */] = useState<string>('https://w7.pngwing.com/pngs/223/244/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-rectangle-black.png');
  const [profileCards, setProfileCards] = useState<LocalCard[]>([]);
  const [profileComments, setProfileComments] = useState<LocalComment[]>([]);
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

    if (status === 'authenticated' && session?.accessToken) {
      const accessToken = session.accessToken;
      
      const getAllUserProfileData = async () => {
        setIsProfileLoading(true);
        try {
          const fetchedCoreUser = await fetchUserData(accessToken);
          if (fetchedCoreUser) {
            setUserData(fetchedCoreUser);

            if (fetchedCoreUser.cartoes && fetchedCoreUser.cartoes.length > 0) {
              const mappedCards = fetchedCoreUser.cartoes.map(mapApiCartaoToLocalCard);
              setProfileCards(mappedCards);
            } else {
              setProfileCards([]);
            }
          } else {
            setUserData(null);
            setProfileCards([]);
            setProfileComments([]);
          }
        } catch (error) {
          console.error('ProfilePage: Erro ao buscar todos os dados do perfil:', error);
          setUserData(null);
          setProfileCards([]);
          setProfileComments([]);
        } finally {
          setIsProfileLoading(false);
        }
      };
      
      getAllUserProfileData();
    }
  }, [status, session, router]);

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    if (userData) {
      const updatedUserData = { ...userData, ...updatedFields };
      setUserData(updatedUserData);
    }
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

  const profileViewData: ProfileViewModel = {
    ...userData,
    avatar: avatarUrl,
  };

  const tabs: Tab[] = [
    {
      id: 'info',
      label: 'Informações Pessoais',
      component: <PersonalInfo user={profileViewData} onUpdate={handleUpdateUser} />
    },
    {
      id: 'cards',
      label: 'Cartões',
      component: <Cards cards={profileCards} onUpdate={(updatedCards) => { setProfileCards(updatedCards); }} />
    },
    {
      id: 'comments',
      label: 'Avaliações',
      component: <Comments comments={profileComments} onUpdate={(updatedComments) => { setProfileComments(updatedComments); }} />
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
        <ProfileHeader user={profileViewData} />
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