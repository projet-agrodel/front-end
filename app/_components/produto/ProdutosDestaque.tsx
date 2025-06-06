"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Produto } from "@/services/interfaces/interfaces";
import { getAdminProducts } from "@/services/adminProductService";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const ProdutosDestaque = () => {
  const { data: session } = useSession();
  const { data: produtos, isLoading } = useQuery<Produto[]>({
    queryKey: ["produtos"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/all`);
      const data = await response.json();
      
      return data
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md animate-pulse"
          >
            <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {produtos?.slice(0, 4).map((produto) => (
        <Link href={`/produtos/${produto.id}`} key={produto.id}>
          <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              {produto.imageUrl ? (
                <img
                  src={produto.imageUrl}
                  alt={produto.name}
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400">img indisponível</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {produto.name}
            </h3>
            <p className="text-green-600 font-bold mb-2">
              R$ {produto.price.toFixed(2)}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {produto.category?.name}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Destaque
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProdutosDestaque;
