import { getProducts } from './actions';
import ProductsClient from './_components/ProductsClient';

export default async function AdminProducts() {
  const products = await getProducts();

  return (
    <div>
      <ProductsClient initialProducts={products} />
    </div>
  );
}
