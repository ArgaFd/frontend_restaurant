import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { menuAPI } from '../../services/api';

// Define MenuItem type locally
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
}

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Habis'>('Semua');

  // Categories from Backend
  const [categories, setCategories] = useState<any[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: 0,
    description: '',
    image_url: '',
    is_available: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        menuAPI.getAll(),
        menuAPI.getCategories()
      ]);
      setMenuItems(menuRes.data.data?.items || []);

      const catData = catRes.data.data || [];
      setCategories(catData);

      // If categories exist and no default category is set in form, set the first one
      if (catData.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: catData[0].name }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      category: categories[0]?.name || 'makanan',
      subcategory: '',
      price: 0,
      description: '',
      image_url: '',
      is_available: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory || '',
      price: item.price,
      description: item.description || '',
      image_url: item.image_url || '',
      is_available: item.is_available,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
          name === 'price' ? Number(value) : value
      };

      // Reset subcategory if category changes
      if (name === 'category') {
        newData.subcategory = '';
      }

      return newData;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (currentItem) {
        await menuAPI.update(currentItem.id, formData);
        alert('Menu berhasil diupdate');
      } else {
        await menuAPI.create(formData);
        alert('Menu baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert('Gagal menyimpan menu: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${item.name}"?`)) {
      try {
        await menuAPI.delete(item.id);
        fetchData();
      } catch (error) {
        alert('Gagal menghapus menu');
      }
    }
  };

  const currentCategoryObj = categories.find(c => c.name === formData.category);
  const availableSubCategories = currentCategoryObj?.subcategories || [];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'Semua' || item.category === selectedCategoryFilter;
    const matchesAvailability = availabilityFilter === 'Semua' ||
      (availabilityFilter === 'Tersedia' && item.is_available) ||
      (availabilityFilter === 'Habis' && !item.is_available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Header Action */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full md:w-auto">
            {(['Semua', 'Tersedia', 'Habis'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setAvailabilityFilter(mode)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${availabilityFilter === mode
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={openAddModal}
            className="w-full md:w-auto bg-indigo-600 hover:bg-black text-white px-8 py-3.5 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-100 font-bold text-[13px] uppercase tracking-widest active:scale-95"
          >
            <FiPlus className="mr-2" /> Tambah Menu
          </button>
        </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['Semua', ...categories.map(c => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${selectedCategoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-2 text-gray-500">Memuat data menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group border rounded-xl overflow-hidden hover:shadow-md transition bg-white flex flex-col">
                <div className="h-40 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                  {/* Fallback Icon */}
                  <div className="text-5xl opacity-30">
                    {categories.find(c => c.name === item.category)?.icon || '🍴'}
                  </div>

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => openEditModal(item)} className="p-2 bg-white text-indigo-600 rounded-full shadow hover:bg-indigo-50"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item)} className="p-2 bg-white text-red-600 rounded-full shadow hover:bg-red-50"><FiTrash2 /></button>
                  </div>
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-200 border-2 border-white">
                        HABIS (OFFSALE)
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{item.name}</h3>
                    <span className="font-bold text-indigo-600 font-mono text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">{item.category}</span>
                    {item.subcategory && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">{item.subcategory}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{item.description || 'Tidak ada deskripsi'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mt-auto mb-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">{currentItem ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Kategori</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    disabled={availableSubCategories.length === 0}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">(Pilih Sub-Kategori)</option>
                    {availableSubCategories.map((sc: string) => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="is_available"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">Tersedia untuk dipesan</label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto Makanan (Instagram/Web)</label>
                  <input
                    type="url"
                    name="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.image_url && (
                    <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Format+URL+Salah')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
                <button type="submit" disabled={saving} className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;
