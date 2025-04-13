import { redirect } from 'next/navigation';

export default function TermosUso() {
  redirect('/politicas-privacidade?tab=termos');
  return null;
} 