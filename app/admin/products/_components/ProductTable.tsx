'use client';

import React from 'react';
import Image from 'next/image'; // Usar para imagens futuramente
import { Edit, Trash2 } from 'lucide-react'; // Importar ícone de edição e Trash2

// Reutilizar a interface Product (idealmente, importar de um local compartilhado)
interface Product { 
  id: string;
  name: string;
  description: string;
  price: number; // Preço de venda
  originalPrice?: number | null;
  category: string;
  imageUrl?: string; 
  status: 'Ativo' | 'Inativo';
  isPromotion: boolean;
}

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void; // Alterado para passar o objeto Product inteiro
    onDelete: (productId: string) => void; // Adicionar prop onDelete
}

// Função auxiliar para formatar moeda
const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Componente da Tabela de Produtos
export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {

    const statusClasses: { [key in Product['status']]: string } = {
        'Ativo': 'bg-green-100 text-green-800',
        'Inativo': 'bg-red-100 text-red-800',
    };
    const getStatusClass = (status: Product['status']) => statusClasses[status] || 'bg-gray-100 text-gray-800';

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* Imagem (opcional) */}
                        {/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Imagem</th> */}
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        {/* Ações */}
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th> 
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            {/* Imagem (opcional) */}
                            {/* <td className="px-4 py-3 whitespace-nowrap">
                                <Image src={product.imageUrl || '/placeholder-image.png'} alt={product.name} width={40} height={40} className="rounded" />
                            </td> */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                                {product.isPromotion && product.originalPrice && (
                                    <span className="text-xs text-red-500 line-through mr-1">
                                        {formatCurrency(product.originalPrice)}
                                    </span>
                                )}
                                <span className={product.isPromotion ? "font-bold text-green-600" : ""}>
                                     {formatCurrency(product.price)}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(product.status)}`}>
                                    {product.status}
                                </span>
                            </td>
                            {/* Célula de Ações com botão Excluir */}
                             <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                <button 
                                    onClick={() => onEdit(product)}
                                    className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100 transition-colors"
                                    title="Editar Produto"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => onDelete(product.id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                                    title="Excluir Produto"
                                >
                                    <Trash2 size={18} />
                                </button> 
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            {/* Atualizar colSpan para 5 por causa da coluna Ações */}
                            <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 italic">
                                Nenhum produto encontrado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
} 