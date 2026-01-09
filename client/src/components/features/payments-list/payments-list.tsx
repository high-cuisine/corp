'use client'
import { useEffect } from 'react'
import { PaymentCard } from '@/components/ui/payment-card/payment-card'
import cls from './payments-list.module.scss'
import { Fragment } from 'react/jsx-runtime'
import { Transaction, usePaymentStore } from '@/entites/payment/model/payment'
import { paymentServiceInstance } from '@/features/payment/payment'

interface PaymentListProps {
    title?: string
}

const PaymentList = ({title}:PaymentListProps) => {
    const { transactions, setTransactions } = usePaymentStore();

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                await paymentServiceInstance.getTransactions();
            } catch (error) {
                console.error('Error loading transactions:', error);
            }
        };
        loadTransactions();
    }, [setTransactions]);

    return (
        <ul className={cls.list}>
            {title ? <h3>{title}</h3> : null}
            {
                transactions.length > 0 ? (
                    transactions.map((el: Transaction) => 
                        <Fragment key={el.id}>
                            <PaymentCard 
                                amount={el.amount} 
                                date={el.createdAt} 
                                type={el.type}
                                token={el.token}
                            />
                        </Fragment>
                    )
                ) : (
                    <li className={cls.empty}>Нет транзакций</li>
                )
            }
        </ul>
    )
}

export { PaymentList }