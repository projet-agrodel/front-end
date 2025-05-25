'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AdminProduct,
    CreateAdminProductPayload,
    UpdateAdminProductPayload,
} from '../../../../services/adminProductService'; // Ajuste o caminho se necessário
import { getAuthTokenForAdmin } from '../../../../utils/authAdmin'; // Ajuste o caminho se necessário
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Interface DisplayProduct (necessária para initialData)
export interface DisplayProduct {
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
}

export interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: (data: AdminProduct) => void; 
    initialData?: DisplayProduct | null;
    categories: { id: number; name: string }[];
    // Funções de serviço de page.tsx
    createProductFn: (payload: CreateAdminProductPayload, token: string) => Promise<AdminProduct>;
    updateProductFn: (id: string, payload: UpdateAdminProductPayload, token: string) => Promise<AdminProduct>;
}

const inputBaseClass = "block w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-150 ease-in-out focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none";
const labelBaseClass = "block text-sm font-medium text-gray-700 mb-1.5";

export function ProductForm({ 
    isOpen, 
    onClose, 
    onSubmitSuccess, 
    initialData, 
    categories,
    createProductFn,
    updateProductFn
}: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<CreateAdminProductPayload>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Reset states ao abrir
            setError(null);
            setSuccessMessage(null);
            setIsSubmitting(false);

            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    description: initialData.description || '',
                    price: initialData.price ?? 0,
                    stock: initialData.stock ?? 0,
                    category_id: initialData.category?.id,
                    imageUrl: initialData.imageUrl || '',
                    status: initialData.status || 'Ativo',
                    isPromotion: !!initialData.isPromotion,
                    originalPrice: initialData.isPromotion ? (initialData.originalPrice ?? null) : null,
                });
            } else {
                setFormData({
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
            }
        } else {
            // Limpar dados quando o modal é fechado (para não mostrar dados antigos rapidamente na reabertura)
             setFormData({}); 
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: string | number | boolean | null | undefined = value;

        if (type === 'checkbox' && name === 'isPromotion') {
            const { checked } = e.target as HTMLInputElement;
            processedValue = checked;
            if (!checked) {
                setFormData(prev => ({ ...prev, originalPrice: null, [name]: checked }));
                return;
            }
        } else if (name === 'price' || name === 'stock' || name === 'originalPrice') {
            if (value === '') {
                processedValue = (name === 'originalPrice') ? null : 0; 
            } else {
                const num = parseFloat(value);
                processedValue = isNaN(num) ? ( (name === 'originalPrice') ? null : 0) : num;
            }
        } else if (name === 'category_id') {
            const categoryStringValue = value; 
            if (categoryStringValue === '' || categoryStringValue === '0') { 
                processedValue = undefined;
            } else {
                const numCatId = parseInt(categoryStringValue, 10);
                processedValue = isNaN(numCatId) ? undefined : numCatId;
            }
        }
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        const token = await getAuthTokenForAdmin(); 
        if (!token) {
            setError("Autenticação necessária.");
            setIsSubmitting(false);
            return;
        }

        const basePayload: CreateAdminProductPayload = {
            name: formData.name || '',
            description: formData.description || '',
            price: Number(formData.price) || 0,
            stock: Number(formData.stock) || 0,
            category_id: formData.category_id ? Number(formData.category_id) : null,
            imageUrl: formData.imageUrl || undefined,
            status: formData.status || 'Ativo', 
            isPromotion: formData.isPromotion || false,
            originalPrice: formData.isPromotion ? (Number(formData.originalPrice) || null) : null, 
        };

        if (!basePayload.name || basePayload.price <= 0) {
            setError("Nome do produto e preço (maior que zero) são obrigatórios.");
            setIsSubmitting(false);
            return;
        }
        if (basePayload.isPromotion && (!basePayload.originalPrice || basePayload.originalPrice <= basePayload.price)) {
            setError("Em promoção, o preço original deve ser informado e ser maior que o preço promocional.");
            setIsSubmitting(false);
            return;
        }
        if (basePayload.stock < 0) {
             setError("Estoque não pode ser negativo.");
             setIsSubmitting(false);
             return;
        }

        try {
            let result: AdminProduct;
            if (initialData?.id) { 
                const updatePayload: UpdateAdminProductPayload = { ...basePayload };
                result = await updateProductFn(String(initialData.id), updatePayload, token);
                setSuccessMessage("Produto atualizado com sucesso!");
            } else { 
                result = await createProductFn(basePayload, token);
                setSuccessMessage("Produto criado com sucesso!");
            }
            
            // Aguardar um pouco para exibir a mensagem de sucesso antes de fechar e recarregar
            setTimeout(() => {
                onSubmitSuccess(result);
                 // onClose(); // Fechar o modal é responsabilidade de page.tsx via onSubmitSuccess
            }, 1500); 

        } catch (err: unknown) {
            console.error("Erro ao salvar produto:", err);
            const apiError = err as { message?: string }; 
            setError(apiError.message || "Ocorreu um erro desconhecido ao salvar o produto.");
            setIsSubmitting(false); // Permitir nova tentativa
        }
        // Não setar setIsSubmitting(false) aqui se sucesso, pois o timeout vai fechar.
    };

    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { 
        hidden: { opacity: 0, y: 30, scale: 0.98 }, 
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "circOut"} }, 
        exit: { opacity: 0, y: 30, scale: 0.98, transition: { duration: 0.2, ease: "circIn"} } 
    };

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-md bg-transparent bg-opacity-60"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={onClose} 
        >
            <motion.div
                className="bg-gradient-to-br from-white-50 to-gray-100 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-6 sm:mb-8 text-center flex-shrink-0">
                    {initialData ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </h2>
                
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            key="error"
                            initial={{opacity: 0, y: -10, height: 0}}
                            animate={{opacity: 1, y: 0, height: 'auto'}}
                            exit={{opacity: 0, y: -10, height: 0}}
                            transition={{duration: 0.3}}
                            className="mb-4 p-3.5 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm flex items-center shadow-md flex-shrink-0"
                        >
                            <AlertCircle size={20} className="mr-2.5 text-red-600 flex-shrink-0" />
                            <span className="flex-grow">{error}</span>
                            <button onClick={() => setError(null)} className="ml-2 text-red-600 hover:text-red-800">&times;</button>
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div 
                            key="success"
                            initial={{opacity: 0, y: -10, height: 0}}
                            animate={{opacity: 1, y: 0, height: 'auto'}}
                            exit={{opacity: 0, y: -10, height: 0}}
                            transition={{duration: 0.3}}
                            className="mb-4 p-3.5 bg-green-50 border border-green-400 text-green-700 rounded-lg text-sm flex items-center shadow-md flex-shrink-0"
                        >
                            <CheckCircle2 size={20} className="mr-2.5 text-green-600 flex-shrink-0" />
                            <span className="flex-grow">{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto flex-grow pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label htmlFor="name" className={labelBaseClass}>Nome <span className="text-red-500">*</span></label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className={inputBaseClass} disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="price" className={labelBaseClass}>Preço (R$) <span className="text-red-500">*</span></label>
                            <input type="number" name="price" id="price" value={formData.price ?? ''} onChange={handleChange} required min="0.01" step="0.01" className={inputBaseClass} disabled={isSubmitting} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className={labelBaseClass}>Descrição</label>
                        <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className={`${inputBaseClass} min-h-[80px]`} disabled={isSubmitting}></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label htmlFor="stock" className={labelBaseClass}>Estoque <span className="text-red-500">*</span></label>
                            <input type="number" name="stock" id="stock" value={formData.stock ?? ''} onChange={handleChange} required min="0" step="1" className={inputBaseClass} disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="category_id" className={labelBaseClass}>Categoria</label>
                            <select name="category_id" id="category_id" value={formData.category_id || ''} onChange={handleChange} className={`${inputBaseClass} appearance-none`} disabled={isSubmitting}>
                                <option value="">Selecione uma categoria</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className={labelBaseClass}>URL da Imagem</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" className={inputBaseClass} disabled={isSubmitting} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-center pt-2">
                         <div>
                            <label htmlFor="status" className={labelBaseClass}>Status</label>
                            <select name="status" id="status" value={formData.status || 'Ativo'} onChange={handleChange} className={`${inputBaseClass} appearance-none`} disabled={isSubmitting}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                        <div className="flex items-center self-end pb-1 md:mt-0 mt-2">
                            <input type="checkbox" name="isPromotion" id="isPromotion" checked={!!formData.isPromotion} onChange={handleChange} className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer shadow-sm" disabled={isSubmitting} />
                            <label htmlFor="isPromotion" className="ml-2.5 block text-sm font-medium text-gray-700 cursor-pointer">Em Promoção?</label>
                        </div>
                    </div>

                    <AnimatePresence>
                        {formData.isPromotion && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem', marginBottom: '1.25rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                                transition={{duration: 0.3, ease: "easeInOut"}}
                                className="overflow-hidden p-1"
                            >
                                <label htmlFor="originalPrice" className={labelBaseClass}>Preço Original (R$) <span className="text-red-500">*</span></label>
                                <input type="number" name="originalPrice" id="originalPrice" value={formData.originalPrice ?? ''} onChange={handleChange} required={formData.isPromotion} min="0.01" step="0.01" className={inputBaseClass} disabled={isSubmitting} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
                
                <div className="flex justify-end gap-4 pt-6 mt-auto flex-shrink-0 border-t border-gray-200/80">
                    <motion.button 
                        type="button" 
                        onClick={onClose} 
                        className="px-7 py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all duration-150 ease-in-out shadow-sm disabled:opacity-60"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </motion.button>
                    <motion.button 
                        type="submit" // Alterado para submit, para que o form onSubmit seja acionado
                        onClick={handleSubmit} // Pode manter se quiser forçar o handle, mas o type submit já faz
                        className="px-7 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 ease-in-out shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-wait"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.98, y: 0 }}
                        disabled={isSubmitting || !!successMessage} // Desabilitar também se mensagem de sucesso estiver visível
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando...
                            </span>
                        ) : successMessage ? 'Salvo!' : (initialData ? 'Salvar Alterações' : 'Adicionar Produto')}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
} 