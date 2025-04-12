'use client';

import Link from 'next/link';

interface Categoria {
  id: number;
  nome: string;
  imagem: string;
  descricao: string;
}

// Categorias simuladas
const categoriasMock: Categoria[] = [
  {
    id: 1,
    nome: 'Fertilizantes',
    imagem: '',
    descricao: 'Nutrientes essenciais para suas plantas'
  },
  {
    id: 2,
    nome: 'Sementes',
    imagem: '',
    descricao: 'Variedades selecionadas para maior produtividade'
  },
  {
    id: 3,
    nome: 'Ferramentas',
    imagem: '',
    descricao: 'Equipamentos de qualidade para o campo'
  },
  {
    id: 4,
    nome: 'Defensivos',
    imagem: '',
    descricao: 'Proteção eficaz para suas culturas'
  }
];

const CategoriasDestaque = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categoriasMock.map((categoria) => (
        <Link href={`/produtos?categoria=${categoria.nome}`} key={categoria.id}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              {categoria.imagem ? (
                <img 
                  src={categoria.imagem} 
                  alt={categoria.nome} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">{categoria.nome}</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-1">{categoria.nome}</h3>
              <p className="text-sm text-gray-600">{categoria.descricao}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoriasDestaque; 