
import CategoriasDestaque from './_components/produto/CategoriasDestaque';
import ProdutosDestaque from './_components/produto/ProdutosDestaque';
import BannerCarrossel from './_components/utils/BannerCarrossel';

export default function Home() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <section className="mb-10">
          <BannerCarrossel />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
            <a href="/Produtos" className="text-green-600 hover:text-green-700">
              Ver todas
            </a>
          </div>
          <CategoriasDestaque />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Produtos em Destaque</h2>
            <a href="/Produtos" className="text-green-600 hover:text-green-700">
              Ver todos
            </a>
          </div>
          <ProdutosDestaque />
        </section>
      </div>
    </div>
  );
}