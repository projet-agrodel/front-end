import { useState } from 'react';
import { Comment, User } from '../types';
import { EditCommentModal } from '../modals/EditCommentModal';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';

type CommentsProps = {
  comments: Comment[];
  onUpdate: (updatedUser: User) => void;
};

export const Comments = ({ comments, onUpdate }: CommentsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
    ));
  };

  const handleEditClick = (comment: Comment) => {
    setSelectedComment(comment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Minhas Avaliações</h2>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Você ainda não fez nenhuma avaliação.
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{comment.productName}</h3>
                <div className="flex text-lg">
                  {renderStars(comment.rating)}
                </div>
              </div>
              <p className="my-2 text-gray-700">{comment.text}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {new Date(comment.date).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditClick(comment)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(comment)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditCommentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        comment={selectedComment}
        onUpdate={onUpdate}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedComment) {
            // Aqui você faria a chamada à API para deletar o comentário
            onUpdate({} as User); // Atualizar o estado do usuário após deletar
          }
          setIsDeleteModalOpen(false);
        }}
        title="Excluir Avaliação"
        message="Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita."
      />
    </div>
  );
}; 