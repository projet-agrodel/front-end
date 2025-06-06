'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../services/categoryService';
import { Button } from '../../_components/ui/button';
import { Input } from '../../_components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../_components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../_components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../_components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Categoria } from '@/services/interfaces/interfaces';

const categoryFormSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function AdminCategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: '',
        },
    });

    // Debounce para o termo de busca
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Query para buscar as categorias
    const { data: categories, isLoading, error } = useQuery<Categoria[]>({
        queryKey: ['categories', debouncedSearchTerm],
        queryFn: async () => {
            const data = await getCategories(debouncedSearchTerm);
            return data;
        },
    });

    // Mutation para criar categoria
    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsCreateDialogOpen(false);
            form.reset();
            toast.success('Categoria criada com sucesso!');
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Erro ao criar categoria');
        },
    });

    // Mutation para atualizar categoria
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CategoryFormValues }) => 
            updateCategory(id.toString(), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setEditingCategory(null);
            form.reset();
            toast.success('Categoria atualizada com sucesso!');
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar categoria');
        },
    });

    // Mutation para deletar categoria
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Categoria excluída com sucesso!');
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Erro ao excluir categoria');
        },
    });

    const handleCreateSubmit = (values: CategoryFormValues) => {
        createMutation.mutate(values);
    };

    const handleEditSubmit = (values: CategoryFormValues) => {
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data: values });
        }
    };

    const handleDelete = (category: Categoria) => {
        if (window.confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
            deleteMutation.mutate(category.id.toString());
        }
    };

    const handleEdit = (category: Categoria) => {
        setEditingCategory(category);
        form.reset({
            name: category.name,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                <p className="ml-4 text-lg text-gray-600">Carregando categorias...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Categorias</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Categoria
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Nova Categoria</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Criar Categoria
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Pesquisar categorias por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                            <p className="font-semibold">Erro ao Carregar Categorias</p>
                            <p className="text-sm">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && !error && (!categories || categories.length === 0) && (
                <div className="text-center py-10 px-6 bg-white shadow-xl rounded-lg">
                    <p className="text-gray-500">Nenhuma categoria encontrada</p>
                </div>
            )}

            {categories && categories.length > 0 && (
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Produtos</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>{category.productCount || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(category)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
} 