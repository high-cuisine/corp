'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import cls from './footer.module.scss'
import Image from 'next/image'

import MainIcon from '@assets/icons/main.svg';
import WorkIcon from '@assets/icons/work.svg';
import PaymentIcon from '@assets/icons/payment.svg';
import FriendsIcon from '@assets/icons/friends.svg';

const Footer = () => {
    const pathname = usePathname()

    const links = [
        { href: '/', icon: MainIcon },
        { href: '/work', icon: WorkIcon },
        { href: '/payment', icon: PaymentIcon },
        { href: '/friends', icon: FriendsIcon },
    ]

    return (
        <nav className={cls.nav}>
            {links.map((link) => {
                const isActive = pathname === link.href
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${cls.link} ${isActive ? cls.active : ''}`}
                    >
                        <Image src={link.icon} alt={link.icon} width={40} height={40} />
                    </Link>
                )
            })}
        </nav>
    )
}

export { Footer }