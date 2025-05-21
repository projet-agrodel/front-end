'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Search, AlertTriangle, Edit3, Trash2, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    getAdminProducts, 
    createAdminProduct, 
    updateAdminProduct, 
    deleteAdminProduct,
    AdminProduct,
    CreateAdminProductPayload,
    UpdateAdminProductPayload,
} from '../../../services/adminProductService';
import { getAuthTokenForAdmin } from '../../../utils/authAdmin'; // Caminho corrigido

// Interface para os dados exibidos na tabela e passados para o formulário como initialData
interface DisplayProduct {
    // Campos espelhados de AdminProduct que são usados na UI e no formulário
    id: number; 
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string | null; 
    status: 'Ativo' | 'Inativo'; // Mantém os tipos literais usados na UI
    isPromotion: boolean; 
    originalPrice?: number | null;
    category?: { id: number; name: string }; // AdminProduct tem category | null, aqui pode ser opcional
    createdAt?: string | Date; // Pode ser string ou Date dependendo da transformação
    updatedAt?: string | Date;
}

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
            className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-transparent bg-opacity-50"
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
                            {isConfirming ? "Processando..." : confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Componente ProductForm (simplificado e integrado aqui por enquanto)
// Idealmente, este seria um componente separado em ./_components/ProductForm
interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: (data: AdminProduct) => void;
    initialData?: DisplayProduct | null;
    // Supondo que temos uma lista de categorias para o select
    categories: { id: number; name: string }[]; 
}

