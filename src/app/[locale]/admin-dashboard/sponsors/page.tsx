import { getSponsors } from './actions';
import SponsorsClient from './_components/SponsorsClient';

export default async function AdminSponsors() {
  const sponsors = await getSponsors();

  return (
    <div>
      <SponsorsClient initialSponsors={sponsors} />
    </div>
  );
}
