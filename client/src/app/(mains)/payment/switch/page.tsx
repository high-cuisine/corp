'use client'
import { Modal } from '@/components/layout/modal/modal';
import Button from '@/components/ui/button/button';
import { useCoinExchange } from './hooks/useCoinExchange';
import { useSwitchTransaction } from './hooks/useSwitchTransaction';
import { COINS } from './helpers/coins.helper';
import cls from './switch.module.scss';

const Switch = () => {
    const {
        sellCoin,
        buyCoin,
        sellAmount,
        buyAmount,
        isSellCoinModalOpen,
        isBuyCoinModalOpen,
        setSellAmount,
        setBuyAmount,
        openSellCoinModal,
        closeSellCoinModal,
        openBuyCoinModal,
        closeBuyCoinModal,
        handleSelectSellCoin,
        handleSelectBuyCoin,
        handleSwap,
    } = useCoinExchange();

    const {
        isLoading,
        handleExchange,
    } = useSwitchTransaction();

    const handleExchangeClick = async () => {
        await handleExchange(sellCoin, buyCoin, sellAmount);
    };

    return (
        <div className={cls.switch}>
            <h1 className={cls.title}>Обменять</h1>

            <div className={cls.exchangeContainer}>
                {/* Секция Продаю */}
                <div className={cls.section}>
                    <span className={cls.sectionLabel}>Продаю</span>
                    
                    <div className={cls.coinSelector} onClick={openSellCoinModal}>
                        {sellCoin ? (
                            <span className={cls.selectedCoin}>{sellCoin.toUpperCase()}</span>
                        ) : (
                            <span className={cls.placeholder}>Выберите монету</span>
                        )}
                        <div className={cls.coinButton}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 3L7.5 6L4.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className={cls.amountInput}>
                        <input
                            type="number"
                            placeholder="Сумма"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Иконка обмена */}
                <button className={cls.swapButton} onClick={handleSwap}>
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.75 18.2268L13.4167 23.1499L8.08337 18.2268M13.4167 22.4661L13.4167 11.4166L13.4167 22.4661Z" fill="url(#paint0_linear_1_409)"/>
                        <path d="M18.75 18.2268L13.4167 23.1499L8.08337 18.2268M13.4167 22.4661L13.4167 11.4166" stroke="#647AAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M0.74996 5.67308L6.08329 0.75L11.4166 5.67308M6.08329 1.43376L6.08329 12.4833L6.08329 1.43376Z" fill="url(#paint1_linear_1_409)"/>
                        <path d="M0.74996 5.67308L6.08329 0.75L11.4166 5.67308M6.08329 1.43376L6.08329 12.4833" stroke="#647AAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                        <linearGradient id="paint0_linear_1_409" x1="13.4167" y1="23.1499" x2="13.4167" y2="11.4166" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#647AAB" stopOpacity="0.1"/>
                        <stop offset="1" stopColor="#647AAB" stopOpacity="0.2"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_1_409" x1="6.08329" y1="0.75" x2="6.08329" y2="12.4833" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#647AAB" stopOpacity="0.1"/>
                        <stop offset="1" stopColor="#647AAB" stopOpacity="0.2"/>
                        </linearGradient>
                        </defs>
                    </svg>
                </button>

                {/* Секция Покупаю */}
                <div className={cls.section}>
                    <span className={cls.sectionLabel}>Покупаю</span>
                    
                    <div className={cls.coinSelector} onClick={openBuyCoinModal}>
                        {buyCoin ? (
                            <span className={cls.selectedCoin}>{buyCoin.toUpperCase()}</span>
                        ) : (
                            <span className={cls.placeholder}>Выберите монету</span>
                        )}
                        <div className={cls.coinButton}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 3L7.5 6L4.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className={cls.amountInput}>
                        <input
                            type="number"
                            placeholder="Сумма"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Комиссия */}
            <div className={cls.commission}>
                <span className={cls.commissionLabel}>Комиссия:</span>
                <span className={cls.commissionValue}>0.00</span>
            </div>

            {/* Кнопка Обменять */}
            <Button 
                onClick={handleExchangeClick} 
                customClass={cls.exchangeButton}
                disabled={isLoading}
            >
                {isLoading ? 'Обмен...' : 'Обменять'}
            </Button>

            {/* Модальное окно выбора монеты для продажи */}
            <Modal 
                isOpen={isSellCoinModalOpen} 
                onClose={closeSellCoinModal} 
                title="Выберите монету"
            >
                <div className={cls.coinList}>
                    {COINS.map((coin) => (
                        <button
                            key={coin.name}
                            className={`${cls.coinItem} ${sellCoin === coin.name ? cls.active : ''}`}
                            onClick={() => handleSelectSellCoin(coin.name)}
                        >
                            <span>{coin.name.toUpperCase()}</span>
                            {sellCoin === coin.name && (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </Modal>

            {/* Модальное окно выбора монеты для покупки */}
            <Modal 
                isOpen={isBuyCoinModalOpen} 
                onClose={closeBuyCoinModal} 
                title="Выберите монету"
            >
                <div className={cls.coinList}>
                    {COINS.map((coin) => (
                        <button
                            key={coin.name}
                            className={`${cls.coinItem} ${buyCoin === coin.name ? cls.active : ''}`}
                            onClick={() => handleSelectBuyCoin(coin.name)}
                        >
                            <span>{coin.name.toUpperCase()}</span>
                            {buyCoin === coin.name && (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default Switch;

