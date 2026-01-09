'use client'
import { useState } from 'react';
import { useUserStore } from '@/entites/user/model/user';
import cls from './balance.module.scss';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { Modal } from '@/components/layout/modal/modal';

type CoinType = 'TON' | 'COIN';

const Balance = () => {
    const { user } = useUserStore();
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();
    const [selectedCoin, setSelectedCoin] = useState<CoinType>('TON');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConnectWallet = () => {
        tonConnectUI.openModal();
    };

    const handleDisconnect = () => {
        tonConnectUI.disconnect();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCoinSelect = (coin: CoinType) => {
        setSelectedCoin(coin);
        setIsModalOpen(false);
    };

    const getBalance = (): number => {
        if (!user) return 0;
        const balance = selectedCoin === 'TON' 
            ? Number(user.tonBalance || 0)
            : Number(user.coinBalance || 0);
        return isNaN(balance) ? 0 : balance;
    };

    return(
        <>
            <div className={cls.balance}>
                <div className={cls.balanceAmount}>{getBalance().toFixed(2)}</div>
                <div className={cls.controlsRow}>
                    <button className={cls.coinSelectButton} onClick={handleOpenModal}>
                        Монеты
                    </button>
                    {address ? (
                        <button className={cls.walletButton} onClick={handleDisconnect}>
                            <span className={cls.walletButtonText}>Отключить кошелек</span>
                        </button>
                    ) : (
                        <button className={cls.walletButton} onClick={handleConnectWallet}>
                            <span className={cls.walletButtonText}>Подключить кошелек</span>
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Выберите монету">
                <div className={cls.modalContent}>
                    <button
                        className={`${cls.modalCoinButton} ${selectedCoin === 'TON' ? cls.modalActive : ''}`}
                        onClick={() => handleCoinSelect('TON')}
                    >
                        <div className={cls.modalCoinInfo}>
                            <span className={cls.modalCoinName}>TON</span>
                            <span className={cls.modalCoinBalance}>
                                {user ? Number(user.tonBalance || 0).toFixed(2) : '0.00'}
                            </span>
                        </div>
                        {selectedCoin === 'TON' && (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                    <button
                        className={`${cls.modalCoinButton} ${selectedCoin === 'COIN' ? cls.modalActive : ''}`}
                        onClick={() => handleCoinSelect('COIN')}
                    >
                        <div className={cls.modalCoinInfo}>
                            <span className={cls.modalCoinName}>COIN</span>
                            <span className={cls.modalCoinBalance}>
                                {user ? Number(user.coinBalance || 0).toFixed(2) : '0.00'}
                            </span>
                        </div>
                        {selectedCoin === 'COIN' && (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                </div>
            </Modal>
        </>
    )
}

export { Balance }