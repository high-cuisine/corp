'use client'
import { useState } from 'react';
import { useUserStore } from '@/entites/user/model/user';
import cls from './topUp.module.scss';
import { UserAvatar } from '@/components/ui/userAvatar/userAvatar';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import { Modal } from '@/components/layout/modal/modal';
import Button from '@/components/ui/button/button';
import { useTopUpForm, SelectedUser } from './hooks/useTopUpForm';
import { useUserSearch } from './hooks/useUserSearch';
import { useTopUpTransaction } from './hooks/useTopUpTransaction';
import { 
    validateAmount, 
    getUserDisplayName, 
    getUserPhotoUrl, 
    calculateCommission 
} from './helpers/topUp.helpers';

const TopUp = () => {
    const { user } = useUserStore();
    const { username: telegramUsername, photoUrl: telegramPhotoUrl } = useTelegram();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    
    const {
        selectedUser,
        amount,
        setSelectedUser,
        setAmount,
        resetForm,
    } = useTopUpForm();

    const {
        searchQuery,
        searchResults,
        handleSearch,
        clearSearch,
    } = useUserSearch();

    const {
        isLoading,
        address,
        handleConnectWallet,
        handleSignTransaction,
    } = useTopUpTransaction();

    const handleSelectUser = (user: SelectedUser) => {
        setSelectedUser(user);
        setIsUserModalOpen(false);
        clearSearch();
    };

    const handleCloseUserModal = () => {
        setIsUserModalOpen(false);
        clearSearch();
    };

    const handleTopUp = () => {
        if (!validateAmount(amount)) {
            return;
        }
        setIsTopUpModalOpen(true);
    };

    const handleCloseTopUpModal = () => {
        if (!isLoading) {
            setIsTopUpModalOpen(false);
        }
    };

    const handleSignTransactionClick = async () => {
        try {
            await handleSignTransaction(amount);
            setIsTopUpModalOpen(false);
            resetForm();
        } catch (error) {
            // Ошибка уже обработана в хуке
        }
    };

    const displayUsername = getUserDisplayName(selectedUser, telegramUsername || 'User name');
    const displayPhotoUrl = getUserPhotoUrl(selectedUser, telegramPhotoUrl || '');
    const commission = calculateCommission(amount);

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
                        <span className={cls.detailValue}>{commission}</span>
                    </div>
                    <div className={cls.detailRow}>
                        <span className={cls.detailLabel}>Курс:</span>
                        <span className={cls.detailValue}>$0.001733</span>
                    </div>
                </div>
            <Button onClick={handleTopUp} customClass={cls.submitButton}>
                Пополнить
            </Button>

            <Modal isOpen={isUserModalOpen} onClose={handleCloseUserModal} title="Выберите пользователя">
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

            <Modal isOpen={isTopUpModalOpen} onClose={handleCloseTopUpModal} title="Пополнение TON">
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
                            <span className={cls.infoValue}>{commission} TON</span>
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
                                onClick={handleSignTransactionClick} 
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
