'use client'
import { useUserStore } from '@/entites/user/model/user';
import cls from './balance.module.scss';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

const Balance = () => {

    const { user } = useUserStore();
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();

    const handleConnectWallet = () => {
        tonConnectUI.openModal();
    };

    const handleDisconnect = () => {
        tonConnectUI.disconnect();
    };

    return(
        <div className={cls.balance}>
            <span>{(user?.balance || 0).toFixed(2)}</span>
            {address ? (
                <button className={cls.walletButton} onClick={handleDisconnect}>
                    Отключить кошелек
                </button>
            ) : (
                <button className={cls.walletButton} onClick={handleConnectWallet}>
                    Подключить TON Wallet
                </button>
            )}
        </div>
    )
}

export { Balance }