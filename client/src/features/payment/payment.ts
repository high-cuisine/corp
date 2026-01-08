import { Transaction, usePaymentStore } from "@/entites/payment/model/payment";
import { paymentService as paymentApiService } from "@/entites/payment/api/api";

export class PaymentService {
    async getTransactions(): Promise<Transaction[]> {
        const response = await paymentApiService.getTransactions();
        usePaymentStore.getState().setTransactions(response);
        return response;
    }

    async send(amount: number, toId: number, token: 'TON' | 'COIN' = 'TON'): Promise<Transaction> {
        const response = await paymentApiService.send(token, amount, toId);
        usePaymentStore.getState().setTransactions([...usePaymentStore.getState().transactions, response]);
        return response;
    }

    async switch(amount: number, tokenFrom: 'TON' | 'COIN', tokenTo: 'TON' | 'COIN'): Promise<Transaction> {
        const response = await paymentApiService.switch(tokenFrom, tokenTo, amount);
        usePaymentStore.getState().setTransactions([...usePaymentStore.getState().transactions, response]);
        return response;
    }
    
    async topUp(amount: number, token: 'TON' | 'COIN' = 'TON'): Promise<Transaction> {
        const response = await paymentApiService.topUp(token, amount);
        usePaymentStore.getState().setTransactions([...usePaymentStore.getState().transactions, response]);
        return response;
    }
}

export const paymentServiceInstance = new PaymentService();