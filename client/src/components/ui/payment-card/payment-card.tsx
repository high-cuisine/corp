import cls from './payment-card.module.scss'
import ArrowPaymentIcon from '@assets/icons/payment_send.svg'
import Image from 'next/image'
interface PaymentCardProps {
    type:'get' | 'send',
    date: Date,
    amount: number,
    from: string
}

const PaymentCard = ({type, date, amount, from}:PaymentCardProps) => {

    return (
        <div className={cls.card}>
            <div className={cls.leftContainer}>
                <div className={cls.icon}>
                    <Image style={{rotate: type === 'get' ? '180deg' : '0'}} src={ArrowPaymentIcon} alt={'arrow'}/>
                </div>
                <div className={cls.textContainer}>
                    <span>
                    {
                        type === 'send' ? "Отправлено" : "Получено"
                    }
                    </span>
                    <span>{date.toDateString()}</span>
                </div>
            </div>
            <div className={cls.rightContainer}>
                <span>{amount.toFixed(2)}</span>
                <span>{from}</span>
            </div>
        </div>
    )
}

export { PaymentCard }