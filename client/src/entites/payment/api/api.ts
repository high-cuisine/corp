import * as api from '@/shared/lib/api/api';

class PaymentService {

    async switch(tokenFrom: string, tokenTo: string, amount: number): Promise<{accessToken: string}> {
        const response = await api.$authHost.post('/payment/switch', { tokenFrom, tokenTo, amount });
        return response.data;
    }

    async send(token: string, amount: number, toId: number): Promise<{accessToken: string}> {
        const response = await api.$authHost.post('/payment/send', { token, amount, toId });
        return response.data;
    }
}

export const paymentService = new PaymentService();