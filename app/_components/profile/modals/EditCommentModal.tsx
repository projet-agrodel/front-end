import { useState } from 'react';
import { Comment, User } from '../types';
import { Modal } from './Modal';

type EditCommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  comment: Comment | null;
  onUpdate: (updatedUser: User) => void;
};

export const EditCommentModal = ({ isOpen, onClose, comment, onUpdate }: EditCommentModalProps) => {
  const [formData, setFormData] = useState({
    text: comment?.text || '',
    rating: comment?.rating || 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aqui você faria a chamada à API para atualizar o comentário
      onUpdate({} as User); // Atualizar o estado do usuário após a operação
      onClose();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Avaliação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Avaliação
          </label>
          <div className="mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`text-2xl ${
                  star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Comentário
          </label>
          <textarea
            id="text"
            rows={4}
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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