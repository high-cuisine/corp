'use client'
import cls from './toasts.module.scss';
import { useToastStore } from '@/shared/lib/stores/toast.store';
import { useEffect } from 'react';
import eventBus from '@/features/eventbus/eventbus';

const Toasts = () => {
    const { toasts, removeToast, addToast } = useToastStore();

    useEffect(() => {
        const handleToast = (event: { message: string; type: 'success' | 'error' | 'warning' | 'info'; duration?: number }) => {
            addToast(event.message, event.type, event.duration);
        };

        eventBus.on('toast', handleToast);

        return () => {
            eventBus.off('toast', handleToast);
        };
    }, [addToast]);

    return (
        <div className={cls.toasts}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${cls.toast} ${cls[toast.type]}`}
                    onClick={() => removeToast(toast.id)}
                >
                    <div className={cls.toastContent}>
                        <span className={cls.message}>{toast.message}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Toasts }
