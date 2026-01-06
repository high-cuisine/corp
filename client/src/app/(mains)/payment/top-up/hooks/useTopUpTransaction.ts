import { useState, useCallback } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import useSendTONTransaction from '@/shared/lib/hooks/useSendTonTransaction';

interface TransactionResult {
    success: boolean;
    result?: any;
    error?: string;
}

interface UseTopUpTransactionReturn {
    isLoading: boolean;
    address: string | null;
    transactionResult: TransactionResult | null;
    handleConnectWallet: () => void;
    handleSignTransaction: (amount: string, recipientAddress?: string) => Promise<TransactionResult>;
}

export const useTopUpTransaction = (): UseTopUpTransactionReturn => {
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();
    const [isLoading, setIsLoading] = useState(false);
    const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
    const { sendTransaction } = useSendTONTransaction('UQDuoos0_uW_g7ssxNThNmoHJIPIuOmURrMGjLKICw0V2hQ-');
    
    const handleConnectWallet = useCallback(() => {
        tonConnectUI?.openModal();
    }, [tonConnectUI]);

    const handleSignTransaction = useCallback(async (
        amount: string,
        recipientAddress: string = 'UQDuoos0_uW_g7ssxNThNmoHJIPIuOmURrMGjLKICw0V2hQ-'
    ): Promise<TransactionResult> => {
        if (!address || !amount || !tonConnectUI) {
            const errorResult: TransactionResult = {
                success: false,
                error: 'Missing required parameters'
            };
            setTransactionResult(errorResult);
            return errorResult;
        }

        try {
            setIsLoading(true);
            setTransactionResult(null);
            
            // sendTransaction ожидает amount в TON, конвертация происходит внутри хука
            const result = await sendTransaction(amount);
            
            setTransactionResult(result);
            return result;
        } catch (error) {
            const errorResult: TransactionResult = {
                success: false,
                error: (error as Error).message
            };
            setTransactionResult(errorResult);
            console.error('Transaction error:', error);
            return errorResult;
        } finally {
            setIsLoading(false);
        }
    }, [address, tonConnectUI, sendTransaction]);

    return {
        isLoading,
        address,
        transactionResult,
        handleConnectWallet,
        handleSignTransaction,
    };
};

