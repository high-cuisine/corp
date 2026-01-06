import { useState, useCallback } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import useSendTONTransaction from '@/shared/lib/hooks/useSendTonTransaction';
import { convertTonToNano } from '../helpers/topUp.helpers';

interface UseTopUpTransactionReturn {
    isLoading: boolean;
    address: string | null;
    handleConnectWallet: () => void;
    handleSignTransaction: (amount: string, recipientAddress?: string) => Promise<void>;
}

export const useTopUpTransaction = (): UseTopUpTransactionReturn => {
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();
    const [isLoading, setIsLoading] = useState(false);
    const { sendTransaction } = useSendTONTransaction('UQDuoos0_uW_g7ssxNThNmoHJIPIuOmURrMGjLKICw0V2hQ-');
    const handleConnectWallet = useCallback(() => {
        tonConnectUI?.openModal();
    }, [tonConnectUI]);

    const handleSignTransaction = useCallback(async (
        amount: string,
        recipientAddress: string = 'UQDuoos0_uW_g7ssxNThNmoHJIPIuOmURrMGjLKICw0V2hQ-'
    ) => {
        if (!address || !amount || !tonConnectUI) return;

        try {
            setIsLoading(true);            
            
            const amountInNano = convertTonToNano(amount);
            
            await sendTransaction(amountInNano);
        } catch (error) {
            console.error('Transaction error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, tonConnectUI]);

    return {
        isLoading,
        address,
        handleConnectWallet,
        handleSignTransaction,
    };
};

