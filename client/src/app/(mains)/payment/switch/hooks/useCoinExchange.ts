import { useState } from 'react';
import { useToast } from '@/shared/lib/hooks/useToast';
import { validateCoinSelection } from '../helpers/validation.helper';

interface UseCoinExchangeReturn {
    sellCoin: string | null;
    buyCoin: string | null;
    sellAmount: string;
    buyAmount: string;
    isSellCoinModalOpen: boolean;
    isBuyCoinModalOpen: boolean;
    setSellAmount: (amount: string) => void;
    setBuyAmount: (amount: string) => void;
    openSellCoinModal: () => void;
    closeSellCoinModal: () => void;
    openBuyCoinModal: () => void;
    closeBuyCoinModal: () => void;
    handleSelectSellCoin: (coinName: string) => void;
    handleSelectBuyCoin: (coinName: string) => void;
    handleSwap: () => void;
}

export const useCoinExchange = (): UseCoinExchangeReturn => {
    const { error } = useToast();
    const [isSellCoinModalOpen, setIsSellCoinModalOpen] = useState(false);
    const [isBuyCoinModalOpen, setIsBuyCoinModalOpen] = useState(false);
    const [sellCoin, setSellCoin] = useState<string | null>(null);
    const [buyCoin, setBuyCoin] = useState<string | null>(null);
    const [sellAmount, setSellAmount] = useState('');
    const [buyAmount, setBuyAmount] = useState('');

    const handleSelectSellCoin = (coinName: string) => {
        if (!validateCoinSelection(coinName, buyCoin)) {
            error('Нельзя выбрать две одинаковые монеты');
            setIsSellCoinModalOpen(false);
            return;
        }
        setSellCoin(coinName);
        setIsSellCoinModalOpen(false);
    };

    const handleSelectBuyCoin = (coinName: string) => {
        if (!validateCoinSelection(coinName, sellCoin)) {
            error('Нельзя выбрать две одинаковые монеты');
            setIsBuyCoinModalOpen(false);
            return;
        }
        setBuyCoin(coinName);
        setIsBuyCoinModalOpen(false);
    };

    const handleSwap = () => {
        const tempCoin = sellCoin;
        const tempAmount = sellAmount;
        setSellCoin(buyCoin);
        setBuyCoin(tempCoin);
        setSellAmount(buyAmount);
        setBuyAmount(tempAmount);
    };

    return {
        sellCoin,
        buyCoin,
        sellAmount,
        buyAmount,
        isSellCoinModalOpen,
        isBuyCoinModalOpen,
        setSellAmount,
        setBuyAmount,
        openSellCoinModal: () => setIsSellCoinModalOpen(true),
        closeSellCoinModal: () => setIsSellCoinModalOpen(false),
        openBuyCoinModal: () => setIsBuyCoinModalOpen(true),
        closeBuyCoinModal: () => setIsBuyCoinModalOpen(false),
        handleSelectSellCoin,
        handleSelectBuyCoin,
        handleSwap,
    };
};

