import { getCompanies } from './actions';
import CompaniesClient from './_components/CompaniesClient';

export default async function AdminCompanies() {
  const companies = await getCompanies();

  return (
    <div>
      <CompaniesClient initialCompanies={companies} />
    </div>
  );
}
