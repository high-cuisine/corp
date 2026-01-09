//zustand store for payment

import { create } from 'zustand';



export interface PaymentStore {
    transactions: Transaction[];
    setTransactions: (transactions: Transaction[]) => void;
}

export interface Transaction {
    id: number;
    type: 'SEND' | 'RECEIVE' | 'SWITCH_OUT' | 'SWITCH_IN' | 'TOPUP';
    amount: string | number;
    token: 'TON' | 'COIN';
    userId: number;
    createdAt: string;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    transactions: [],
    setTransactions: (transactions: Transaction[]) => set({ transactions }),
}));