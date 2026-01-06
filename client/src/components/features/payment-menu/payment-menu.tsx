import cls from './payment-menu.module.scss';
import { paymentUIConfig } from '@/shared/configs/payment.config';
import Image from 'next/image';
import Link from 'next/link';

const PaymentMenu = () => {

    return (
        <div className={cls.menu}>
            {
                paymentUIConfig.map(el => 
                    <div key={el.links}>
                        <Link className={cls.button} href={el.links}>
                            <div className={cls.icon}>
                                <Image src={el.icon} alt={el.label} width={12} height={12} />
                            </div>
                        </Link>
                        <span>{el.label}</span>
                    </div>
                )
            }
        </div>
    )
}

export { PaymentMenu }