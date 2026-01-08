import { useState, useCallback } from 'react';
import { paymentServiceInstance } from '@/features/payment/payment';
import { useToast } from '@/shared/lib/hooks/useToast';
import { validateAmount } from '../helpers/send.helpers';
import { SelectedRecipient } from './useSendForm';

interface UseSendTransactionReturn {
    isLoading: boolean;
    handleSend: (
        selectedCoin: string | null,
        selectedRecipient: SelectedRecipient | null,
        amount: string,
        onSuccess?: () => void
    ) => Promise<void>;
}

export const useSendTransaction = (): UseSendTransactionReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useToast();

    const handleSend = useCallback(async (
        selectedCoin: string | null,
        selectedRecipient: SelectedRecipient | null,
        amount: string,
        onSuccess?: () => void
    ): Promise<void> => {
        // Валидация данных
        if (!selectedCoin) {
            error('Выберите монету');
            return;
        }

        if (!selectedRecipient) {
            error('Выберите получателя');
            return;
        }

        if (!amount || !amount.trim()) {
            error('Введите сумму');
            return;
        }

        // Валидация суммы
        if (!validateAmount(amount)) {
            error('Введите корректную сумму');
            return;
        }

        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            error('Сумма должна быть больше нуля');
            return;
        }

        // Валидация ID получателя
        const recipientId = parseInt(selectedRecipient.id);
        if (isNaN(recipientId) || recipientId <= 0) {
            error('Некорректный получатель');
            return;
        }

        try {
            setIsLoading(true);
            
            // Конвертируем название монеты в нужный формат
            const token = selectedCoin.toUpperCase() as 'TON' | 'COIN';

            // Вызываем метод send
            await paymentServiceInstance.send(amountNumber, recipientId, token);
            
            success('Отправка выполнена успешно');
            
            // Вызываем callback при успешной отправке
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            const errorMessage = (err as Error).message || 'Ошибка при отправке';
            error(errorMessage);
            console.error('Send error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [success, error]);

    return {
        isLoading,
        handleSend,
    };
};

