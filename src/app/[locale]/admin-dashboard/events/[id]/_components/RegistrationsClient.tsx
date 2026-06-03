'use client';

import { useState, useMemo } from 'react';
import { EventRegistration } from '@prisma/client';
import { FileText, Search, Download, Trash2, Edit, X, Loader2 } from 'lucide-react';
import { deleteRegistration, updateRegistration } from '../../actions';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function RegistrationsClient({ initialRegistrations }: { initialRegistrations: EventRegistration[] }) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  const [editingReg, setEditingReg] = useState<EventRegistration | null>(null);
  const [formData, setFormData] = useState({
    name: '', brandName: '', location: '', phone: '', whatsapp: '', experienceYears: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter(reg => reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || reg.brandName.toLowerCase().includes(searchTerm.toLowerCase()) || reg.phone.includes(searchTerm))
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [registrations, searchTerm, sortOrder]);

  const handleExportExcel = () => {
    const dataToExport = filteredRegistrations.map(reg => ({
      'الاسم': reg.name,
      'اسم البراند / الشركة': reg.brandName,
      'المدينة / المكان': reg.location,
      'رقم الاتصال': reg.phone,
      'رقم الواتساب': reg.whatsapp,
      'سنوات الخبرة': reg.experienceYears,
      'تاريخ التسجيل': new Date(reg.createdAt).toLocaleString('ar-EG')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المسجلين');
    
    // Auto-size columns roughly
    const maxWidths = [25, 25, 20, 20, 20, 15, 20];
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));
    
    XLSX.writeFile(workbook, `registrations_${new Date().getTime()}.xlsx`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المسجل؟')) {
      try {
        await deleteRegistration(id);
        setRegistrations(registrations.filter(r => r.id !== id));
        router.refresh();
      } catch (e) {
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleEdit = (reg: EventRegistration) => {
    setEditingReg(reg);
    setFormData({
      name: reg.name,
      brandName: reg.brandName,
      location: reg.location,
      phone: reg.phone,
      whatsapp: reg.whatsapp,
      experienceYears: reg.experienceYears.toString()
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;
    setIsLoading(true);
    try {
      await updateRegistration(editingReg.id, {
        name: formData.name,
        brandName: formData.brandName,
        location: formData.location,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        experienceYears: parseInt(formData.experienceYears) || 0
      });
      setRegistrations(registrations.map(r => r.id === editingReg.id ? { ...r, ...formData, experienceYears: parseInt(formData.experienceYears) } : r));
      setEditingReg(null);
      router.refresh();
    } catch (e) {
      alert('حدث خطأ أثناء التحديث');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="بحث بالاسم أو الهاتف..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pr-10 pl-4 focus:border-emerald-500 outline-none"
            />
          </div>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            className="bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none"
          >
            <option value="desc">الأحدث أولاً</option>
            <option value="asc">الأقدم أولاً</option>
          </select>
        </div>
        
        <button 
          onClick={handleExportExcel}
          className="w-full md:w-auto bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-bold border border-emerald-500/20"
        >
          <Download size={18} /> تحميل Excel
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-right text-gray-400 bg-[#1a1a1a]">
                <th className="p-4 font-medium">الاسم</th>
                <th className="p-4 font-medium">البراند</th>
                <th className="p-4 font-medium">المكان</th>
                <th className="p-4 font-medium">رقم الهاتف</th>
                <th className="p-4 font-medium">واتساب</th>
                <th className="p-4 font-medium">سنوات الخبرة</th>
                <th className="p-4 font-medium">تاريخ التسجيل</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-emerald-400">{reg.name}</td>
                  <td className="p-4 text-blue-300">{reg.brandName}</td>
                  <td className="p-4">{reg.location}</td>
                  <td className="p-4" dir="ltr">{reg.phone}</td>
                  <td className="p-4" dir="ltr">{reg.whatsapp}</td>
                  <td className="p-4 font-medium text-orange-400">{reg.experienceYears}</td>
                  <td className="p-4 text-sm text-gray-400">{new Date(reg.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(reg)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20" title="تعديل"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(reg.id)} className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20" title="حذف"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRegistrations.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">لا يوجد أي مسجلين يطابقون بحثك</p>
          </div>
        )}
      </div>

      {editingReg && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold">تعديل بيانات مسجل</h2>
              <button onClick={() => setEditingReg(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">البراند / الشركة</label>
                  <input required type="text" value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">المدينة / المكان</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">رقم الهاتف</label>
                  <input required type="text" value={formData.phone} dir="ltr" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">رقم الواتساب</label>
                  <input required type="text" value={formData.whatsapp} dir="ltr" onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">سنوات الخبرة</label>
                <input required type="number" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button type="button" onClick={() => setEditingReg(null)} className="px-5 py-2 rounded-lg border border-white/10 hover:bg-white/5">إلغاء</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center gap-2">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'تحديث البيانات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
