'use client';
import { useEffect } from 'react';
import { useTelegram } from '../../shared/lib/hooks/useTelegram';
import { authService } from './authService';

export const AuthComponent = () => {
    const { initData } = useTelegram();
    useEffect(() => {
        if (initData) {
            authService.login(initData);
        }
        else {
            console.log('No init data');
        }
    }, [initData]);
    return null;
};