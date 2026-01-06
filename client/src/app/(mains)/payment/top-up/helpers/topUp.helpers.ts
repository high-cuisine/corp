import { SelectedUser } from '../hooks/useTopUpForm';

/**
 * Валидирует сумму для пополнения
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
 * Получает отображаемое имя пользователя
 */
export const getUserDisplayName = (
    user: SelectedUser | null,
    fallback: string = 'User name'
): string => {
    return user?.username || fallback;
};

/**
 * Получает URL фото пользователя с fallback
 */
export const getUserPhotoUrl = (
    user: SelectedUser | null,
    fallbackUrl: string = ''
): string => {
    return user?.photoUrl || fallbackUrl;
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

/**
 * Конвертирует TON в нанотонны
 */
export const convertTonToNano = (amount: string): string => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return '0';
    return (amountNum * 1000000000).toString();
};

