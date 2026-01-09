import { useState, useCallback, useEffect, useRef } from 'react';
import { authService } from '@/features/user/authService';
import { SelectedRecipient } from './useSendForm';

interface UseRecipientSearchReturn {
    searchQuery: string;
    searchResults: SelectedRecipient[];
    isSearching: boolean;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
}

interface UseRecipientSearchProps {
    selectedRecipient?: SelectedRecipient | null;
}

// Проверяет, является ли строка валидным username (без пробелов, минимум 1 символ)
const isValidUsername = (query: string): boolean => {
    const trimmed = query.trim();
    return trimmed.length > 0 && !trimmed.includes(' ');
};

export const useRecipientSearch = (props?: UseRecipientSearchProps): UseRecipientSearchReturn => {
    const { selectedRecipient } = props || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SelectedRecipient[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        // Проверяем, что пользователь полностью ввел имя (валидный username)
        if (!isValidUsername(query)) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Используем authService.getUser для проверки пользователя
            // Сервер возвращает объект напрямую {id, username, photoUrl}
            const userData = await authService.getUser(query.trim());
            
            if (userData && userData.id !== undefined && userData.username) {
                // Преобразуем данные пользователя в формат SelectedRecipient
                const recipient: SelectedRecipient = {
                    id: String(userData.id),
                    username: userData.username,
                    photoUrl: userData.photoUrl || undefined,
                };
                
                // Показываем пользователя, даже если он уже выбран (он будет помечен как active)
                setSearchResults([recipient]);
            } else {
                setSearchResults([]);
            }
        } catch (error: any) {
            console.error('Error searching users:', error);
            // Если пользователь не найден (404), показываем пустой результат
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [selectedRecipient]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        
        // Очищаем предыдущий таймер
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Если запрос пустой, сразу очищаем результаты
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        // Устанавливаем новый таймер на 2 секунды
        debounceTimerRef.current = setTimeout(() => {
            performSearch(query);
        }, 2000);
    }, [performSearch]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
    }, []);

    // Очищаем таймер при размонтировании
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        searchQuery,
        searchResults,
        isSearching,
        handleSearch,
        clearSearch,
    };
};

