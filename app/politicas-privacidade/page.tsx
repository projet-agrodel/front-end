import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";

export default function PoliticasPrivacidade({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const defaultTab = searchParams.tab === "termos" ? "termos" : "privacidade";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-800">Políticas de Privacidade e Termos de Uso</h1>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="privacidade">Política de Privacidade</TabsTrigger>
          <TabsTrigger value="termos">Termos de Uso</TabsTrigger>
        </TabsList>
        
        <TabsContent value="privacidade" className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Política de Privacidade</h2>
            <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">1. Informações Coletadas</h3>
                <p>A Agrodel coleta informações pessoais como nome, endereço, e-mail, telefone e dados de pagamento para fornecer nossos serviços. Podemos também coletar informações sobre sua localização, dispositivo e comportamento de navegação para melhorar sua experiência.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">2. Uso das Informações</h3>
                <p>Utilizamos suas informações para processar pedidos, melhorar nossos serviços, personalizar sua experiência, enviar comunicações sobre produtos e serviços e cumprir obrigações legais.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">3. Compartilhamento de Dados</h3>
                <p>Podemos compartilhar seus dados com parceiros de negócios, prestadores de serviços e autoridades quando necessário para a execução dos serviços ou por obrigação legal. Não vendemos suas informações pessoais a terceiros.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">4. Segurança</h3>
                <p>Implementamos medidas técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">5. Seus Direitos</h3>
                <p>Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de seus dados pessoais. Para exercer esses direitos, entre em contato conosco através dos canais disponibilizados no final desta política.</p>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="termos" className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Termos de Uso</h2>
            <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">1. Aceitação dos Termos</h3>
                <p>Ao acessar ou utilizar a plataforma Agrodel, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">2. Cadastro e Conta</h3>
                <p>Para utilizar determinados recursos da plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">3. Uso da Plataforma</h3>
                <p>Você concorda em utilizar a plataforma apenas para fins legais e de acordo com estes Termos. Você não deve utilizar a plataforma de maneira que possa danificar, desativar, sobrecarregar ou comprometer nossos sistemas.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">4. Propriedade Intelectual</h3>
                <p>Todo o conteúdo disponível na plataforma, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e software, é propriedade da Agrodel ou de seus fornecedores e está protegido por leis de propriedade intelectual.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">5. Limitação de Responsabilidade</h3>
                <p>A Agrodel não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequentes resultantes do uso ou incapacidade de uso de nossos serviços.</p>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">Se tiver dúvidas sobre nossas políticas, entre em contato pelo e-mail: <a href="mailto:contato@agrodel.com.br" className="text-green-700 hover:underline">contato@agrodel.com.br</a></p>
      </div>
    </div>
  );
} 