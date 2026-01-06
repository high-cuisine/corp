import cls from './index.module.scss'
import Image from 'next/image'

import bannerImage from '@assets/images/1 1111111112.png';
import { Balance } from './components/balance/balance';
import { PaymentMenu } from '@/components/features/payment-menu/payment-menu';
import { PaymentList } from '@/components/features/payments-list/payments-list';

export default function Home() {
  return (
    <div className={cls.main}>
      <Image className={cls.bannerImage} src={bannerImage} alt=''></Image>
      <Balance></Balance>
      <PaymentMenu></PaymentMenu>
      <PaymentList></PaymentList>
    </div>
  );
}
