import { useState, useCallback } from 'react';
import { paymentServiceInstance } from '@/features/payment/payment';
import { useToast } from '@/shared/lib/hooks/useToast';
import { validateAmount, validateExchangeData } from '../helpers/validation.helper';

interface UseSwitchTransactionReturn {
    isLoading: boolean;
    handleExchange: (
        sellCoin: string | null,
        buyCoin: string | null,
        sellAmount: string
    ) => Promise<void>;
}

export const useSwitchTransaction = (): UseSwitchTransactionReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useToast();

    const handleExchange = useCallback(async (
        sellCoin: string | null,
        buyCoin: string | null,
        sellAmount: string
    ): Promise<void> => {
        // Валидация данных
        const validationError = validateExchangeData(sellCoin, buyCoin, sellAmount);
        if (validationError) {
            error(validationError);
            return;
        }

        // Валидация суммы
        if (!validateAmount(sellAmount)) {
            error('Введите корректную сумму');
            return;
        }

        const amountNumber = parseFloat(sellAmount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            error('Сумма должна быть больше нуля');
            return;
        }

        try {
            setIsLoading(true);
            
            // Конвертируем названия монет в нужный формат
            const tokenFrom = sellCoin?.toUpperCase() as 'TON' | 'COIN';
            const tokenTo = buyCoin?.toUpperCase() as 'TON' | 'COIN';

            // Вызываем метод switch
            await paymentServiceInstance.switch(amountNumber, tokenFrom, tokenTo);
            
            success('Обмен выполнен успешно');
        } catch (err) {
            const errorMessage = (err as Error).message || 'Ошибка при выполнении обмена';
            error(errorMessage);
            console.error('Exchange error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [success, error]);

    return {
        isLoading,
        handleExchange,
    };
};

