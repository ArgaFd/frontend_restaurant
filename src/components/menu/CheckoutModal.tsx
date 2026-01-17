import { type MenuItem } from '../../services/api';

interface CartItem {
    id: number;
    quantity: number;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    menuItems: MenuItem[];
    totalAmount: number;
    tableNumber: number;
    onTableNumberChange: (value: number) => void;
    customerName: string;
    onCustomerNameChange: (value: string) => void;
    paymentMethod: 'qris' | 'manual';
    onPaymentMethodChange: (method: 'qris' | 'manual') => void;
    onCheckout: () => void;
    isProcessing?: boolean;
}

const CheckoutModal = ({
    isOpen,
    onClose,
    cart,
    menuItems,
    totalAmount,
    tableNumber,
    onTableNumberChange,
    customerName,
    onCustomerNameChange,
    paymentMethod,
    onPaymentMethodChange,
    onCheckout,
    isProcessing = false,
}: CheckoutModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Checkout <span className="text-indigo-600">Order</span></h3>

                                <div className="mb-8 space-y-5">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                            Nomor Meja
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={tableNumber}
                                            onChange={(e) => onTableNumberChange(parseInt(e.target.value || '1'))}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-sm transition-all shadow-inner"
                                            placeholder="Ex: 12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                            Nama Customer
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => onCustomerNameChange(e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-sm transition-all shadow-inner"
                                            placeholder="Ketik nama Anda..."
                                        />
                                    </div>
                                </div>

                                <div className="mb-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-50">
                                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Ringkasan Pesanan</h4>
                                    <div className="space-y-3">
                                        {cart.map(cartItem => {
                                            const menuItem = menuItems.find(item => item.id === cartItem.id);
                                            if (!menuItem) return null;

                                            return (
                                                <div key={cartItem.id} className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-gray-700">{menuItem.name} <span className="text-gray-400 ml-1">x{cartItem.quantity}</span></span>
                                                    <span className="font-bold text-gray-900">Rp {(menuItem.price * cartItem.quantity).toLocaleString('id-ID')}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-indigo-100/50">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bayar</span>
                                            <span className="text-xl font-black text-indigo-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Metode Pembayaran</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onPaymentMethodChange('qris')}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all relative ${paymentMethod === 'qris'
                                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <div className={`font-bold text-sm ${paymentMethod === 'qris' ? 'text-indigo-600' : 'text-gray-900'}`}>Digital Payment</div>
                                            <div className="text-[10px] text-gray-400 mt-1 font-medium">QRIS, GoPay, DLL.</div>
                                            {paymentMethod === 'qris' && <div className="absolute top-3 right-3 h-2 w-2 bg-indigo-600 rounded-full animate-pulse" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onPaymentMethodChange('manual')}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all relative ${paymentMethod === 'manual'
                                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <div className={`font-bold text-sm ${paymentMethod === 'manual' ? 'text-indigo-600' : 'text-gray-900'}`}>Bayar Manual</div>
                                            <div className="text-[10px] text-gray-400 mt-1 font-medium">Bayar di Kasir</div>
                                            {paymentMethod === 'manual' && <div className="absolute top-3 right-3 h-2 w-2 bg-indigo-600 rounded-full animate-pulse" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-6 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            className={`flex-1 inline-flex justify-center items-center rounded-2xl shadow-lg px-8 py-4 text-[13px] font-bold uppercase tracking-widest text-white transition-all duration-300 ${isProcessing || !customerName.trim()
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-indigo-600 hover:bg-black shadow-indigo-100 active:scale-95'
                                }`}
                            onClick={onCheckout}
                            disabled={isProcessing || !customerName.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                                    Processing...
                                </>
                            ) : (
                                paymentMethod === 'qris' ? 'Lanjut Bayar' : 'Buat Pesanan'
                            )}
                        </button>
                        <button
                            type="button"
                            className="flex-1 inline-flex justify-center rounded-2xl border-2 border-white shadow-sm px-8 py-4 bg-white text-[13px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all active:scale-95"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
