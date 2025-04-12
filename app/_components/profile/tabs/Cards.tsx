import { useState } from 'react';
import { Card, User } from '../types';
import { EditCardModal } from '../modals/EditCardModal';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';

type CardsProps = {
  cards: Card[];
  onUpdate: (updatedUser: User) => void;
};

export const Cards = ({ cards, onUpdate }: CardsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleEditClick = (card: Card) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (card: Card) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Meus Cartões</h2>
        <button 
          onClick={() => {
            setSelectedCard(null);
            setIsEditModalOpen(true);
          }}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Adicionar Cartão
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Você ainda não possui cartões cadastrados.
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map(card => (
            <div key={card.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-3 rounded-md mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{card.number}</p>
                  <p className="text-sm text-gray-500">Validade: {card.expiry}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditClick(card)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDeleteClick(card)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        card={selectedCard}
        onUpdate={onUpdate}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedCard) {
            // Aqui você faria a chamada à API para deletar o cartão
            onUpdate({} as User); // Atualizar o estado do usuário após deletar
          }
          setIsDeleteModalOpen(false);
        }}
        title="Excluir Cartão"
        message="Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita."
      />
    </div>
  );
}; 