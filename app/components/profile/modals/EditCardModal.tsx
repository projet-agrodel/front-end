import { useState } from 'react';
import { Card, User } from '../types';
import { Modal } from './Modal';

type EditCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
  onUpdate: (updatedUser: User) => void;
};

export const EditCardModal = ({ isOpen, onClose, card, onUpdate }: EditCardModalProps) => {
  const [formData, setFormData] = useState({
    number: card?.number || '',
    expiry: card?.expiry || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aqui você faria a chamada à API para atualizar ou criar o cartão
      onUpdate({} as User); // Atualizar o estado do usuário após a operação
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={card ? "Editar Cartão" : "Adicionar Cartão"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Número do Cartão
          </label>
          <input
            type="text"
            id="number"
            value={formData.number}
            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="**** **** **** ****"
          />
        </div>

        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
            Data de Validade
          </label>
          <input
            type="text"
            id="expiry"
            value={formData.expiry}
            onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="MM/AA"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}; 