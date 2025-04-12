import { User } from '../types';
import { EditUserModal } from '../modals/EditUserModal';
import { useState } from 'react';

type PersonalInfoProps = {
  user: User;
  onUpdate: (updatedUser: User) => void;
};

export const PersonalInfo = ({ user, onUpdate }: PersonalInfoProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Nome</p>
          <p className="font-medium">{user.name}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">E-mail</p>
          <p className="font-medium">{user.email}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Telefone</p>
          <p className="font-medium">{user.phone}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Tipo de Conta</p>
          <p className="font-medium">{user.type === 'admin' ? 'Administrador' : 'Cliente'}</p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Editar Informações
        </button>
      </div>

      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={onUpdate}
      />
    </div>
  );
}; 