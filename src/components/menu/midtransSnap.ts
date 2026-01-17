/**
 * Midtrans Snap utility for popup payment
 * Requires Midtrans Snap JS to be loaded in index.html
 */

declare global {
    interface Window {
        snap: {
            pay: (token: string, options?: SnapPayOptions) => void;
            hide: () => void;
        };
    }
}

interface SnapPayOptions {
    onSuccess?: (result: SnapResult) => void;
    onPending?: (result: SnapResult) => void;
    onError?: (result: SnapResult) => void;
    onClose?: () => void;
}

interface SnapResult {
    order_id: string;
    transaction_id?: string;
    transaction_status?: string;
    status_code?: string;
    status_message?: string;
    fraud_status?: string;
    payment_type?: string;
    gross_amount?: string;
    transaction_time?: string;
}

/**
 * Check if Midtrans Snap is available
 */
export const isSnapAvailable = (): boolean => {
    return typeof window !== 'undefined' && typeof window.snap !== 'undefined';
};

/**
 * Open Midtrans Snap popup for payment
 * @param token - Snap token from backend
 * @param options - Callback options
 */
export const openSnapPopup = (token: string, options?: SnapPayOptions): Promise<SnapResult> => {
    return new Promise((resolve, reject) => {
        if (!token) {
            console.error('[MidtransSnap] No token provided');
            reject(new Error('Payment token is empty'));
            return;
        }

        if (!isSnapAvailable()) {
            console.error('[MidtransSnap] snap.js is not loaded in index.html or not ready. Check your <script> tag.');
            alert('Sistem pembayaran sedang tidak tersedia. Harap muat ulang halaman atau hubungi kasir.');
            reject(new Error('Midtrans Snap is not available'));
            return;
        }

        console.log('[MidtransSnap] Opening Snap popup with token:', token);

        window.snap.pay(token, {
            onSuccess: (result) => {
                console.log('[MidtransSnap] Payment Success ✅:', result);
                options?.onSuccess?.(result);
                resolve(result);
            },
            onPending: (result) => {
                console.log('[MidtransSnap] Payment Pending ⏳:', result);
                options?.onPending?.(result);
                resolve(result);
            },
            onError: (result) => {
                console.error('[MidtransSnap] Payment Error ❌:', result);
                options?.onError?.(result);
                reject(result);
            },
            onClose: () => {
                console.log('[MidtransSnap] User closed checkout popup');
                options?.onClose?.();
                // Resolve with an empty result if closed
                resolve({ order_id: '', transaction_status: 'closed' });
            },
        });
    });
};

/**
 * Hide Midtrans Snap popup
 */
export const hideSnapPopup = (): void => {
    if (isSnapAvailable()) {
        window.snap.hide();
    }
};

export type { SnapPayOptions, SnapResult };
