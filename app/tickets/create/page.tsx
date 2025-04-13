'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TicketForm } from '@/app/_components/ticket/TicketForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/app/_components/ui/card';

export default function CreateTicketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  }) => {
    try {
      setIsSubmitting(true);
      
      // Aqui seria a implementação da API para criar o ticket
      // const response = await fetch('/api/tickets', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) throw new Error('Falha ao criar ticket');
      
      // Simular um atraso para demonstração
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a página de tickets após sucesso
      router.push('/tickets');
      router.refresh();
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      // Implementar notificação de erro aqui
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Novo Ticket</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para criar um novo ticket de suporte.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <TicketForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
} 