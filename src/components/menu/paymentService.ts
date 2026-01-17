import { orderAPI, paymentAPI } from '../../services/api';
import { openSnapPopup, isSnapAvailable } from './midtransSnap';

export interface CartItem {
    id: number;
    quantity: number;
}

export interface CheckoutData {
    tableNumber: number;
    customerName: string;
    items: CartItem[];
    paymentMethod: 'qris' | 'manual';
}

export interface CheckoutResult {
    success: boolean;
    message: string;
    redirectUrl?: string;
    snapToken?: string;
    orderId?: number;
    paymentId?: number;
}

/**
 * Process checkout for guest users (no login required)
 * Uses Midtrans Snap popup if available, otherwise falls back to redirect
 */
export const processGuestCheckout = async (data: CheckoutData): Promise<CheckoutResult> => {
    console.log('[PaymentService] Starting guest checkout:', data);

    try {
        // Step 1: Create guest order
        const orderPayload = {
            tableNumber: data.tableNumber,
            customerName: data.customerName.trim(),
            items: data.items.map((item) => ({
                menuId: item.id,
                quantity: item.quantity,
            })),
        };

        console.log('[PaymentService] Creating guest order:', orderPayload);
        const orderResponse = await orderAPI.createGuest(orderPayload);

        if (!orderResponse.data.success) {
            console.error('[PaymentService] Failed to create order:', orderResponse.data);
            return {
                success: false,
                message: 'Gagal membuat pesanan',
            };
        }

        const order = orderResponse.data.data;
        console.log('[PaymentService] Order created:', order.id);

        // Step 2: Process payment based on method
        if (data.paymentMethod === 'manual') {
            console.log('[PaymentService] Processing manual payment for order:', order.id);
            const paymentResponse = await paymentAPI.guestManual({ orderId: order.id });

            if (paymentResponse.data.success) {
                console.log('[PaymentService] Manual payment created successfully');
                return {
                    success: true,
                    message: 'Pesanan berhasil dibuat. Silakan lakukan pembayaran manual ke kasir.',
                    orderId: order.id,
                    paymentId: paymentResponse.data.data?.payment?.id,
                };
            } else {
                console.error('[PaymentService] Failed to create manual payment:', paymentResponse.data);
                return {
                    success: false,
                    message: 'Gagal membuat pembayaran manual',
                };
            }
        }

        // Digital Payment via Midtrans (Snap)
        console.log('[PaymentService] Processing digital payment (Snap) for order:', order.id);
        const qrisResponse = await paymentAPI.guestDigital({
            orderId: order.id,
            customer: {
                first_name: data.customerName.trim(),
            },
        });

        if (qrisResponse.data.success) {
            const snapToken = qrisResponse.data.data?.midtrans?.token;
            const redirectUrl = qrisResponse.data.data?.midtrans?.redirect_url;

            // Try to use Snap popup first
            if (snapToken && isSnapAvailable()) {
                console.log('[PaymentService] Opening Midtrans Snap popup');
                try {
                    const snapResult = await openSnapPopup(snapToken);

                    if (snapResult.transaction_status === 'closed') {
                        return {
                            success: false,
                            message: 'Pembayaran dibatalkan',
                        };
                    }

                    return {
                        success: true,
                        message: 'Pembayaran sedang diproses!',
                        orderId: order.id,
                        paymentId: qrisResponse.data.data?.payment?.id,
                        snapToken,
                    };
                } catch (snapError) {
                    console.error('[PaymentService] Snap payment error:', snapError);
                    return {
                        success: false,
                        message: 'Terjadi kesalahan saat pembayaran',
                    };
                }
            }

            // Fallback to redirect if Snap is not available or token missing
            if (redirectUrl) {
                console.log('[PaymentService] Snap popup fallback to redirect:', redirectUrl);
                return {
                    success: true,
                    message: 'Mengarahkan ke halaman pembayaran...',
                    redirectUrl,
                    orderId: order.id,
                    paymentId: qrisResponse.data.data?.payment?.id,
                };
            }

            return {
                success: false,
                message: 'Gagal mendapatkan data pembayaran',
            };
        }

        console.error('[PaymentService] Failed to create QRIS payment:', qrisResponse.data);
        return {
            success: false,
            message: 'Gagal memulai pembayaran QRIS',
        };
    } catch (error: any) {
        console.error('[PaymentService] Checkout error:', error);
        return {
            success: false,
            message: error?.response?.data?.message || 'Gagal memproses pesanan. Silakan coba lagi.',
        };
    }
};

/**
 * Validate checkout data before processing
 */
export const validateCheckoutData = (data: Partial<CheckoutData>): { valid: boolean; error?: string } => {
    if (!data.customerName?.trim()) {
        return { valid: false, error: 'Silakan masukkan nama pelanggan' };
    }

    if (!data.tableNumber || isNaN(data.tableNumber) || data.tableNumber < 1) {
        return { valid: false, error: 'Silakan masukkan nomor meja yang valid' };
    }

    if (!data.items || data.items.length === 0) {
        return { valid: false, error: 'Keranjang masih kosong' };
    }

    return { valid: true };
};
