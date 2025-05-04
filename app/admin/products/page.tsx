'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PackagePlus, Package, Search, AlertTriangle } from 'lucide-react';
import ProductForm from './_components/ProductForm';
import ProductTable from './_components/ProductTable';
import { AnimatePresence, motion } from 'framer-motion';

// Interface Produto mais completa
interface Product { 
  id: string;
  name: string;
  description: string; // Adicionado
  price: number; // Preço de venda
  originalPrice?: number | null; // Preço original (opcional)
  category: string;
  imageUrl?: string; // URL da imagem (opcional, vindo do backend)
  status: 'Ativo' | 'Inativo'; // Adicionado status
  isPromotion: boolean;
}

// --- Simulação de busca de dados de produtos ---
async function getProductsData(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula atraso
    // Dados fictícios (simulando retorno após cadastro)
    return [
        {
            id: 'prod_1722447600000', name: 'Fertilizante Super Crescimento', description: 'Para plantas mais fortes',
            price: 19.99, category: 'Fertilizantes', status: 'Ativo', isPromotion: false, originalPrice: null
        },
        {
            id: 'prod_1722448000000', name: 'Sementes de Tomate Cereja', description: 'Colheita fácil e saborosa',
            price: 5.50, category: 'Sementes', status: 'Ativo', isPromotion: false, originalPrice: null
        },
        {
            id: 'prod_1722448200000', name: 'Herbicida Mata-Tudo', description: 'Elimina ervas daninhas',
            price: 35.00, category: 'Defensivos', status: 'Inativo', isPromotion: false, originalPrice: null
        },
        {
            id: 'prod_1722448500000', name: 'Adubo Orgânico Premium', description: 'Nutrição completa para o solo',
            price: 25.00, category: 'Adubos', status: 'Ativo', isPromotion: true, originalPrice: 32.50
        },
        {
            id: 'prod_1722449000000', name: 'Sementes de Alface Crespa', description: 'Variedade resistente',
            price: 4.80, category: 'Sementes', status: 'Ativo', isPromotion: false, originalPrice: null
        },
        {
            id: 'prod_1722449500000', name: 'Vaso Decorativo Grande', description: 'Para plantas ornamentais',
            price: 75.90, category: 'Vasos', status: 'Ativo', isPromotion: false, originalPrice: null
        },
    ];
}
// --- Fim da simulação ---

// Componente simples de Modal de Confirmação
interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirming?: boolean; // Para estado de carregamento
}

function ConfirmationModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isConfirming = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    // Reutiliza variantes do ProductForm para consistência
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={onCancel} // Fecha ao clicar fora
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
            >
                <div className="p-6 text-center">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onCancel}
                            disabled={isConfirming}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isConfirming ? "Excluindo..." : confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function AdminProductsPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Todos os produtos
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para busca
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Estado para categoria selecionada ('' = Todas)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Estado para produto em edição
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Estado para modal de confirmação
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null); // ID do produto a excluir
  const [isDeleting, setIsDeleting] = useState(false); // Estado de carregamento da exclusão

  // Busca inicial de produtos
  useEffect(() => {
    setLoading(true);
    getProductsData()
        .then(data => setAllProducts(data))
        .catch(error => {
            console.error("Erro ao buscar produtos:", error);
            setAllProducts([]);
        })
        .finally(() => setLoading(false));
  }, []);

  // Abre o modal para edição
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  // Função chamada ao fechar ou submeter o formulário
  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingProduct(null); // Limpa o produto em edição ao fechar
  };

  // Chamada quando o formulário é submetido com sucesso (Add ou Edit)
  const handleFormSuccess = (formData: any) => {
    console.log("Sucesso! Dados do formulário:", formData);
    console.log(editingProduct ? "Editando produto ID:" : "Adicionando novo produto", editingProduct?.id);

    // Simular atualização e recarregar dados
    setLoading(true);
    getProductsData() // Simula re-fetch após add/edit
        .then(data => setAllProducts(data))
        .catch(error => console.error("Erro ao re-buscar produtos:", error))
        .finally(() => setLoading(false));
    
    handleCloseForm(); // Fecha o modal e limpa estado de edição
  };

  // Abre o modal de confirmação de exclusão
  const handleDeleteClick = (productId: string) => {
      setProductToDeleteId(productId);
      setShowDeleteConfirm(true);
  };

  // Cancela a exclusão
  const cancelDelete = () => {
      setShowDeleteConfirm(false);
      setProductToDeleteId(null);
      setIsDeleting(false); // Reseta estado de loading
  };

  // Confirma e executa a exclusão (simulada)
  const confirmDelete = async () => {
    if (!productToDeleteId) return;

    setIsDeleting(true);
    console.log("Excluindo produto ID (simulado):", productToDeleteId);

    try {
        // Simula chamada à API para excluir
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        // Após exclusão simulada com sucesso:
        console.log("Produto excluído com sucesso (simulado).");
        cancelDelete(); // Fecha modal e limpa IDs
        
        // Recarrega a lista de produtos
        setLoading(true);
        getProductsData()
            .then(data => setAllProducts(data))
            .catch(error => console.error("Erro ao re-buscar produtos após exclusão:", error))
            .finally(() => setLoading(false));

    } catch (error) {
        console.error("Erro ao excluir produto (simulado):", error);
        // Poderia mostrar uma mensagem de erro para o usuário
        setIsDeleting(false); // Libera o botão em caso de erro
    }
  };

  // Extrai categorias únicas para os botões de filtro
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allProducts.map(p => p.category));
    return Array.from(categories).sort(); // Ordena alfabeticamente
  }, [allProducts]);

  // Filtra os produtos por categoria e depois por termo de busca
  const filteredProducts = useMemo(() => {
    let productsToFilter = allProducts;

    // 1. Filtrar por categoria
    if (selectedCategory) {
        productsToFilter = productsToFilter.filter(product => product.category === selectedCategory);
    }

    // 2. Filtrar por termo de busca
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        productsToFilter = productsToFilter.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    return productsToFilter;
  }, [allProducts, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Título e Botão Adicionar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Package size={22} className="mr-2 text-gray-600" /> Gerenciamento de Produtos
        </h2>
        <button
          onClick={() => { setEditingProduct(null); setIsFormModalOpen(true); }}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex-shrink-0"
        >
          <PackagePlus size={18} className="mr-2" />
          Adicionar Produto
        </button>
      </div>

      {/* Renderização Condicional do Modal com Animação */}
      <AnimatePresence>
        {isFormModalOpen && (
          <ProductForm
            key={editingProduct ? `edit-${editingProduct.id}` : "add-product"}
            initialData={editingProduct}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* Filtros e Container da Tabela */}
       <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 space-y-4"> {/* Adicionado space-y-4 */}
            {/* Filtros de Categoria */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">Filtrar por Categoria:</span>
                <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === '' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Todas
                </button>
                {uniqueCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === category 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

           {/* Barra de Busca */}
          <div> {/* Envolver a busca em um div para separá-la dos filtros */} 
            <div className="relative w-full sm:w-72">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Buscar por nome do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm w-full"
                />
            </div>
          </div>

        {/* Área da Lista/Tabela de Produtos */}
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-t pt-4"> {/* Adicionado border-t pt-4 */}
            Lista de Produtos ({filteredProducts.length})
            {selectedCategory && <span className="text-base font-normal text-gray-600"> - Categoria: {selectedCategory}</span>}
        </h3>
        {loading ? (
            <div className="flex justify-center items-center py-10"> 
                <p className="text-gray-500">Carregando produtos...</p>
            </div>
        ) : (
            <ProductTable 
                products={filteredProducts} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            /> 
        )}
      </div>

      {/* Modal de Confirmação de Exclusão (com AnimatePresence) */}
      <AnimatePresence>
          {showDeleteConfirm && (
              <ConfirmationModal
                  key="delete-confirm-modal"
                  isOpen={showDeleteConfirm}
                  title="Confirmar Exclusão"
                  message={`Tem certeza que deseja excluir o produto com ID ${productToDeleteId}? Esta ação não pode ser desfeita.`}
                  onConfirm={confirmDelete}
                  onCancel={cancelDelete}
                  confirmText="Excluir"
                  isConfirming={isDeleting}
              />
          )}
      </AnimatePresence>

    </div>
  );
} 