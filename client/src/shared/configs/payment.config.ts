import PaymentPluseIcon from '@assets/icons/payment_pluse.svg'
import PaymentSwitchIcon from '@assets/icons/payment_switch.svg'
import PaymentGetIcon from '@assets/icons/payment_get.svg'
import PaymentSendIcon from '@assets/icons/payment_send.svg'

export const paymentUIConfig = [
    {
        label: 'Пополнить',
        icon: PaymentPluseIcon,
        links: '/payment/top-up',
    },
    {
        label: 'Обменять',
        icon: PaymentSwitchIcon,
        links: '/payment/switch',
    },
    {
        label: 'Получить',
        icon: PaymentGetIcon,
        links: '/payment/qrcode',
    },
    {
        label: 'Отправить',
        icon: PaymentSendIcon,
        links: '/payment/send',
    },
]