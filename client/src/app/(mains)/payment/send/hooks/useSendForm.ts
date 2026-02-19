import { useState } from 'react';

export interface SelectedRecipient {
    id: string;
    username: string;
    photoUrl?: string;
}

export interface UseSendFormOptions {
    initialCoin?: string | null;
    initialRecipient?: SelectedRecipient | null;
}

interface UseSendFormReturn {
    selectedCoin: string | null;
    selectedRecipient: SelectedRecipient | null;
    amount: string;
    setSelectedCoin: (coin: string | null) => void;
    setSelectedRecipient: (recipient: SelectedRecipient | null) => void;
    setAmount: (amount: string) => void;
    resetForm: () => void;
}

export const useSendForm = (options?: UseSendFormOptions): UseSendFormReturn => {
    const [selectedCoin, setSelectedCoin] = useState<string | null>(options?.initialCoin ?? null);
    const [selectedRecipient, setSelectedRecipient] = useState<SelectedRecipient | null>(options?.initialRecipient ?? null);
    const [amount, setAmount] = useState('');

    const resetForm = () => {
        setSelectedCoin(null);
        setSelectedRecipient(null);
        setAmount('');
    };

    return {
        selectedCoin,
        selectedRecipient,
        amount,
        setSelectedCoin,
        setSelectedRecipient,
        setAmount,
        resetForm,
    };
};

