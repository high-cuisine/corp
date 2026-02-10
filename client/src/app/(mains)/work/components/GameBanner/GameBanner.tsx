'use client'
import GameImage from '@/assets/images/game.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import cls from './GameBanner.module.scss'
import { useUserStore } from '@/entites/user/model/user'
import { useRef } from 'react'
import Button from '@/components/ui/button/button'

const GameBanner = () => {

    const { user } = useUserStore();
    const router = useRouter();
    const imageRef = useRef(null);

    const startGame = () => {
        if (!imageRef.current) return;
        (imageRef.current as HTMLImageElement).style.transform = 'scale(17) translateY(28%)';
        (imageRef.current as HTMLImageElement).style.zIndex = '1000';

        setTimeout(() => {
            router.push('/game');
        }, 3000);
    }
    
    return (
        <div className={cls.banner}>
            <div className={cls.levelCounter}>{(user?.level || 0) + 1} Уровень</div>
            <Image src={GameImage} alt="" className={cls.image} ref={imageRef}></Image>

           <Button children={'Начать работу'} onClick={startGame}></Button>
        </div>
    )
}

export { GameBanner }