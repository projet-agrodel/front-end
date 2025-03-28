import ListarProdutos from './ListarProdutos';

export const metadata = {
  title: 'Produtos - Agrodel',
  description: 'Explore nosso catálogo de produtos agrícolas de alta qualidade',
};

export default function Produtos() {
  return (
    <div>
      <ListarProdutos/>
    </div>
  )
}
