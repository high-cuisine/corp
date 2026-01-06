import { useState } from 'react';

export interface SelectedUser {
    id: string;
    username: string;
    photoUrl?: string;
}

interface UseTopUpFormReturn {
    selectedUser: SelectedUser | null;
    amount: string;
    setSelectedUser: (user: SelectedUser | null) => void;
    setAmount: (amount: string) => void;
    resetForm: () => void;
}

export const useTopUpForm = (): UseTopUpFormReturn => {
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [amount, setAmount] = useState('');

    const resetForm = () => {
        setSelectedUser(null);
        setAmount('');
    };

    return {
        selectedUser,
        amount,
        setSelectedUser,
        setAmount,
        resetForm,
    };
};

