import eventBus from '@/features/eventbus/eventbus';
import { ToastType } from '../stores/toast.store';

export const useToast = () => {
    const emitToast = (message: string, type: ToastType, duration?: number) => {
        eventBus.emit('toast', { message, type, duration });
    };

    return {
        success: (message: string, duration?: number) => emitToast(message, 'success', duration),
        error: (message: string, duration?: number) => emitToast(message, 'error', duration),
        info: (message: string, duration?: number) => emitToast(message, 'info', duration),
        warning: (message: string, duration?: number) => emitToast(message, 'warning', duration),
        toast: (message: string, type?: ToastType, duration?: number) => emitToast(message, type || 'info', duration),
    };
};

