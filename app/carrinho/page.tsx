"use client";
 
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { CarrinhoItem } from '@/services/interfaces/interfaces'; // Importa a interface
 
 // Melhora a tipagem do componente
 const CartItemDisplay: React.FC<{ 
   item: CarrinhoItem; 
   updateQuantity: (productId: number, quantity: number) => void; 
   removeFromCart: (productId: number) => void; 
 }> = ({ item, updateQuantity, removeFromCart }) => (
   <div className="flex items-center justify-between border-b border-gray-200 py-4">
     <div className="flex items-center space-x-4">
       {/* Placeholder para imagem do produto */}
       <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          Img
       </div>
       <div>
         {/* Acessa os dados através de item.produto usando os nomes corretos */}
         <h3 className="text-lg font-semibold text-gray-800">{item.produto?.name || 'Nome Indisponível'}</h3>
         {/* Acessa o nome da categoria corretamente */}
         <p className="text-sm text-gray-500">{item.produto?.category?.name || 'Categoria Indisponível'}</p>
         <p className="text-green-600 font-semibold">
           {/* Usa item.produto.price */}
           R$ {item.produto?.price?.toFixed(2).replace('.', ',') || 'Preço Indisponível'}
         </p>
       </div>
     </div>
     <div className="flex items-center space-x-4">
       <div className="flex items-center border border-gray-300 rounded">
         <button
           // Passa item.produto_id
           onClick={() => updateQuantity(item.produto_id, item.quantity - 1)}
           className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l transition-colors duration-200"
           aria-label="Diminuir quantidade"
           disabled={item.quantity <= 1} // Desabilita se a quantidade for 1
         >
           -
         </button>
         <span className="px-4 py-1 border-l border-r border-gray-300 font-medium text-gray-800">
           {item.quantity}
         </span>
         <button
           // Passa item.produto_id
           onClick={() => updateQuantity(item.produto_id, item.quantity + 1)}
           className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r transition-colors duration-200"
           aria-label="Aumentar quantidade"
         >
           +
         </button>
       </div>
       <p className="font-semibold w-24 text-right">
         {/* Calcula subtotal usando item.produto.price */}
         R$ {((item.produto?.price || 0) * item.quantity).toFixed(2).replace('.', ',')}
       </p>
       <button
         // Passa item.produto_id
         onClick={() => removeFromCart(item.produto_id)}
         className="text-red-500 hover:text-red-700 transition-colors duration-200"
         aria-label="Remover item"
       >
         Remover
       </button>
     </div>
   </div>
 );
 
 // Componente principal da página do carrinho
 const CarrinhoPage = () => {
   const { cartItems, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
 
   return (
     <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold text-gray-800 mb-6">Seu Carrinho</h1>
 
       {cartItems.length === 0 ? (
         <div className="text-center py-10 bg-white rounded-lg shadow">
           <p className="text-xl text-gray-600 mb-4">Seu carrinho está vazio.</p>
           <Link href="/produtos">
             <span className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200 inline-block">
               Continuar Comprando
             </span>
           </Link>
         </div>
       ) : (
         <div className="bg-white rounded-lg shadow p-6">
           {/* Cabeçalho da tabela de itens */}
           <div className="hidden md:flex items-center justify-between border-b border-gray-300 pb-3 mb-4 font-semibold text-gray-600 text-sm">
             <span className="w-1/2">Produto</span>
             <span className="w-1/4 text-center">Quantidade</span>
             <span className="w-1/4 text-right">Subtotal</span>
             <span className="w-16 text-right"></span> {/* Espaço para botão remover */}
           </div>
 
           {/* Lista de itens */}
           {cartItems.map(item => (
             <CartItemDisplay
               key={item.produto_id}
               item={item}
               updateQuantity={updateQuantity}
               removeFromCart={removeFromCart}
             />
           ))}
 
           {/* Resumo do carrinho */}
           <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
             <button
               onClick={clearCart}
               className="text-gray-500 hover:text-red-600 font-medium mb-4 md:mb-0 transition-colors duration-200"
             >
               Limpar Carrinho
             </button>
             <div className="text-right">
               <p className="text-lg text-gray-700 mb-1">
                 Total de Itens: <span className="font-semibold">{totalItems}</span>
               </p>
               <p className="text-2xl font-bold text-gray-800 mb-4">
                 Total: <span className="text-green-600">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
               </p>
               <button
                 className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded transition-colors duration-200 shadow hover:shadow-md"
                 // onClick={() => alert('Implementar checkout!')} // Ação de finalizar compra
               >
                 Finalizar Compra
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default CarrinhoPage; 