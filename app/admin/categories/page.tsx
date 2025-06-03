'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  PlusCircle, Edit, Trash2, PackageSearch, X, Search as SearchIcon, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  PaginatedCategoriesResponse
} from '@/services/categoryService'; // Ajuste o caminho se necessário
import { useSession } from 'next-auth/react'; // Para autenticação

// --- Mock de Componentes UI (Mantenha ou substitua pelos seus reais) ---
const Button = ({ onClick, children, variant, size, className, disabled, title, type }: any) => 
    <button onClick={onClick} type={type || 'button'} title={title} disabled={disabled} className={`px-3 py-2 text-sm rounded-md font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variant === 'destructive' ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300' : variant === 'outline' ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'} ${className}`}>{children}</button>;
const Table = ({ children, className }: any) => <div className="flow-root"><div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"><div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"><table className={`min-w-full divide-y divide-gray-300 bg-white shadow-sm rounded-lg ${className}`}>{children}</table></div></div></div>;
const TableHeader = ({ children }: any) => <thead className="bg-gray-50">{children}</thead>;
const TableRow = ({ children, className }: any) => <tr className={className}>{children}</tr>;
const TableHead = ({ children, className }: any) => <th scope="col" className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 ${className}`}>{children}</th>;
const TableBody = ({ children }: any) => <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
const TableCell = ({ children, className }: any) => <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700 sm:pl-6 ${className}`}>{children}</td>;
const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
    if (!open) return null;
    return <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-opacity duration-300 ease-in-out opacity-100" onClick={() => onOpenChange(false)}>{children}</div>;
};
const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 ${className}`} onClick={(e) => e.stopPropagation()}>{children}</div>;
const DialogHeader = ({ children }: any) => <div className="mb-4 flex flex-col gap-y-1">{children}</div>;
const DialogTitle = ({ children }: any) => <h2 className="text-xl font-semibold text-gray-900">{children}</h2>;
const DialogDescription = ({ children }: any) => <p className="text-sm text-gray-500">{children}</p>;
const DialogFooter = ({ children, className }: any) => <div className={`mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 ${className}`}>{children}</div>;
const Input = (props: any) => <input {...props} className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${props.className}`} />;
const Textarea = (props: any) => <textarea {...props} rows={3} className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${props.className}`} />;
const Label = (props: any) => <label {...props} className={`block text-sm font-medium leading-6 text-gray-900 ${props.className}`} />;
// --- Fim dos Mocks de Componentes UI ---

const ITEMS_PER_PAGE = 10;

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const fetchCategories = useCallback(async () => {
    if (!session?.accessToken) {
        setError("Autenticação necessária para visualizar categorias.");
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data: PaginatedCategoriesResponse = await getCategories(currentPage, ITEMS_PER_PAGE, debouncedSearchTerm);
      setCategories(data.categories || []);
      setTotalPages(data.pages || 1);
      setTotalCategories(data.total || 0);
      setCurrentPage(data.current_page || 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao buscar categorias.';
      setError(errorMessage);
      console.error(err);
      setCategories([]); // Limpa categorias em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [session, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
    } else {
      setCurrentCategory({});
      setCategoryName('');
      setCategoryDescription('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setCurrentCategory(null);
        setCategoryName('');
        setCategoryDescription('');
    }, 300); 
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('O nome da categoria é obrigatório.');
      return;
    }
    if (!session?.accessToken) {
        setError("Autenticação necessária para modificar categorias.");
        return;
    }
    
    setIsLoading(true);
    try {
      const payload = { name: categoryName, description: categoryDescription };
      if (currentCategory && currentCategory.id) {
        const result = await updateCategory(currentCategory.id as string, payload);
        // setCategories(prev => prev.map(cat => cat.id === currentCategory.id ? result.category : cat)); // Opcional: atualizar localmente ou refetch
      } else {
        const result = await createCategory(payload);
        // setCategories(prev => [result.category, ...prev]); // Opcional: atualizar localmente ou refetch
      }
      await fetchCategories(); // Refetch para garantir consistência e paginação
      handleCloseModal();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Falha ao salvar categoria.';
        setError(errorMessage); // Idealmente, mostrar este erro no modal ou como toast
        alert(`Erro: ${errorMessage}`); // Simples alerta por enquanto
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) return;
    if (!session?.accessToken) {
        setError("Autenticação necessária para excluir categorias.");
        return;
    }

    setIsLoading(true);
    try {
      await deleteCategory(categoryId);
      // Se a categoria excluída estiver na página atual, e for a última da página,
      // talvez seja necessário ajustar a currentPage para a anterior.
      // Por simplicidade, apenas refetch.
      await fetchCategories(); 
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Falha ao excluir categoria.';
        setError(errorMessage);
        alert(`Erro: ${errorMessage}`);
        console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Gerenciamento de Categorias</h1>
            <p className="mt-1 text-sm leading-6 text-gray-600">Adicione, edite ou remova categorias de produtos da sua loja.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-green-600 hover:bg-green-700 text-white shrink-0 w-full sm:w-auto">
          <PlusCircle size={20} className="-ml-0.5 mr-1.5" />
          Nova Categoria
        </Button>
      </div>
      
      <div className="mt-6 mb-4">
        <Input 
            type="search"
            placeholder="Buscar categorias por nome..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md"
        />
      </div>

      {isLoading && !error && categories.length === 0 && <p className="text-center text-gray-600 py-8">Carregando categorias...</p>}
      {error && <p className="text-center text-red-500 py-8">Erro ao carregar categorias: {error}. Tente recarregar a página.</p>}

      {!isLoading && !error && categories.length === 0 && (
         <div className="text-center text-gray-500 py-16">
            <PackageSearch size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">Nenhuma categoria encontrada</h3>
            <p className="text-sm text-gray-500 mt-1">
                {debouncedSearchTerm ? `Nenhum resultado para "${debouncedSearchTerm}".` : 'Comece adicionando uma nova categoria.'}
            </p>
         </div>
      )}

      {categories.length > 0 && (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Produtos</TableHead>
                    <TableHead><span className="sr-only">Ações</span></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={category.name}>{category.name}</TableCell>
                    <TableCell className="max-w-sm truncate hidden sm:table-cell" title={category.description || ''}>{category.description || '-'}</TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {category.productCount === undefined ? 'N/A' : category.productCount}
                        </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(category)} title="Editar Categoria">
                        <Edit size={16} /> <span className="sr-only sm:not-sr-only sm:ml-1">Editar</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id as string)} title="Excluir Categoria">
                        <Trash2 size={16} /> <span className="sr-only sm:not-sr-only sm:ml-1">Excluir</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {/* Paginação */} 
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                        {' '}a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCategories)}</span>
                        {' '}de <span className="font-medium">{totalCategories}</span> resultados
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                            variant="outline" 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft size={18} className="mr-1"/> Anterior
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages || isLoading}
                        >
                            Próxima <ChevronRight size={18} className="ml-1"/>
                        </Button>
                    </div>
                </div>
            )}
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <form onSubmit={handleSubmitCategory} className="space-y-6">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle>{currentCategory?.id ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
                            <DialogDescription>
                            {currentCategory?.id ? 'Modifique os detalhes da categoria abaixo.' : 'Preencha os detalhes para criar uma nova categoria.'}
                            </DialogDescription>
                        </div>
                        <Button type="button" variant="outline" onClick={handleCloseModal} className="p-2 -mt-2 -mr-2" title="Fechar" disabled={isLoading}>
                            <X size={20} />
                        </Button>
                    </div>
                </DialogHeader>
              
              <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <div className="mt-2">
                    <Input 
                        id="name" 
                        name="name"
                        value={categoryName} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)} 
                        placeholder="Ex: Fertilizantes Premium"
                        required
                        aria-describedby="name-description"
                        disabled={isLoading}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500" id="name-description">
                    O nome deve ser único e descritivo.
                </p>
              </div>

              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <div className="mt-2">
                    <Textarea 
                        id="description" 
                        name="description"
                        value={categoryDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCategoryDescription(e.target.value)} 
                        placeholder="Ex: Produtos para melhorar a saúde do solo e o crescimento das plantas."
                        aria-describedby="description-help"
                        disabled={isLoading}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500" id="description-help">
                    Forneça uma breve descrição da categoria.
                </p>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || !categoryName.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? (currentCategory?.id ? 'Salvando Alterações...' : 'Adicionando Categoria...') : (currentCategory?.id ? 'Salvar Alterações' : 'Adicionar Categoria')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
} 