import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre a empresa */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-green-600 pb-2 mb-4">Sobre a Agrodel</h3>
            <p className="text-gray-200">
              Somos especialistas em produtos agrícolas de alta qualidade, conectando produtores 
              e consumidores através de uma plataforma moderna e eficiente.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-white hover:text-green-300 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-green-300 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-green-300 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-green-300 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-green-600 pb-2 mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-200 hover:text-white hover:underline transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-gray-200 hover:text-white hover:underline transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-200 hover:text-white hover:underline transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-200 hover:text-white hover:underline transition-colors">
                  Criar Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações legais */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-green-600 pb-2 mb-4">Informações Legais</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/politicas-privacidade" className="text-gray-200 hover:text-white hover:underline transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-uso" className="text-gray-200 hover:text-white hover:underline transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-green-600 pb-2 mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-300" />
                <span className="text-gray-200">Av. Agrodel, 1000 - Solânea, PB</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-300" />
                <span className="text-gray-200">(11) 4002-8922</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-300" />
                <a href="mailto:contato@agrodel.com.br" className="text-gray-200 hover:text-white transition-colors">
                  contato@agrodel.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Direitos autorais */}
        <div className="border-t border-green-700 mt-12 pt-6 text-center text-sm text-gray-300">
          <p>© {currentYear} Agrodel - Todos os direitos reservados</p>
          <p className="mt-2">Desenvolvido com tecnologia de ponta para o agronegócio brasileiro</p>
        </div>
      </div>
    </footer>
  );
} 