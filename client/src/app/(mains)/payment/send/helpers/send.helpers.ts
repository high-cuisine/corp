import { SelectedRecipient } from '../hooks/useSendForm';

/**
 * Валидирует сумму для отправки
 */
export const validateAmount = (amount: string): boolean => {
    if (!amount.trim()) {
        return false;
    }
    
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
};

/**
 * Форматирует сумму для отображения
 */
export const formatAmount = (amount: string): string => {
    if (!amount) return '';
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return amount;
    
    return numAmount.toFixed(2);
};

/**
 * Получает отображаемое имя получателя
 */
export const getRecipientDisplayName = (
    recipient: SelectedRecipient | null,
    fallback: string = 'Получатель'
): string => {
    return recipient?.username || fallback;
};

/**
 * Получает URL фото получателя с fallback
 */
export const getRecipientPhotoUrl = (
    recipient: SelectedRecipient | null,
    fallbackUrl: string = ''
): string => {
    return recipient?.photoUrl || fallbackUrl;
};

/**
 * Вычисляет комиссию (пока возвращает 0.00)
 */
export const calculateCommission = (amount: string): string => {
    if (!validateAmount(amount)) {
        return '0.00';
    }
    
    // TODO: Реализовать реальный расчет комиссии
    return '0.00';
};

