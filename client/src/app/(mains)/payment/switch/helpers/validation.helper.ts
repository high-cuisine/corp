export const validateCoinSelection = (
    coinToSelect: string,
    otherCoin: string | null
): boolean => {
    return otherCoin !== coinToSelect;
};

export const validateAmount = (amount: string): boolean => {
    if (!amount || amount.trim() === '') {
        return false;
    }
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
};

export const validateExchangeData = (
    sellCoin: string | null,
    buyCoin: string | null,
    sellAmount: string
): string | null => {
    if (!sellCoin) {
        return 'Выберите монету для продажи';
    }
    if (!buyCoin) {
        return 'Выберите монету для покупки';
    }
    if (sellCoin === buyCoin) {
        return 'Нельзя обменять монету на саму себя';
    }
    if (!sellAmount || sellAmount.trim() === '') {
        return 'Введите сумму для обмена';
    }
    return null;
};

