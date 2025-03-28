import ListarProdutos from './ListarProdutos';

export const metadata = {
  title: 'Produtos - Agrodel',
  description: 'Explore nosso catálogo de produtos agrícolas de alta qualidade',
};

export default function ProdutosRedirectPage() {
  return (
    <div>
      <ListarProdutos/>
    </div>
  )
}
