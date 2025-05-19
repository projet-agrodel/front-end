'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

// Reutilizar a interface Product
interface Product { 
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl?: string;
  status: 'Ativo' | 'Inativo';
  isPromotion: boolean;
}

// Adicionado initialData à interface
interface ProductFormData {
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    category: string;
    image: File | null; // Manter como File para upload, mas não preencheremos a partir de initialData
    isPromotion: boolean;
}

interface ProductFormProps {
    initialData?: Product | null; // Tornar opcional para adição
    onClose: () => void;
    onSuccess: (productData: Product | Partial<Product>) => void;
}

// Variantes de animação para o modal
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export default function ProductForm({ initialData, onClose, onSuccess }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        image: null,
        isPromotion: false,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData | 'general', string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!initialData; // Determina se está editando

    // Efeito para preencher o formulário com dados iniciais na edição
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                price: String(initialData.price), // Converter para string
                originalPrice: initialData.originalPrice ? String(initialData.originalPrice) : '',
                category: initialData.category,
                image: null, // Não preenchemos o campo de arquivo existente
                isPromotion: initialData.isPromotion,
            });
        } else {
             // Resetar formulário se abrir para adição (ou se initialData for removido)
             setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                category: '',
                image: null,
                isPromotion: false,
             });
        }
        // Limpar erros ao mudar o modo (add/edit)
        setErrors({});
    }, [initialData, isEditing]); // Depende de initialData

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => {
            const newState = { ...prev, [name]: newValue };
            
            if (name === 'isPromotion' && !newValue) {
                newState.originalPrice = '';
                setErrors(prevErrors => ({ ...prevErrors, originalPrice: undefined }));
            }
            return newState;
        });

        
        if (errors[name as keyof ProductFormData] && type !== 'checkbox') {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: undefined }));
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProductFormData | 'general', string>> = {};
        let isValid = true;
        const priceNum = Number(formData.price);
        const originalPriceNum = Number(formData.originalPrice);

        if (!formData.name.trim()) { newErrors.name = 'Nome é obrigatório'; isValid = false; }
        if (!formData.description.trim()) { newErrors.description = 'Descrição é obrigatória'; isValid = false; }
        if (!formData.category.trim()) { newErrors.category = 'Categoria é obrigatória'; isValid = false; }
        // Tornar imagem opcional na edição
        if (!isEditing && !formData.image) { 
            newErrors.image = 'Imagem é obrigatória ao adicionar produto'; 
            isValid = false; 
        }

        
        if (!formData.price.trim()) {
            newErrors.price = 'Preço é obrigatório';
            isValid = false;
        } else if (isNaN(priceNum) || priceNum <= 0) {
            newErrors.price = `Preço ${formData.isPromotion ? 'promocional' : ''} deve ser um número positivo`;
            isValid = false;
        }

        
        if (formData.isPromotion) {
            if (!formData.originalPrice?.trim()) {
                newErrors.originalPrice = 'Preço original é obrigatório em promoções';
                isValid = false;
            } else if (isNaN(originalPriceNum) || originalPriceNum <= 0) {
                newErrors.originalPrice = 'Preço original deve ser um número positivo';
                isValid = false;
            } else if (isValid && priceNum >= originalPriceNum) {
                
                newErrors.price = 'Preço promocional deve ser menor que o preço original';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const dataToSend: Partial<Product> & { imageFile?: File | null } = { // Tipagem mais específica
                id: isEditing ? initialData!.id : undefined, // Inclui ID se editando
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                isPromotion: formData.isPromotion,
                originalPrice: formData.isPromotion ? Number(formData.originalPrice) : null,
                // O backend decidiria se atualiza o status aqui ou em outra ação
                // status: initialData?.status || 'Ativo', 
                 imageFile: formData.image, // Passa o arquivo se houver um novo
            };
            console.log(`Enviando dados (${isEditing ? 'Edição' : 'Adição'}):`, dataToSend);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Retornar dados formatados (simulando resposta da API)
            const resultData = { 
                 ...dataToSend, 
                 id: dataToSend.id || `prod_${Date.now()}`,
                 status: initialData?.status || 'Ativo', // Mantém status ou define como Ativo
                 imageUrl: initialData?.imageUrl // Mantém imagem antiga se nenhuma nova foi enviada (simulação)
            };
            delete resultData.imageFile; // Remove o File object antes de passar para onSuccess

            onSuccess(resultData);

        } catch (error) {
            console.error("Erro ao salvar produto (simulado):", error);
            setErrors({ general: 'Erro ao salvar o produto. Tente novamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-40 flex justify-center items-center p-4 backdrop-blur-sm bg-white bg-opacity-75"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                    {/* Título dinâmico */}
                    <h3 className="text-lg font-semibold text-gray-800">
                        {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body - Formulário */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}

                    {/* Nome */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                        />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                    </div>

                    
                    <div className="space-y-4">
                        
                        <div className={`grid gap-4 ${formData.isPromotion ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}> 
                            
                            {formData.isPromotion && (
                                <div>
                                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Original (De:) *</label>
                                    <input
                                        type="number"
                                        id="originalPrice"
                                        name="originalPrice"
                                        step="0.01"
                                        min="0.01"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        placeholder="Ex: 29.99"
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${errors.originalPrice ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                    />
                                    {errors.originalPrice && <p className="text-red-600 text-xs mt-1">{errors.originalPrice}</p>}
                                </div>
                            )}
                            
                            <div className={formData.isPromotion ? '' : 'md:col-span-1'}> 
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="Ex: Fertilizantes"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                />
                                {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    {formData.isPromotion ? 'Preço Promocional (Por:) *' : 'Preço (R$) *'}
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    step="0.01"
                                    min="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder={formData.isPromotion ? "Ex: 15.99" : "Ex: 19.99"}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${errors.price ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                />
                                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div className="flex items-center h-10">
                                <input
                                    id="isPromotion"
                                    name="isPromotion"
                                    type="checkbox"
                                    checked={formData.isPromotion}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="isPromotion" className="ml-2 block text-sm text-gray-900">
                                    Produto em Promoção
                                </label>
                            </div>
                        </div>
                    </div>


                    {/* Imagem (Nota: A imagem não é pré-preenchida na edição) */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            {isEditing ? 'Substituir Imagem (Opcional)' : 'Imagem *'}
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                            className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 ${errors.image ? 'border border-red-500 rounded-md p-1' : ''}`}
                        />
                         {/* Exibir imagem atual na edição (placeholder) */}
                        {isEditing && initialData?.imageUrl && !formData.image && (
                            <p className="text-xs text-gray-600 mt-1">Imagem atual: <span className="italic">{initialData.imageUrl.split('/').pop()}</span> (Selecione um novo arquivo para substituir)</p>
                        )}
                        {formData.image && <p className="text-xs text-gray-600 mt-1">Nova imagem selecionada: {formData.image.name}</p>}
                        {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image}</p>}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {/* Texto do botão dinâmico */}
                            {isSubmitting ? (isEditing ? 'Salvando Alterações...' : 'Salvando...') : (isEditing ? 'Salvar Alterações' : 'Salvar Produto')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
} 