'use client'
import cls from './invite.module.scss';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import Button from '@/components/ui/button/button';
import { copyToClipboard } from '@/shared/lib/helpers/copyToClipboard';
import { useToast } from '@/shared/lib/hooks/useToast';

const Invite = () => {

    const { telegramId } = useTelegram();
    const { success } = useToast();

    const link = `https://t.me/${telegramId}`;

    const handleCopy = async () => {
        const copied = await copyToClipboard(link);
        if (copied) {
            success('Ссылка скопирована');
        }
    };

    return (
        <div className={cls.invite}>
            <div className={cls.linkContainer}>
                <div className={cls.link}>
                    <span className={cls.linkText}>Ваша ссылка аккаунта:</span>
                    <span className={cls.linkValue}>{link}</span>
                </div>
                <button className={cls.copyButton} onClick={handleCopy}>
                    <svg className={cls.copyIcon} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.3333 4H5.33325V21.3333" stroke="#EFEFEF" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.6665 9.33331H26.6665V25.3333C26.6665 26.0406 26.3856 26.7188 25.8855 27.2189C25.3854 27.719 24.7071 28 23.9998 28H13.3332C12.6259 28 11.9477 27.719 11.4476 27.2189C10.9475 26.7188 10.6665 26.0406 10.6665 25.3333V9.33331Z" stroke="#EFEFEF" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

           <Button
            onClick={() => {}}
            >
                Добавить друга
            </Button>
        </div>
    )
}

export { Invite }