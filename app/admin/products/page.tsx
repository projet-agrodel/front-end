'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Search, AlertTriangle, Edit3, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    getAdminProducts, 
    createAdminProduct, 
    updateAdminProduct, 
    deleteAdminProduct,
    AdminProduct,
    CreateAdminProductPayload,
    UpdateAdminProductPayload,
    GetAdminProductsParams,
} from '../../../services/adminProductService';
import { getAuthTokenForAdmin } from '../../../utils/authAdmin';

// Importar componentes refatorados
import { ConfirmationModal, ConfirmationModalProps } from './_components/ConfirmationModal';
import { ProductForm, ProductFormProps, DisplayProduct as FormDisplayProduct } from './_components/ProductForm';

// Interface DisplayProduct para a tabela e estado da página
export interface PageDisplayProduct {
    id: number; 
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string | null; 
    status: 'Ativo' | 'Inativo';
    isPromotion: boolean; 
    originalPrice?: number | null;
    category?: { id: number; name: string }; 
    createdAt?: string | Date; 
    updatedAt?: string | Date;
}

interface ApiError {
    message?: string;
}

// Mock de categorias, idealmente viria do backend
const MOCK_CATEGORIES = [
    { id: 1, name: 'Eletrônicos' },
    { id: 2, name: 'Roupas' },
    { id: 3, name: 'Livros' },
    { id: 4, name: 'Casa e Cozinha' },
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<PageDisplayProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<PageDisplayProduct | null>(null);

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<PageDisplayProduct | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // const { toast } = useToast(); // Para notificações futuras

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = await getAuthTokenForAdmin();
        if (!token) {
            setError("Autenticação de administrador necessária.");
            setIsLoading(false);
            return;
        }
        try {
            const params: GetAdminProductsParams = { query: searchTerm || undefined };
            
            const fetchedProducts = await getAdminProducts(token, params);
            
            setProducts(fetchedProducts.map((p: AdminProduct): PageDisplayProduct => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: Number(p.price),
                stock: Number(p.stock),
                imageUrl: p.imageUrl,
                status: p.status,
                isPromotion: !!p.isPromotion,
                originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
                category: p.category === null ? undefined : p.category,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            })));
        } catch (err: unknown) {
            console.error("Erro ao buscar produtos:", err);
            const apiError = err as ApiError;
            setError(apiError.message || "Falha ao carregar produtos.");
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [products, searchTerm]);

    const handleAddNewClick = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (product: PageDisplayProduct) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = (returnedProduct: AdminProduct) => {
        // Idealmente, mostrar um toast de sucesso aqui.
        console.log("Produto salvo com sucesso:", returnedProduct);
        fetchProducts(); // Recarregar a lista de produtos
        handleCloseForm(); // Fechar o formulário
    };

    const handleDeleteClick = (product: PageDisplayProduct) => {
        setProductToDelete(product);
        setIsConfirmDeleteOpen(true);
    };

    const cancelDelete = () => {
        setIsConfirmDeleteOpen(false);
        setProductToDelete(null);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        const token = await getAuthTokenForAdmin();
        if (!token) {
            setError("Autenticação necessária para deletar.");
            setIsDeleting(false);
            return;
        }
        try {
            await deleteAdminProduct(String(productToDelete.id), token);
            // Idealmente, mostrar um toast de sucesso aqui.
            console.log(`Produto "${productToDelete.name}" deletado.`);
            fetchProducts(); 
            cancelDelete();
        } catch (err) {
            console.error("Erro ao deletar produto:", err);
            const apiError = err as ApiError;
            setError(apiError.message || "Não foi possível deletar o produto.");
        } finally {
            setIsDeleting(false);
        }
    };
    
    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return 'N/A';
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (isLoading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <p className="ml-4 text-lg text-gray-600">Carregando produtos...</p>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto p-4 md:p-6 lg:p-8"
            >
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-green-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Produtos</h1>
                        </div>
                        <motion.button
                            onClick={handleAddNewClick}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
                            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PlusCircle size={20} className="mr-2" />
                            Adicionar Produto
                        </motion.button>
                    </div>
                    <div className="mt-6 relative">
                        <input // Usando input HTML padrão por enquanto
                            type="text"
                            placeholder="Pesquisar produtos por nome, descrição ou categoria..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </header>

                {isLoading && products.length > 0 && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        <p className="ml-2 text-gray-500">Atualizando lista...</p>
                    </div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-md"
                    >
                        <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                            <div>
                                <p className="font-semibold">Erro ao Carregar Produtos</p>
                                <p className="text-sm">{error}</p>
                                <button 
                                    onClick={fetchProducts} 
                                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!isLoading && !error && filteredProducts.length === 0 && (
                     <div className="text-center py-10 px-6 bg-white shadow-lg rounded-lg">
                        <Package size={56} className="mx-auto text-gray-400 mb-5" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                            {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {searchTerm 
                                ? `Sua busca por "${searchTerm}" não retornou resultados. Tente refinar seus termos de busca.` 
                                : "Parece que você ainda não tem produtos. Que tal adicionar o primeiro?"}
                        </p>
                        {!searchTerm && (
                            <motion.button
                                onClick={handleAddNewClick}
                                className="flex items-center mx-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all duration-150 ease-in-out"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Adicionar Primeiro Produto
                            </motion.button>
                        )}
                    </div>
                )}

                {filteredProducts.length > 0 && (
                    <motion.div 
                        className="bg-white shadow-xl rounded-lg overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Imagem</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoria</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preço</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estoque</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <motion.tr 
                                            key={product.id} 
                                            className="hover:bg-gray-50 transition-colors duration-150 even:bg-white odd:bg-gray-50/50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout // Adiciona animação de layout para reordenação/remoção suave
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded-lg object-cover shadow-sm border border-gray-200" />
                                                ) : (
                                                    <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 shadow-sm border border-gray-200">
                                                        <Package size={28} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-middle">{product.category?.name || <span className="text-gray-400 italic">N/A</span>}</td>
                                            <td className="px-6 py-4 whitespace-nowrap align-middle">
                                                {product.isPromotion && product.originalPrice ? (
                                                    <div>
                                                        <span className="text-sm font-bold text-red-600">{formatPrice(product.price)}</span>
                                                        <span className="ml-2 text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-semibold text-gray-800">{formatPrice(product.price)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-middle text-center">{product.stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap align-middle">
                                                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'Ativo' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 align-middle text-center">
                                                <motion.button 
                                                    onClick={() => handleEditClick(product)} 
                                                    className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full transition-all duration-150"
                                                    title="Editar"
                                                    whileHover={{scale: 1.1}}
                                                    whileTap={{scale: 0.9}}
                                                >
                                                    <Edit3 size={18} />
                                                </motion.button>
                                                <motion.button 
                                                    onClick={() => handleDeleteClick(product)} 
                                                    className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-all duration-150"
                                                    title="Deletar"
                                                    whileHover={{scale: 1.1}}
                                                    whileTap={{scale: 0.9}}
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* O ProductForm é renderizado aqui e recebe as funções de CRUD */}
                {isFormOpen && (
                    <ProductForm 
                        isOpen={isFormOpen} 
                        onClose={handleCloseForm} 
                        onSubmitSuccess={handleFormSuccess} 
                        initialData={editingProduct as FormDisplayProduct | null} // Cast para o tipo esperado pelo formulário
                        categories={MOCK_CATEGORIES} 
                        createProductFn={createAdminProduct} 
                        updateProductFn={updateAdminProduct} 
                    />
                )}

                <ConfirmationModal 
                    isOpen={isConfirmDeleteOpen}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    confirmText="Excluir"
                    isConfirming={isDeleting}
                />
            </motion.div>
        </AnimatePresence>
    );
}