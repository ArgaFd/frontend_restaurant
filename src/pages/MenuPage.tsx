import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuAPI, type MenuItem } from '../services/api';
import { CartSidebar, CheckoutModal, usePayment } from '../components/menu';
import { FiSearch, FiCheckCircle, FiXCircle, FiGrid, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { APP_CONFIG } from '../config';
import logo from '../assets/Logo.svg';

interface CartItem {
  id: number;
  quantity: number;
}

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(parseInt(tableNumber || '1'));
  const [activeCategory, setActiveCategory] = useState('semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'manual'>('qris');
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'onsale' | 'offsale'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([{ id: 'semua', name: 'Semua Menu', icon: '🍽️' }]);

  // Use the payment hook
  const { isProcessing, checkout } = usePayment({
    onSuccess: (result) => {
      if (!result.redirectUrl) {
        // Only reset for manual payment (QRIS will redirect)
        alert(result.message);
        setCart([]);
        setShowCart(false);
        setShowCheckout(false);
        setCustomerName('');
      }
    },
    onError: (error) => {
      alert(error);
    },
  });

  // Placeholder categories will be replaced by backend data

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        menuAPI.getAll(),
        menuAPI.getCategories()
      ]);

      if (menuRes.data.success) {
        setMenuItems(menuRes.data.data.items);
      }

      if (catRes.data.success) {
        const backendCats = catRes.data.data.map((c: any) => ({
          id: c.name,
          name: c.name.charAt(0).toUpperCase() + c.name.slice(1),
          icon: c.icon || '🍴'
        }));
        setCategories([{ id: 'semua', name: 'Semua Menu', icon: '🍽️' }, ...backendCats]);
      }
    } catch (error) {
      console.error('Failed to load menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'semua' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'onsale' && item.is_available) ||
      (availabilityFilter === 'offsale' && !item.is_available);

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const addToCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: itemId, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== itemId);
    });
  };

  const totalAmount = cart.reduce((total, cartItem) => {
    const item = menuItems.find(i => i.id === cartItem.id);
    return total + (item ? item.price * cartItem.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    await checkout({
      tableNumber: selectedTableNumber,
      customerName,
      items: cart,
      paymentMethod,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      <header className="bg-white px-8 h-20 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 bg-gray-100 rounded-lg">
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Logo" className="w-full h-full object-contain transform scale-125" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              {APP_CONFIG.NAME.split(' ')[0]}
              <span className="text-indigo-600"> {APP_CONFIG.NAME.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            Meja {selectedTableNumber}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">Total Pesanan</span>
            <span className="text-sm font-bold text-gray-900">Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="h-12 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-black transition-all group relative"
          >
            <FiShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black h-5 w-5 rounded-lg flex items-center justify-center border-2 border-white pointer-events-none">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Desktop Always, Mobile Overlay */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:relative lg:translate-x-0 flex flex-col`}>
          <div className="p-8 lg:hidden flex justify-end">
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            {/* Search */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Cari Menu</label>
              <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Ketik nama menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-sm transition-all"
                />
              </div>
            </div>

            {/* Filter Status */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Status Ketersediaan</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'all', label: 'Semua Status', icon: <FiGrid /> },
                  { id: 'onsale', label: 'Lagi Sale', icon: <FiCheckCircle />, color: 'emerald' },
                  { id: 'offsale', label: 'Offsale', icon: <FiXCircle />, color: 'red' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAvailabilityFilter(f.id as any)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all ${availabilityFilter === f.id
                      ? `bg-${f.color || 'indigo'}-50 text-${f.color || 'indigo'}-600`
                      : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-sm">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Kategori</label>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all relative group ${activeCategory === category.id
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {activeCategory === category.id && (
                      <div className="absolute left-0 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
                    )}
                    <span className="text-xl opacity-80">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4 px-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm border-2 border-white shadow-sm">
                🪑
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-900 truncate">Box #{selectedTableNumber}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ready for order</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {categories.find(c => c.id === activeCategory)?.name || 'Menu List'}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  {filteredItems.length} Produk ditemukan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredItems.map(item => {
                const cartItem = cart.find(cartItem => cartItem.id === item.id);
                const quantity = cartItem?.quantity || 0;

                return (
                  <div key={item.id} className={`group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!item.is_available ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                    <div className="h-44 bg-gray-50 relative overflow-hidden flex items-center justify-center group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-indigo-600/5 transition-all">
                      {/* Fallback Icon */}
                      <div className="text-6xl">
                        {categories.find(c => c.id === item.category)?.icon || '🍴'}
                      </div>

                      {/* Menu Image */}
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover z-10"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${item.is_available ? 'bg-emerald-50 text-emerald-600 border-white' : 'bg-red-50 text-red-600 border-white'}`}>
                        {item.is_available ? 'Lagi Sale' : 'Offsale'}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-sm font-black text-indigo-600 tracking-tight">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed h-8">
                          {item.description || "Nikmati hidangan lezat kami dengan cita rasa autentik dan bahan berkualitas tinggi."}
                        </p>
                      </div>

                      <div className="pt-2 mt-auto border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Sub-Total</span>
                          <span className="text-sm font-black text-gray-900">Rp {(item.price * (quantity || 1)).toLocaleString('id-ID')}</span>
                        </div>

                        {item.is_available ? (
                          quantity > 0 ? (
                            <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner border border-gray-100">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-white rounded-lg transition-all font-black"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-black text-xs text-gray-900">
                                {quantity}
                              </span>
                              <button
                                onClick={() => addToCart(item.id)}
                                className="w-8 h-8 flex items-center justify-center text-emerald-500 hover:bg-white rounded-lg transition-all font-black"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-indigo-100"
                            >
                              Add Order
                            </button>
                          )
                        ) : (
                          <div className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-[11px] uppercase tracking-widest cursor-not-allowed border border-gray-200">
                            Sold Out
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-20 text-center space-y-6">
                <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200 text-6xl">
                  {activeCategory === 'semua' ? '🔍' : categories.find(c => c.id === activeCategory)?.icon || '📂'}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeCategory === 'semua' ? 'Menu tidak ditemukan' : `Belum ada menu di ${categories.find(c => c.id === activeCategory)?.name || 'kategori ini'}`}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">
                    {availabilityFilter === 'offsale'
                      ? "Tidak ada item offsale di kategori ini."
                      : "Kami akan segera menambahkan item lezat di kategori ini!"}
                  </p>
                </div>
                {(searchTerm || activeCategory !== 'semua' || availabilityFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchTerm(''); setActiveCategory('semua'); setAvailabilityFilter('all'); }}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                  >
                    Reset Semua Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        menuItems={menuItems}
        tableNumber={tableNumber}
        onRemoveFromCart={removeFromCart}
        onCheckout={() => setShowCheckout(true)}
        totalAmount={totalAmount}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        menuItems={menuItems}
        totalAmount={totalAmount}
        tableNumber={selectedTableNumber}
        onTableNumberChange={setSelectedTableNumber}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        onCheckout={handleCheckout}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default MenuPage;
