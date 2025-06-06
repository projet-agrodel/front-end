"use client";

import { getCategories } from "@/services/categoryService";
import { Categoria } from "@/services/interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const CategoriasDestaque = () => {
  const { data: categories, isLoading } = useQuery<Categoria[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getCategories();
      return data;
    },
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories?.slice(0, 4).map((categoria) => (
        <Link href={`/produtos?categoria=${categoria.name}`} key={categoria.id}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {categoria.name}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoriasDestaque;
