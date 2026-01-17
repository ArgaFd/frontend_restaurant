import React from 'react';
import type { MenuItem } from '../../services/api';

interface CartItem {
  id: number;
  quantity: number;
}

interface CartSidebarProps {
  cart: CartItem[];
  menuItems: MenuItem[];
  totalAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
  tableNumber: string;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  menuItems,
  totalAmount,
  isOpen,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  tableNumber
}) => {
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
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-xl">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Your Cart</h2>
                      <p className="text-sm text-gray-600">Meja {tableNumber}</p>
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
                          <CartItemRow
                            key={cartItem.id}
                            item={menuItem}
                            quantity={cartItem.quantity}
                            onRemove={() => onRemoveItem(cartItem.id)}
                            onUpdateQuantity={(quantity) => onUpdateQuantity(cartItem.id, quantity)}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-black text-gray-900">Total:</span>
                        <span className="text-2xl font-black text-orange-600">
                          Rp {totalAmount.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <button
                        onClick={onCheckout}
                        className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Proceed to Checkout
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

interface CartItemRowProps {
  item: MenuItem;
  quantity: number;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, quantity, onRemove, onUpdateQuantity }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h4 className="font-black text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')} x {quantity}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors font-bold"
            >
              -
            </button>
            <span className="w-8 text-center font-black text-orange-600 text-lg">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors font-bold"
            >
              +
            </button>
          </div>
          <span className="font-black text-orange-600">
            Rp {(item.price * quantity).toLocaleString('id-ID')}
          </span>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
