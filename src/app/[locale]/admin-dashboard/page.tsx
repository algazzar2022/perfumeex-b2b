import { Building2, Tags, PackageSearch, Star } from 'lucide-react';
import Link from 'next/link';

export default async function AdminHome(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const stats = [
    { name: 'الشركات', icon: Building2, href: `/${locale}/admin-dashboard/companies`, color: 'from-blue-500 to-cyan-500' },
    { name: 'الأقسام', icon: Tags, href: `/${locale}/admin-dashboard/categories`, color: 'from-purple-500 to-pink-500' },
    { name: 'الرعاة', icon: Star, href: `/${locale}/admin-dashboard/sponsors`, color: 'from-amber-500 to-orange-500' },
    { name: 'المنتجات', icon: PackageSearch, href: `/${locale}/admin-dashboard/products`, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">مرحباً بك في لوحة التحكم 👋</h1>
        <p className="text-gray-400">يمكنك إدارة الموقع بالكامل من خلال الأقسام التالية.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold relative z-10">{stat.name}</h3>
            <p className="text-gray-400 text-sm mt-2 relative z-10">إدارة وتعديل</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
