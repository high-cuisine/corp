import * as api from '@/shared/lib/api/api';
import { Transaction } from '../model/payment';

class PaymentService {

    async switch(tokenFrom: 'TON' | 'COIN', tokenTo: 'TON' | 'COIN', amount: number): Promise<Transaction> {
        const response = await api.$authHost.post('/payment/switch', { tokenFrom, tokenTo, amount });
        return response.data;
    }

    async send(token: 'TON' | 'COIN', amount: number, toId: number): Promise<Transaction> {
        const response = await api.$authHost.post('/payment/send', { token, amount, toId });
        return response.data;
    }

    async topUp(token: 'TON' | 'COIN', amount: number): Promise<Transaction> {
        const response = await api.$authHost.post('/payment/topup', { token, amount });
        return response.data;
    }

    async getTransactions(): Promise<Transaction[]> {
        const response = await api.$authHost.get('/payment/transactions');
        return response.data;
    }
}

export const paymentService = new PaymentService();