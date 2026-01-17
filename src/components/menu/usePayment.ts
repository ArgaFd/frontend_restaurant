import { useState, useCallback } from 'react';
import { processGuestCheckout, validateCheckoutData, type CartItem, type CheckoutResult } from './paymentService';

interface UsePaymentOptions {
    onSuccess?: (result: CheckoutResult) => void;
    onError?: (error: string) => void;
}

interface UsePaymentReturn {
    isProcessing: boolean;
    error: string | null;
    checkout: (data: {
        tableNumber: number;
        customerName: string;
        items: CartItem[];
        paymentMethod: 'qris' | 'manual';
    }) => Promise<CheckoutResult>;
    resetError: () => void;
}

/**
 * Hook for handling payment/checkout process
 */
export const usePayment = (options: UsePaymentOptions = {}): UsePaymentReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const checkout = useCallback(async (data: {
        tableNumber: number;
        customerName: string;
        items: CartItem[];
        paymentMethod: 'qris' | 'manual';
    }): Promise<CheckoutResult> => {
        console.log('[usePayment] Starting checkout process');
        setIsProcessing(true);
        setError(null);

        // Validate data
        const validation = validateCheckoutData(data);
        if (!validation.valid) {
            console.log('[usePayment] Validation failed:', validation.error);
            setError(validation.error || 'Data tidak valid');
            setIsProcessing(false);
            options.onError?.(validation.error || 'Data tidak valid');
            return {
                success: false,
                message: validation.error || 'Data tidak valid',
            };
        }

        // Process checkout
        const result = await processGuestCheckout(data);
        setIsProcessing(false);

        if (result.success) {
            console.log('[usePayment] Checkout successful:', result);
            options.onSuccess?.(result);

            // Handle QRIS redirect
            if (result.redirectUrl) {
                console.log('[usePayment] Redirecting to:', result.redirectUrl);
                window.location.href = result.redirectUrl;
            }
        } else {
            console.log('[usePayment] Checkout failed:', result.message);
            setError(result.message);
            options.onError?.(result.message);
        }

        return result;
    }, [options]);

    return {
        isProcessing,
        error,
        checkout,
        resetError,
    };
};

export default usePayment;
