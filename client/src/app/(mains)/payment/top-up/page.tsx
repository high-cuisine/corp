'use client'
import { useState } from 'react';
import { useUserStore } from '@/entites/user/model/user';
import cls from './topUp.module.scss';
import { UserAvatar } from '@/components/ui/userAvatar/userAvatar';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import { Modal } from '@/components/layout/modal/modal';
import Button from '@/components/ui/button/button';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

interface SelectedUser {
    id: string;
    username: string;
    photoUrl?: string;
}

const TopUp = () => {
    const { user } = useUserStore();
    const { username: telegramUsername, photoUrl: telegramPhotoUrl } = useTelegram();
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [amount, setAmount] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SelectedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock users для демонстрации (в реальном проекте это будет API запрос)
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

    const handleSelectUser = (user: SelectedUser) => {
        setSelectedUser(user);
        setIsUserModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleTopUp = () => {
        if (!amount || parseFloat(amount) <= 0) {
            return;
        }
        setIsTopUpModalOpen(true);
    };

    const handleConnectWallet = () => {
        tonConnectUI.openModal();
    };

    const handleSignTransaction = async () => {
        if (!address || !amount) return;

        try {
            setIsLoading(true);
            
            // Здесь должен быть адрес получателя (контракт или адрес для пополнения)
            // Пока используем заглушку - в реальном проекте нужно получить адрес с бэкенда
            const recipientAddress = 'EQD__________________________________________0vo'; // Замените на реальный адрес
            
            // Конвертируем TON в нанотонны (1 TON = 1,000,000,000 нанотонов)
            const amountInNano = (parseFloat(amount) * 1000000000).toString();
            
            const transaction = {
                messages: [
                    {
                        address: recipientAddress,
                        amount: amountInNano,
                    },
                ],
                validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
            };

            await tonConnectUI.sendTransaction(transaction);
            
            // После успешной транзакции закрываем модальное окно
            setIsTopUpModalOpen(false);
            setAmount('');
        } catch (error) {
            console.error('Transaction error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const displayUsername = selectedUser?.username || telegramUsername || 'User name';
    const displayPhotoUrl = selectedUser?.photoUrl || telegramPhotoUrl || '';

    return (
        <div className={cls.topUp}>
            <h1 className={cls.title}>Пополнение</h1>
            <p className={cls.description}>Пополните баланс приложения монетой NAME с вашего кошелька TON</p>

            <div className={cls.form}>
                <div className={cls.upContainer}>
                    <span className={cls.label}>Пополнить</span>
                    <span className={cls.balance}>Баланс: {user?.balance || 1000}</span>
                </div>
                
                <div className={cls.userInfo} onClick={() => setIsUserModalOpen(true)}>
                    <div className={cls.userInfoAvatar}>
                        <UserAvatar avatar={displayPhotoUrl} name={displayUsername} />
                    </div>
                    <span className={cls.username}>@{displayUsername}</span>
                    <svg className={cls.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 5L12.5 10L7.5 15" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <div className={cls.inputContainer}>
                    <input
                        type="number"
                        className={cls.amountInput}
                        placeholder="Введите сумму"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

            </div>
            
            <div className={cls.details}>
                    <div className={cls.detailRow}>
                        <span className={cls.detailLabel}>Комиссия:</span>
                        <span className={cls.detailValue}>0.00</span>
                    </div>
                    <div className={cls.detailRow}>
                        <span className={cls.detailLabel}>Курс:</span>
                        <span className={cls.detailValue}>$0.001733</span>
                    </div>
                </div>
            <Button onClick={handleTopUp} customClass={cls.submitButton}>
                Пополнить
            </Button>

            <Modal isOpen={isUserModalOpen} onClose={() => {
                setIsUserModalOpen(false);
                setSearchQuery('');
                setSearchResults([]);
            }} title="Выберите пользователя">
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
                                    className={`${cls.userItem} ${selectedUser?.id === user.id ? cls.active : ''}`}
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <UserAvatar avatar={user.photoUrl || ''} name={user.username} />
                                    <span className={cls.userItemUsername}>@{user.username}</span>
                                    {selectedUser?.id === user.id && (
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

            <Modal isOpen={isTopUpModalOpen} onClose={() => {
                if (!isLoading) {
                    setIsTopUpModalOpen(false);
                }
            }} title="Пополнение TON">
                <div className={cls.topUpModalContent}>
                    <div className={cls.transactionInfo}>
                        <div className={cls.infoRow}>
                            <span className={cls.infoLabel}>Сумма:</span>
                            <span className={cls.infoValue}>{amount} TON</span>
                        </div>
                        <div className={cls.infoRow}>
                            <span className={cls.infoLabel}>Получатель:</span>
                            <span className={cls.infoValue}>@{displayUsername}</span>
                        </div>
                        <div className={cls.infoRow}>
                            <span className={cls.infoLabel}>Комиссия:</span>
                            <span className={cls.infoValue}>0.00 TON</span>
                        </div>
                    </div>

                    {!address ? (
                        <div className={cls.walletSection}>
                            <p className={cls.walletText}>Для пополнения необходимо подключить кошелек TON</p>
                            <Button onClick={handleConnectWallet} customClass={cls.walletButton}>
                                Выбрать кошелек
                            </Button>
                        </div>
                    ) : (
                        <div className={cls.walletSection}>
                            <div className={cls.walletConnected}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>Кошелек подключен</span>
                            </div>
                            <Button 
                                onClick={handleSignTransaction} 
                                customClass={cls.signButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Подписание...' : 'Подписать транзакцию'}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default TopUp;
