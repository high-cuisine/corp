'use client'
import cls from './header.module.scss';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

const Header = () => {
    const { username } = useTelegram();
    
    return (
        <header className={cls.header}>
            <div className={cls.button}>
                <span>{'@' + (username || 'test')}</span>
            </div>
            <div className={cls.button}>
                <span>?</span>
            </div>
        </header>
    )
}

export { Header }