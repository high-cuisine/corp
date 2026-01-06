export const validateCoinSelection = (
    coinToSelect: string,
    otherCoin: string | null
): boolean => {
    return otherCoin !== coinToSelect;
};

