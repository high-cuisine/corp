import { useState } from 'react';

export interface SelectedRecipient {
    id: string;
    username: string;
    photoUrl?: string;
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

export const useSendForm = (): UseSendFormReturn => {
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<SelectedRecipient | null>(null);
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

