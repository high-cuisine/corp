'use client'
import { useState } from 'react';
import { Modal } from '@/components/layout/modal/modal';
import Button from '@/components/ui/button/button';
import cls from './send.module.scss';
import { UserAvatar } from '@/components/ui/userAvatar/userAvatar';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

const coins = [
    { name: 'ton' },
    { name: 'coin' }
];

interface SelectedRecipient {
    id: string;
    username: string;
    photoUrl?: string;
}

const Send = () => {
    const { username: telegramUsername, photoUrl: telegramPhotoUrl } = useTelegram();
    const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
    const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<SelectedRecipient | null>(null);
    const [amount, setAmount] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SelectedRecipient[]>([]);

    const handleSelectCoin = (coinName: string) => {
        setSelectedCoin(coinName);
        setIsCoinModalOpen(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Здесь будет API запрос для поиска пользователей
        // Пока используем mock данные
        if (query.trim()) {
            setSearchResults([
                { id: '1', username: 'user1', photoUrl: '' },
                { id: '2', username: 'user2', photoUrl: '' },
            ]);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectRecipient = (recipient: SelectedRecipient) => {
        setSelectedRecipient(recipient);
        setIsRecipientModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleReceive = () => {
        // Здесь будет логика получения
        console.log('Receive:', { coin: selectedCoin, recipient: selectedRecipient, amount });
    };

    const displayRecipient = selectedRecipient?.username || 'Получатель';
    const displayPhotoUrl = selectedRecipient?.photoUrl || telegramPhotoUrl || '';

    return (
        <div className={cls.send}>
            <h1 className={cls.title}>Получить</h1>

            {/* Карточка выбора монеты */}
            <div className={cls.card}>
                <span className={cls.cardLabel}>Монета</span>
                <div className={cls.cardContent} onClick={() => setIsCoinModalOpen(true)}>
                    <span className={selectedCoin ? cls.selectedValue : cls.placeholder}>
                        {selectedCoin ? selectedCoin.toUpperCase() : 'Выберите монету'}
                    </span>
                    <div className={cls.cardButton}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 3L7.5 6L4.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Карточка выбора получателя */}
            <div className={cls.card + ' ' + cls.comsumer}>
                <span className={cls.cardLabel}>Кому</span>
                <div className={cls.cardContent} onClick={() => setIsRecipientModalOpen(true)}>
                    <span className={selectedRecipient ? cls.selectedValue : cls.placeholder}>
                        {displayRecipient}
                    </span>
                    <div className={cls.cardButtonSquare}>
                        <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12V14H17V12C17 12 17 8 11 8C5 8 5 12 5 12ZM8 3C8 2.40666 8.17595 1.82664 8.50559 1.33329C8.83524 0.839943 9.30377 0.455426 9.85195 0.228363C10.4001 0.00129986 11.0033 -0.0581102 11.5853 0.0576455C12.1672 0.173401 12.7018 0.459123 13.1213 0.878681C13.5409 1.29824 13.8266 1.83279 13.9424 2.41473C14.0581 2.99667 13.9987 3.59987 13.7716 4.14805C13.5446 4.69623 13.1601 5.16477 12.6667 5.49441C12.1734 5.82405 11.5933 6 11 6C10.2044 6 9.44129 5.68393 8.87868 5.12132C8.31607 4.55871 8 3.79565 8 3ZM4.8 8.06C4.25337 8.5643 3.81267 9.17244 3.50362 9.84891C3.19457 10.5254 3.02337 11.2566 3 12V14H0V12C0 12 0 8.55 4.8 8.06ZM6 1.1415e-06C6.30215 1.87014e-05 6.60244 0.0472552 6.89 0.140001C6.30495 0.97897 5.99127 1.97718 5.99127 3C5.99127 4.02282 6.30495 5.02103 6.89 5.86C6.60244 5.95275 6.30215 5.99998 6 6C5.20435 6 4.44129 5.68393 3.87868 5.12132C3.31607 4.55871 3 3.79565 3 3C3 2.20435 3.31607 1.44129 3.87868 0.878681C4.44129 0.316072 5.20435 1.1415e-06 6 1.1415e-06ZM16 5H19V2H21V5H24V7H21V10H19V7H16V5Z" fill="white"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Карточка ввода суммы */}
            <div className={cls.card}>
                <span className={cls.cardLabel}>Сумма</span>
                <div className={cls.amountInput}>
                    <input
                        type="number"
                        placeholder="Введите сумму"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>

            {/* Комиссия */}
            <div className={cls.commission}>
                <span className={cls.commissionLabel}>Комиссия:</span>
                <span className={cls.commissionValue}>0.00</span>
            </div>

            {/* Кнопка Получить */}
            <Button onClick={handleReceive} customClass={cls.receiveButton}>
                Получить
            </Button>

            {/* Модальное окно выбора монеты */}
            <Modal 
                isOpen={isCoinModalOpen} 
                onClose={() => setIsCoinModalOpen(false)} 
                title="Выберите монету"
            >
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

            {/* Модальное окно выбора получателя */}
            <Modal 
                isOpen={isRecipientModalOpen} 
                onClose={() => {
                    setIsRecipientModalOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                }} 
                title="Выберите получателя"
            >
                <div className={cls.modalContent}>
                    <input
                        type="text"
                        className={cls.searchInput}
                        placeholder="Введите username"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div className={cls.userList}>
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    className={`${cls.userItem} ${selectedRecipient?.id === user.id ? cls.active : ''}`}
                                    onClick={() => handleSelectRecipient(user)}
                                >
                                    <UserAvatar avatar={user.photoUrl || ''} name={user.username} />
                                    <span className={cls.userItemUsername}>@{user.username}</span>
                                    {selectedRecipient?.id === user.id && (
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                            ))
                        ) : (
                            searchQuery.trim() && (
                                <div className={cls.emptyState}>
                                    <span>Пользователи не найдены</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Send;

