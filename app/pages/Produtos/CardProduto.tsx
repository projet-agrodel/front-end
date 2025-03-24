import Image from 'next/image';
import Link from 'next/link';
import styles from './CardProduto.module.css';

// Define the product interface
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  categoria: string;
  estoque: number;
}

interface CardProdutoProps {
  produto: Produto;
}

const CardProduto = ({ produto }: CardProdutoProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image 
          src={produto.imagem || '/placeholder-produto.jpg'} 
          alt={produto.nome}
          fill
          style={{ objectFit: 'cover' }}
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{produto.nome}</h3>
        <p className={styles.description}>{produto.descricao}</p>
        
        <div className={styles.footer}>
          <span className={styles.price}>
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </span>
          
          <button 
            className={styles.addButton}
            onClick={() => console.log(`Adicionar produto ${produto.id} ao carrinho`)}
          >
            Adicionar
          </button>
        </div>
        
        <Link href={`/produto/${produto.id}`} className={styles.detailsLink}>
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default CardProduto;