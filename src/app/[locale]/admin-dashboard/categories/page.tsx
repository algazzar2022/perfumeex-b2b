import CategoriesClient from './_components/CategoriesClient';
import { getCategories } from './actions';

export default async function AdminCategories() {
  const categories = await getCategories();

  return (
    <div>
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
