import { PaymentCard } from '@/components/ui/payment-card/payment-card'
import cls from './payments-list.module.scss'
import { Fragment } from 'react/jsx-runtime'

interface PaymentListProps {
    title?: string
}

const PaymentList = ({title}:PaymentListProps) => {
    const payments = [
        {
            id: 1,
            type: 'send' as any,
            amount:5,
            from: 'address',
            date: new Date(0)
        },
        {
            id: 2,
            type: 'send' as any,
            amount:5,
            from: 'address',
            date: new Date(0)
        },
        {
            id: 3,
            type: 'get' as any,
            amount:5,
            from: 'address',
            date: new Date(0)
        },
    ]
    return (
        <ul className={cls.list}>
            {title ? <h3>{title}</h3> : null}
            {
                payments.map(el => 
                    <Fragment key={el.id}>
                        <PaymentCard amount={el.amount} date={el.date} from={el.from} type={el.type}></PaymentCard>
                    </Fragment>
                )
            }
        </ul>
    )
}

export { PaymentList }