import ListarProdutos from "./pages/Produtos/ListarProdutos";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Agrodel</h1>
          <p className={styles.subtitle}>Produtos agrícolas de qualidade para o seu negócio</p>
        </header>
        
        <section className={styles.productSection}>
          <ListarProdutos />
        </section>
      </div>
    </main>
  );
}
