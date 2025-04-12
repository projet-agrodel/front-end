'use client';

import { useState, useEffect } from 'react';

// Interface para os banners
interface Banner {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  link: string;
}

// Banners simulados (podem ser substituídos por API futura)
const bannersMock: Banner[] = [
  {
    id: 1,
    titulo: 'Promoção de Primavera',
    descricao: 'Até 30% de desconto em toda linha de fertilizantes',
    imagem: '',
    link: '/Produtos?categoria=Fertilizantes'
  },
  {
    id: 2,
    titulo: 'Novas Sementes',
    descricao: 'Conheça nossa nova linha de sementes orgânicas',
    imagem: '',
    link: '/Produtos?categoria=Sementes'
  },
  {
    id: 3,
    titulo: 'Ferramentas Profissionais',
    descricao: 'As melhores ferramentas para o agricultor profissional',
    imagem: '',
    link: '/Produtos?categoria=Ferramentas'
  }
];

const BannerCarrossel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de API
    const fetchBanners = () => {
      setIsLoading(true);
      // Simular atraso da API
      setTimeout(() => {
        setBanners(bannersMock);
        setIsLoading(false);
      }, 500);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    // Rotação automática dos banners a cada 5 segundos
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Função para navegar para o próximo banner
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  // Função para navegar para o banner anterior
  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg animate-pulse">
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-gray-400">Carregando banners...</span>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
      {/* Banners */}
      <div className="relative h-full w-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Se tiver imagem, exibe. Caso contrário, usa um background colorido */}
            {banner.imagem ? (
              <img
                src={banner.imagem}
                alt={banner.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h2 className="text-3xl font-bold mb-2">{banner.titulo}</h2>
                  <p className="text-xl mb-4">{banner.descricao}</p>
                  <a
                    href={banner.link}
                    className="inline-block px-6 py-2 bg-white text-green-700 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  >
                    Ver Produtos
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de navegação */}
      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores de slides */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentBanner ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarrossel; 