function ProductForm({ isOpen, onClose, onSubmitSuccess, initialData, categories }: ProductFormProps) {
    // Garantir que CreateAdminProductPayload inclua todos os campos necessários, incluindo os opcionais
    const [formData, setFormData] = useState<Partial<CreateAdminProductPayload>>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: undefined,
        imageUrl: '',
        status: 'Ativo',
        isPromotion: false,
        originalPrice: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price,
                    stock: initialData.stock,
                    category_id: initialData.category?.id,
                    imageUrl: initialData.imageUrl || '',
                    status: initialData.status || 'Ativo',
                    isPromotion: !!initialData.isPromotion,
                    originalPrice: initialData.originalPrice ?? null,
                });
            } else {
                // Reset para novo produto
                setFormData({
                    name: '',
                    description: '',
                    price: 0, // Ou use string vazia '' se preferir campos vazios em vez de 0
                    stock: 0, // Ou ''
                    category_id: undefined,
                    imageUrl: '',
                    status: 'Ativo',
                    isPromotion: false,
                    originalPrice: null, // Ou ''
                });
            }
            setError(null); 
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: string | number | boolean | null | undefined = value;

        if (type === 'checkbox' && name === 'isPromotion') {
            const { checked } = e.target as HTMLInputElement;
            processedValue = checked;
        } else if (name === 'price' || name === 'stock' || name === 'originalPrice') {
            if (value === '') {
                processedValue = (name === 'originalPrice') ? null : '';
            } else {
                const num = parseFloat(value);
                processedValue = isNaN(num) ? value : num;
            }
        } else if (name === 'category_id') {
            const categoryStringValue = value; 
            if (categoryStringValue === '') {
                processedValue = undefined;
            } else {
                const numCatId = parseInt(categoryStringValue, 10);
                if (isNaN(numCatId)) {
                    processedValue = undefined;
                } else {
                    processedValue = numCatId;
                }
            }
        }
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const token = getAuthTokenForAdmin(); 
        if (!token) {
            setError("Autenticação necessária.");
            setIsSubmitting(false);
            return;
        }

        const payload: CreateAdminProductPayload = {
            name: formData.name || '',
            description: formData.description || '',
            price: Number(formData.price) || 0,
            stock: Number(formData.stock) || 0,
            category_id: formData.category_id ? Number(formData.category_id) : null,
            imageUrl: formData.imageUrl || undefined,
            status: formData.status || 'Ativo',
            isPromotion: formData.isPromotion || false,
            originalPrice: (formData.originalPrice !== undefined && formData.originalPrice !== null && 
                           (typeof formData.originalPrice === 'string' ? formData.originalPrice === '' : false))
                           ? Number(formData.originalPrice) : null,
        };
        
        if (!payload.name || !payload.description || payload.price <= 0 ) {
            setError("Nome, descrição são obrigatórios. Preço deve ser > 0.");
            setIsSubmitting(false);
            return;
        }
        if (payload.stock < 0) {
            setError("Estoque não pode ser negativo.");
            setIsSubmitting(false);
            return;
        }

        try {
            let result: AdminProduct;
            if (initialData?.id) {
                const currentInitialData = initialData as DisplayProduct;
                const finalUpdatePayload: UpdateAdminProductPayload = {};

                if (payload.name !== currentInitialData.name) finalUpdatePayload.name = payload.name;
                if (payload.description !== currentInitialData.description) finalUpdatePayload.description = payload.description;
                if (payload.price !== currentInitialData.price) finalUpdatePayload.price = payload.price;
                if (payload.stock !== currentInitialData.stock) finalUpdatePayload.stock = payload.stock;
                
                const initialCategoryId = currentInitialData.category?.id ?? null;
                if (payload.category_id !== initialCategoryId) finalUpdatePayload.category_id = payload.category_id;
                
                const currentImageUrl = currentInitialData.imageUrl ?? undefined;
                if (payload.imageUrl !== currentImageUrl) finalUpdatePayload.imageUrl = payload.imageUrl;
                
                if (payload.status !== currentInitialData.status) finalUpdatePayload.status = payload.status;
                if (payload.isPromotion !== currentInitialData.isPromotion) finalUpdatePayload.isPromotion = payload.isPromotion;
                
                const currentOriginalPrice = currentInitialData.originalPrice ?? null;
                if (payload.originalPrice !== currentOriginalPrice) finalUpdatePayload.originalPrice = payload.originalPrice;

                if (Object.keys(finalUpdatePayload).length > 0) {
                    result = await updateAdminProduct(String(currentInitialData.id), finalUpdatePayload, token);
                } else {
                    onSubmitSuccess(currentInitialData as unknown as AdminProduct);
                    onClose();
                    setIsSubmitting(false);
                    return; 
                }
            } else { 
                result = await createAdminProduct(payload, token);
            }
            onSubmitSuccess(result);
            onClose();
        } catch (err: unknown) {
            console.error("Erro ao salvar produto:", err);
            const error = err as Error;
            setError(error.message || "Ocorreu um erro ao salvar o produto.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -50 } };

    return (
        <motion.div 
            className="fixed inset-0 z-40 flex justify-center items-start pt-10 p-4 backdrop-blur-sm bg-transparent bg-opacity-75 overflow-y-auto"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={onClose}
        >
            <motion.div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-6"> {/* Aumentado o space-y */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-6"> {/* Aumentado mb e tamanho da fonte */}
                        {initialData?.id ? "Editar Produto" : "Adicionar Novo Produto"}
                    </h3>
                    
                    {error && <p className="text-red-500 text-sm py-2 px-3 bg-red-100 border border-red-300 rounded-md">{error}</p>}

                    {/* Campos existentes */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                        <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> {/* Ajustado gap */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                            <input type="text" name="price" id="price" value={formData.price === null || formData.price === undefined ? '' : String(formData.price)} onChange={handleChange} required placeholder="Ex: 25.99" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Original (R$) <span className="text-xs text-gray-500">(Opcional)</span></label>
                            <input type="text" name="originalPrice" id="originalPrice" value={formData.originalPrice === null || formData.originalPrice === undefined ? '' : String(formData.originalPrice)} onChange={handleChange} placeholder="Ex: 30.00" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                            <input type="number" name="stock" id="stock" value={formData.stock === null || formData.stock === undefined ? '' : formData.stock} onChange={handleChange} required min="0" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select 
                                name="category_id" 
                                id="category_id" 
                                value={formData.category_id !== undefined ? String(formData.category_id) : ''} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select name="status" id="status" value={formData.status || 'Ativo'} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                         <div> {/* Container para alinhar o checkbox com outros campos */}
                            <label htmlFor="isPromotion" className="block text-sm font-medium text-gray-700 mb-1 invisible">Promoção</label> {/* Label invisível para alinhar */}
                            <div className="flex items-center mt-1 pt-2"> {/* Ajuste de margem para alinhar com inputs */}
                                <input id="isPromotion" name="isPromotion" type="checkbox" checked={formData.isPromotion || false} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <label htmlFor="isPromotion" className="ml-2 block text-sm font-medium text-gray-700">Em Promoção?</label>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem <span className="text-xs text-gray-500">(Opcional)</span></label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                    </div>

                    <div className="flex justify-end gap-4 pt-6"> {/* Aumentado pt e gap */}
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium text-sm transition-colors">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium text-sm transition-colors">
                            {isSubmitting ? "Salvando..." : (initialData?.id ? "Salvar Alterações" : "Adicionar Produto")}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// Definir interface para erros da API
interface ApiError {
    message?: string;
}

export default function AdminProductsPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<DisplayProduct[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(''); 
  const [editingProduct, setEditingProduct] = useState<DisplayProduct | null>(null); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [productToDelete, setProductToDelete] = useState<DisplayProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Simulação: buscar categorias do backend ou ter uma lista estática
  // No futuro, isso viria de uma chamada API: getCategories()
  const [availableCategories] = useState<{id: number; name: string}[]>([
    {id: 1, name: "Fertilizantes"}, {id: 2, name: "Sementes"}, {id: 3, name: "Defensivos"}, {id: 4, name: "Adubos"}, {id: 5, name: "Vasos"}
  ]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthTokenForAdmin();
    if (!token) {
        setError("Autenticação necessária para carregar produtos.");
        setLoading(false);
        setAllProducts([]); // Limpa produtos se não houver token
        return;
    }
    try {
        const productsFromApi = await getAdminProducts(token);
        const displayProducts: DisplayProduct[] = productsFromApi.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            imageUrl: p.imageUrl ?? undefined,
            status: p.status as ('Ativo' | 'Inativo') ?? 'Inativo',
            isPromotion: !!p.isPromotion,
            originalPrice: p.originalPrice ?? undefined,
            category: p.category || undefined,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
        setAllProducts(displayProducts);
    } catch (err: unknown) {
        console.error("Erro ao buscar produtos:", err);
        const error = err as ApiError;
        setError(error.message || "Falha ao carregar produtos.");
        setAllProducts([]); // Limpa produtos em caso de erro
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product: DisplayProduct) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingProduct(null); 
  };

  const handleFormSuccess = (updatedOrNewProduct: AdminProduct) => {
    console.log("Produto salvo com sucesso (AdminProduct):", updatedOrNewProduct);
    fetchProducts(); // Re-fetch todos os produtos para atualizar a lista
    handleCloseForm(); 
  };

  const handleDeleteClick = (product: DisplayProduct) => {
      setProductToDelete(product);
      setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setIsDeleting(false); 
  };

  const confirmDelete = async () => {
    if (!productToDelete || !productToDelete.id) return;

    setIsDeleting(true);
    setError(null); // Limpa erros anteriores
    const token = getAuthTokenForAdmin();
    if (!token) {
        setError("Autenticação necessária para excluir produto.");
        setIsDeleting(false);
        return;
    }

    try {
        await deleteAdminProduct(String(productToDelete.id), token); // ID precisa ser string
        console.log("Produto excluído com sucesso ID:", productToDelete.id);
        cancelDelete(); 
        fetchProducts(); // Re-fetch
    } catch (err: unknown) {
        console.error("Erro ao excluir produto:", err);
        const error = err as ApiError;
        setError(error.message || "Falha ao excluir o produto.");
        setIsDeleting(false); 
    }
  };

  const uniqueCategoriesForFilter = useMemo(() => {
    const categories = new Set(allProducts.map(p => p.category?.name));
    return ['', ...Array.from(categories).sort()]; // Adiciona "Todas as Categorias"
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let productsToFilter = allProducts;

    if (selectedCategoryFilter) {
        productsToFilter = productsToFilter.filter(product => product.category?.name === selectedCategoryFilter);
    }

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        productsToFilter = productsToFilter.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.description.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }
    return productsToFilter;
  }, [allProducts, selectedCategoryFilter, searchTerm]);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Package size={28} className="mr-3 text-green-600" /> Gerenciamento de Produtos
        </h1>
        <button
          onClick={() => { setEditingProduct(null); setIsFormModalOpen(true); }}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
        >
          <PlusCircle size={18} className="mr-2" />
          Adicionar Produto
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow">
        <div className="md:col-span-1">
            <label htmlFor="search" className="sr-only">Buscar Produtos</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Buscar por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="md:col-span-1">
            <label htmlFor="categoryFilter" className="sr-only">Filtrar por Categoria</label>
            <select
                id="categoryFilter"
                name="categoryFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
                {uniqueCategoriesForFilter.map(cat => (
                    <option key={cat || 'all'} value={cat}>{cat || 'Todas as Categorias'}</option>
                ))}
            </select>
        </div>
         {/* Poderia adicionar mais filtros aqui, como por status, promoção, etc. */}
      </div>
      
      {/* Exibição de Erro Principal */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
            <div className="flex">
                <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-500 mr-3" /></div>
                <div>
                    <p className="font-bold">Erro</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        </div>
      )}

      {/* Tabela de Produtos ou Mensagem de Carregamento/Vazio */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Carregando produtos...</p>
          {/* Poderia adicionar um spinner aqui */}
        </div>
      ) : !filteredProducts.length && !error ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm || selectedCategoryFilter ? "Tente ajustar seus filtros ou " : "Comece adicionando um novo produto."}
            {!searchTerm && !selectedCategoryFilter && 
                <button onClick={() => { setEditingProduct(null); setIsFormModalOpen(true); }} className="text-green-600 hover:text-green-500 font-medium">
                    adicionar um produto
                </button>
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150" title="Editar">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-900 transition-colors duration-150" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Formulário para Adicionar/Editar Produto */}
      <AnimatePresence>
        {isFormModalOpen && (
          <ProductForm
            isOpen={isFormModalOpen}
            onClose={handleCloseForm}
            onSubmitSuccess={handleFormSuccess}
            initialData={editingProduct}
            categories={availableCategories} // Passa as categorias para o formulário
          />
        )}
      </AnimatePresence>

      {/* Modal de Confirmação para Excluir Produto */}
      <AnimatePresence>
        {showDeleteConfirm && productToDelete && (
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir o produto "${productToDelete.name}"? Esta ação não pode ser desfeita.`}
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