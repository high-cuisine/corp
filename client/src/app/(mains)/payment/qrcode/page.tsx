'use client'
import { useCallback, useState } from 'react';
import QRCodeGenerator from "@/components/features/qrcode/qrcode";
import { Modal } from '@/components/layout/modal/modal';
import cls from './qrcode.module.scss';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

export default function QRCodePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>('ton');
    const [copied, setCopied] = useState(false);
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

    const qrLink = `https://t.me/Treahkoufxs3674_bot/httpsevilcorponline?startapp=send_${selectedCoin}_${username || ''}`;

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(qrLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* fallback: do nothing */
        }
    }, [qrLink]);

    const handleShare = useCallback(() => {
        const text = encodeURIComponent('Отправь мне по этой ссылке');
        const url = encodeURIComponent(qrLink);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    }, [qrLink]);

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
                <QRCodeGenerator value={qrLink} size={256} />
                <span className={cls.username}>{username || 'test'}</span>
            </div>

            <div className={cls.actions}>
                <button className={cls.copyButton} onClick={handleCopy}>
                    <span>{copied ? 'Скопировано' : 'Скопировать'}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6.5" y="6.5" width="11" height="11" rx="2" stroke="white" strokeWidth="1.5"/>
                        <path d="M13.5 6.5V4.5C13.5 3.39543 12.6046 2.5 11.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V11.5C2.5 12.6046 3.39543 13.5 4.5 13.5H6.5" stroke="white" strokeWidth="1.5"/>
                    </svg>
                </button>
                <button className={cls.shareButton} onClick={handleShare}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2.5V12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M6.5 5.5L10 2L13.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 12.5V15.5C3.5 16.6046 4.39543 17.5 5.5 17.5H14.5C15.6046 17.5 16.5 16.6046 16.5 15.5V12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}