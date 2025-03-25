import Link from 'next/link';

// Define the product interface
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  categoria: string;
  estoque: number;
}

interface CardProdutoProps {
  produto: Produto;
}

// Função para obter uma cor baseada na categoria do produto
const getCategoryColor = (categoria: string): string => {
  const colors: Record<string, string> = {
    'Fertilizantes': 'bg-purple-600',
    'Sementes': 'bg-yellow-500',
    'Ferramentas': 'bg-blue-500',
    'Defensivos': 'bg-red-500',
    'Substratos': 'bg-amber-600'
  };
  
  return colors[categoria] || 'bg-gray-400';
};

const CardProduto = ({ produto }: CardProdutoProps) => {
  const categoryColor = getCategoryColor(produto.categoria);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className={`relative w-full h-48 flex items-center justify-center ${categoryColor}`}>
        <span className="text-white font-bold text-xl">{produto.categoria}</span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{produto.nome}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{produto.descricao}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-green-600 font-bold text-2xl">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </span>
          
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-3xl text-xt transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            onClick={() => console.log(`Adicionar produto ${produto.id} ao carrinho`)}
          >
            Adicionar
          </button>
        </div>
        
        <Link href={`/produto/${produto.id}`} className="text-green-600 hover:text-primary-700 text-base mt-2 inline-block underline">
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default CardProduto;