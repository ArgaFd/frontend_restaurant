import { type MenuItem } from '../../services/api';

interface CartItem {
    id: number;
    quantity: number;
}

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    menuItems: MenuItem[];
    tableNumber: string | null;
    onRemoveFromCart: (itemId: number) => void;
    onCheckout: () => void;
    totalAmount: number;
}

const CartSidebar = ({
    isOpen,
    onClose,
    cart,
    menuItems,
    tableNumber,
    onRemoveFromCart,
    onCheckout,
    totalAmount,
}: CartSidebarProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-2xl">
                            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-2xl border border-indigo-100 shadow-sm">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Your <span className="text-indigo-600">Cart</span></h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meja #{tableNumber}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={onClose}
                                    >
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {cart.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🛒</div>
                                        <p className="text-gray-600 font-medium">Your cart is empty</p>
                                        <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {cart.map(cartItem => {
                                                const menuItem = menuItems.find(item => item.id === cartItem.id);
                                                if (!menuItem) return null;

                                                return (
                                                    <div key={cartItem.id} className="bg-gray-50 rounded-2xl p-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex-1">
                                                                <h4 className="font-black text-gray-900">{menuItem.name}</h4>
                                                                <p className="text-sm text-gray-600">Rp {menuItem.price.toLocaleString('id-ID')} x {cartItem.quantity}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <span className="font-bold text-gray-900">
                                                                    Rp {(menuItem.price * cartItem.quantity).toLocaleString('id-ID')}
                                                                </span>
                                                                <button
                                                                    onClick={() => onRemoveFromCart(cartItem.id)}
                                                                    className="h-9 w-9 flex items-center justify-center bg-white text-red-500 hover:bg-red-50 border border-gray-100 rounded-xl transition-all shadow-sm"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-gray-100 pb-4">
                                            <div className="flex justify-between items-center mb-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bayar</span>
                                                    <span className="text-2xl font-black text-indigo-600 tracking-tight">
                                                        Rp {totalAmount.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={onCheckout}
                                                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-[13px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                <span>Lanjut ke Checkout</span>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
