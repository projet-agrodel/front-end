'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Configurações Gerais
    siteName: 'Agrodel',
    siteDescription: 'Sua loja de produtos agrícolas',
    siteEmail: 'contato@agrodel.com',
    sitePhone: '(11) 99999-9999',
    siteAddress: 'Rua das Plantas, 123 - São Paulo, SP',
    
    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    stockNotifications: true,
    
    // Segurança
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
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
      description: 'Gerencie suas preferências de notificação'
    },
    {
      id: 'security',
      title: 'Segurança',
      icon: <Shield className="w-5 h-5" />,
      description: 'Configurações de segurança e senha'
    }
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
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
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={formData.sitePhone}
              onChange={(e) => handleInputChange('sitePhone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.siteAddress}
              onChange={(e) => handleInputChange('siteAddress', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição da Plataforma
        </label>
        <textarea
          value={formData.siteDescription}
          onChange={(e) => handleInputChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Tipos de Notificação</h4>
        <p className="text-sm text-green-700">
          Configure como você deseja receber notificações sobre atividades da plataforma.
        </p>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receba atualizações por email' },
          { key: 'smsNotifications', label: 'Notificações por SMS', description: 'Receba alertas via SMS' },
          { key: 'pushNotifications', label: 'Notificações Push', description: 'Notificações do navegador' },
          { key: 'orderNotifications', label: 'Alertas de Pedidos', description: 'Notificar sobre novos pedidos' },
          { key: 'stockNotifications', label: 'Alertas de Estoque', description: 'Avisar quando o estoque estiver baixo' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
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
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Configurações de Segurança</h4>
        <p className="text-sm text-yellow-700">
          Mantenha sua conta segura atualizando suas credenciais regularmente.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha Atual
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.twoFactorEnabled}
              onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
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
                  disabled={isSaving}
                  className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 