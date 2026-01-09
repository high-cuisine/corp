import cls from './payment-card.module.scss'
import ArrowPaymentIcon from '@assets/icons/payment_send.svg'
import Image from 'next/image'

type TransactionType = 'SEND' | 'RECEIVE' | 'SWITCH_OUT' | 'SWITCH_IN' | 'TOPUP';

interface PaymentCardProps {
    type: TransactionType;
    date: string | Date;
    amount: string | number;
    token?: 'TON' | 'COIN';
}

const PaymentCard = ({type, date, amount, token}:PaymentCardProps) => {
    const getTypeLabel = (): string => {
        switch(type) {
            case 'SEND':
                return 'Отправлено';
            case 'RECEIVE':
                return 'Получено';
            case 'SWITCH_OUT':
            case 'SWITCH_IN':
                return 'Обмен';
            case 'TOPUP':
                return 'Пополнение';
            default:
                return 'Транзакция';
        }
    };

    const getCardType = (): 'get' | 'send' => {
        if (type === 'RECEIVE' || type === 'TOPUP' || type === 'SWITCH_IN') {
            return 'get';
        }
        return 'send';
    };

    const formatDate = (dateValue: string | Date): string => {
        const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        return dateObj.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatAmount = (): string => {
        const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
        return amountNum.toFixed(2);
    };

    const cardType = getCardType();

    return (
        <div className={cls.card}>
            <div className={cls.leftContainer}>
                <div className={cls.icon}>
                    <Image style={{rotate: cardType === 'get' ? '180deg' : '0'}} src={ArrowPaymentIcon} alt={'arrow'}/>
                </div>
                <div className={cls.textContainer}>
                    <span>{getTypeLabel()}</span>
                    <span>{formatDate(date)}</span>
                </div>
            </div>
            <div className={cls.rightContainer}>
                <span>{formatAmount()} {token || ''}</span>
            </div>
        </div>
    )
}

export { PaymentCard }