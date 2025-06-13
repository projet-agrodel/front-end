'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getProfile, updateNotificationSettings } from '@/services/userService';
import {
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Save,
  RefreshCw
} from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface NotificationSettings {
  notify_new_order: boolean;
  notify_stock_alert: boolean;
}

interface FormData {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notify_new_order: boolean;
  notify_stock_alert: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('notifications');
  
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    siteName: '',
    siteDescription: '',
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    notify_new_order: false,
    notify_stock_alert: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getProfile(session?.accessToken as string),
    enabled: !!session?.accessToken,
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        // Mantem as configurações gerais estáticas por enquanto
        siteName: 'Agrodel',
        siteDescription: 'Sua loja de produtos agrícolas',
        siteEmail: 'contato@agrodel.com',
        sitePhone: '(11) 99999-9999',
        siteAddress: 'Rua das Plantas, 123 - São Paulo, SP',
        // Atualiza as configurações de notificação com dados do perfil
        emailNotifications: profile.notify_new_order || profile.notify_stock_alert,
        notify_new_order: profile.notify_new_order,
        notify_stock_alert: profile.notify_stock_alert,
      }));
    }
  }, [profile]);

  const updateNotificationMutation = useMutation({
    mutationFn: (settings: NotificationSettings) => 
      updateNotificationSettings(session?.accessToken as string, settings),
    onSuccess: () => {
      toast.success('Configurações de notificação salvas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    }
  });

  const configSections: ConfigSection[] = [
    {
      id: 'general',
      title: 'Configurações Gerais',
      icon: <Globe className="w-5 h-5" />,
      description: 'Informações básicas da plataforma'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: <Bell className="w-5 h-5" />,
      description: 'Gerencie suas preferências de notificação por e-mail'
    },
    {
      id: 'security',
      title: 'Segurança',
      icon: <Shield className="w-5 h-5" />,
      description: 'Configurações de segurança e senha'
    }
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    const newFormData = { ...formData, [field]: value };

    // Se o interruptor principal de email for desligado, desliga os filhos.
    if (field === 'emailNotifications' && value === false) {
      newFormData.notify_new_order = false;
      newFormData.notify_stock_alert = false;
    }
    
    // Se um dos filhos for ligado, liga o interruptor principal.
    if ((field === 'notify_new_order' || field === 'notify_stock_alert') && value === true) {
        newFormData.emailNotifications = true;
    }

    setFormData(newFormData);
  };

  const handleSave = async () => {
    if (activeSection === 'notifications') {
      updateNotificationMutation.mutate({
        notify_new_order: formData.notify_new_order,
        notify_stock_alert: formData.notify_stock_alert,
      });
    } else {
      // Lógica para salvar outras seções
      toast.info('Salvando outras configurações...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Configurações salvas!');
    }
  };
  
  const renderNotificationSettings = () => {
    if (isLoadingProfile) {
      return (
        <div className="flex items-center justify-center py-8">
            <RefreshCw className="animate-spin h-6 w-6 text-gray-400" />
            <span className="ml-2 text-gray-500">Carregando configurações...</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Canais de Notificação</h4>
          <p className="text-sm text-green-700">
            Ative ou desative os canais por onde você deseja receber notificações.
          </p>
        </div>

        {/* Canal de Email */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificações por Email</h4>
              <p className="text-sm text-gray-500">Receba atualizações por email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <motion.div
            initial={false}
            animate={{ height: formData.emailNotifications ? 'auto' : 0, opacity: formData.emailNotifications ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              <p className="text-sm text-gray-600">Quais notificações de e-mail você quer receber?</p>
              {[
                { key: 'notify_new_order', label: 'Alertas de Novos Pedidos', description: 'Receber um e-mail a cada novo pedido realizado.' },
                { key: 'notify_stock_alert', label: 'Alertas de Estoque Baixo', description: 'Ser avisado quando o estoque de um produto estiver acabando.' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between pl-4">
                  <div>
                    <h5 className="font-normal text-gray-800">{item.label}</h5>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[item.key as keyof typeof formData] as boolean}
                      onChange={(e) => handleInputChange(item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Canal de SMS */}
        <div className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg opacity-60">
          <div>
            <h4 className="font-medium text-gray-500">Notificações por SMS</h4>
            <p className="text-sm text-gray-400">Receba alertas via SMS (Em breve)</p>
          </div>
          <label className="relative inline-flex items-center cursor-not-allowed">
            <input
              type="checkbox"
              checked={formData.smsNotifications}
              onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              className="sr-only peer"
              disabled
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        
        {/* Canal Push */}
        <div className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg opacity-60">
          <div>
            <h4 className="font-medium text-gray-500">Notificações Push</h4>
            <p className="text-sm text-gray-400">Notificações do navegador (Em breve)</p>
          </div>
          <label className="relative inline-flex items-center cursor-not-allowed">
            <input
              type="checkbox"
              checked={formData.pushNotifications}
              onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              className="sr-only peer"
              disabled
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
    );
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Plataforma
          </label>
          <input
            type="text"
            value={formData.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            disabled
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de Contato
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.siteEmail}
              onChange={(e) => handleInputChange('siteEmail', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled
            />
          </div>
        </div>
      </div>
       <div className="text-center text-gray-500 text-sm pt-4">
        As configurações gerais são apenas para visualização no momento.
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
       <div className="bg-yellow-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Em Breve</h4>
        <p className="text-sm text-yellow-700">
         A funcionalidade de alteração de senha e autenticação de dois fatores será implementada em breve.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 md:p-6 lg:p-8"
    >
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
        </div>
        <p className="text-gray-600">
          Gerencie as configurações da sua plataforma Agrodel
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de navegação */}
        <div className="lg:w-1/4">
          <nav className="space-y-2">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-green-100 border-l-4 border-green-600 text-green-900'
                    : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-sm opacity-75">{section.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:w-3/4">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {configSections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-600">
                {configSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {renderContent()}

            {/* Botão de salvar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <motion.button
                  onClick={handleSave}
                  disabled={updateNotificationMutation.isPending}
                  className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {updateNotificationMutation.isPending ? (
                    <div className="flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Salvando...
                    </div>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 