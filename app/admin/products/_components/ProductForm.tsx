'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Produto } from '@/services/interfaces/interfaces';
import { getAuthTokenForAdmin } from '../../../../utils/authAdmin';

export interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: (data: Produto) => void;
    initialData?: Produto | null;
    categories: { id: number; name: string }[];
    createProductFn: (payload: any, token: string) => Promise<Produto>;
    updateProductFn: (id: string, payload: any, token: string) => Promise<Produto>;
}

const productFormSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    price: z.number().min(0.01, 'Preço deve ser maior que zero'),
    originalPrice: z.number().nullable(),
    stock: z.number().min(0, 'Estoque não pode ser negativo'),
    imageUrl: z.string().optional(),
    status: z.enum(['Ativo', 'Inativo']),
    isPromotion: z.boolean(),
    category_id: z.number().nullable(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

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
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            originalPrice: null,
            stock: 0,
            imageUrl: '',
            status: 'Ativo',
            isPromotion: false,
            category_id: null,
        },
    });

    // Reset form quando o modal é aberto/fechado ou quando initialData muda
    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price,
                    originalPrice: initialData.originalPrice,
                    stock: initialData.stock,
                    imageUrl: initialData.imageUrl || '',
                    status: initialData.status as 'Ativo' | 'Inativo',
                    isPromotion: initialData.isPromotion,
                    category_id: initialData.category?.id || null,
                });
            } else {
                form.reset({
                    name: '',
                    description: '',
                    price: 0,
                    originalPrice: null,
                    stock: 0,
                    imageUrl: '',
                    status: 'Ativo',
                    isPromotion: false,
                    category_id: null,
                });
            }
        }
    }, [isOpen, initialData, form]);

    const createMutation = useMutation({
        mutationFn: async (values: ProductFormValues) => {
            const token = await getAuthTokenForAdmin();
            if (!token) throw new Error('Autenticação necessária');
            return createProductFn(values, token);
        },
        onSuccess: (data) => {
            onSubmitSuccess(data);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (values: ProductFormValues) => {
            const token = await getAuthTokenForAdmin();
            if (!token) throw new Error('Autenticação necessária');
            if (!initialData?.id) throw new Error('ID do produto não encontrado');
            return updateProductFn(initialData.id.toString(), values, token);
        },
        onSuccess: (data) => {
            onSubmitSuccess(data);
        },
    });

    const onSubmit = async (values: ProductFormValues) => {
        if (initialData?.id) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
        }
    };

    if (!isOpen) return null;

    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { 
        hidden: { opacity: 0, y: 30, scale: 0.98 }, 
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "circOut"} }, 
        exit: { opacity: 0, y: 30, scale: 0.98, transition: { duration: 0.2, ease: "circIn"} } 
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-md bg-transparent bg-opacity-60"
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            onClick={onClose} 
        >
            <motion.div
                className="bg-gradient-to-br from-white-50 to-gray-100 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="overflow-visible flex-grow min-h-0 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-6 sm:mb-8 text-center flex-shrink-0">
                        {initialData ? 'Editar Produto' : 'Adicionar Novo Produto'}
                    </h2>
                    
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.98, transition: { duration: 0.2 } }}
                                className="my-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start shadow-sm text-sm">
                                <AlertCircle className="h-5 w-5 mr-2.5 flex-shrink-0" />
                                <span className="flex-grow leading-snug">{error instanceof Error ? error.message : 'Erro ao salvar produto'}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label htmlFor="name" className={labelBaseClass}>Nome <span className="text-red-500">*</span></label>
                                <input 
                                    {...form.register('name')}
                                    type="text" 
                                    id="name" 
                                    className={inputBaseClass} 
                                    disabled={isSubmitting} 
                                />
                                {form.formState.errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="price" className={labelBaseClass}>Preço (R$) <span className="text-red-500">*</span></label>
                                <input 
                                    {...form.register('price', { valueAsNumber: true })}
                                    type="number" 
                                    id="price" 
                                    min="0.01" 
                                    step="0.01" 
                                    className={inputBaseClass} 
                                    disabled={isSubmitting} 
                                />
                                {form.formState.errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.price.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className={labelBaseClass}>Descrição</label>
                            <textarea 
                                {...form.register('description')}
                                id="description" 
                                rows={3} 
                                className={`${inputBaseClass} min-h-[80px]`} 
                                disabled={isSubmitting}
                            />
                            {form.formState.errors.description && (
                                <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label htmlFor="stock" className={labelBaseClass}>Estoque <span className="text-red-500">*</span></label>
                                <input 
                                    {...form.register('stock', { valueAsNumber: true })}
                                    type="number" 
                                    id="stock" 
                                    min="0" 
                                    step="1" 
                                    className={inputBaseClass} 
                                    disabled={isSubmitting} 
                                />
                                {form.formState.errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.stock.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="originalPrice" className={labelBaseClass}>Preço Original (opcional)</label>
                                <input 
                                    {...form.register('originalPrice', { valueAsNumber: true })}
                                    type="number" 
                                    id="originalPrice" 
                                    min="0.01" 
                                    step="0.01" 
                                    className={inputBaseClass} 
                                    disabled={isSubmitting} 
                                />
                                {form.formState.errors.originalPrice && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.originalPrice.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className={labelBaseClass}>URL da Imagem (opcional)</label>
                            <input 
                                {...form.register('imageUrl')}
                                type="text" 
                                id="imageUrl" 
                                className={inputBaseClass} 
                                disabled={isSubmitting} 
                            />
                            {form.formState.errors.imageUrl && (
                                <p className="mt-1 text-sm text-red-600">{form.formState.errors.imageUrl.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label htmlFor="status" className={labelBaseClass}>Status</label>
                                <select 
                                    {...form.register('status')}
                                    id="status" 
                                    className={inputBaseClass} 
                                    disabled={isSubmitting}
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                                {form.formState.errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.status.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="category_id" className={labelBaseClass}>Categoria</label>
                                <select 
                                    {...form.register('category_id', { valueAsNumber: true })}
                                    id="category_id" 
                                    className={inputBaseClass} 
                                    disabled={isSubmitting}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {form.formState.errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.category_id.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input 
                                {...form.register('isPromotion')}
                                type="checkbox" 
                                id="isPromotion" 
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                                disabled={isSubmitting}
                            />
                            <label htmlFor="isPromotion" className="text-sm font-medium text-gray-700">
                                Em Promoção
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
} 