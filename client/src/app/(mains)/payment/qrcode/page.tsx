'use client'
import { useState } from 'react';
import QRCodeGenerator from "@/components/features/qrcode/qrcode";
import { Modal } from '@/components/layout/modal/modal';
import cls from './qrcode.module.scss';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

export default function QRCodePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const { username } = useTelegram();
    const coins = [
        {
            name: 'ton'
        },
        {
            name: 'coin'
        }
    ];

    const handleSelectCoin = (coinName: string) => {
        setSelectedCoin(coinName);
        setIsModalOpen(false);
    };

    return (
        <div className={cls.qrCodePage}>
            <h2 className={cls.title}>Получить</h2>
            <div className={cls.coins} onClick={() => setIsModalOpen(true)}>
                {selectedCoin ? (
                    <span className={cls.selectedCoin}>{selectedCoin.toUpperCase()}</span>
                ) : (
                    <span className={cls.placeholder}>Выберите монету</span>
                )}
                <svg className={cls.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Выберите монету">
                <div className={cls.coinList}>
                    {coins.map((coin) => (
                        <button
                            key={coin.name}
                            className={`${cls.coinItem} ${selectedCoin === coin.name ? cls.active : ''}`}
                            onClick={() => handleSelectCoin(coin.name)}
                        >
                            <span>{coin.name.toUpperCase()}</span>
                            {selectedCoin === coin.name && (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </Modal>

            <div className={cls.qrCodeContainer}>
                <QRCodeGenerator value={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}/send?token=${selectedCoin}`} size={256} />
                <span className={cls.username}>{username || 'test'}</span>
            </div>
           
        </div>
    )
}