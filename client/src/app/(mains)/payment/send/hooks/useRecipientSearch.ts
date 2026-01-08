import { useState, useCallback } from 'react';
import { authService } from '@/features/user/authService';
import { SelectedRecipient } from './useSendForm';

interface UseRecipientSearchReturn {
    searchQuery: string;
    searchResults: SelectedRecipient[];
    isSearching: boolean;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
}

// Проверяет, является ли строка валидным username (без пробелов, минимум 1 символ)
const isValidUsername = (query: string): boolean => {
    const trimmed = query.trim();
    return trimmed.length > 0 && !trimmed.includes(' ');
};

export const useRecipientSearch = (): UseRecipientSearchReturn => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SelectedRecipient[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);
        
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
            const response = await authService.getUser(query.trim());
            
            if (response.user) {
                // Преобразуем данные пользователя в формат SelectedRecipient
                const recipient: SelectedRecipient = {
                    id: response.user.id?.toString() || response.user._id?.toString() || '',
                    username: response.user.username || query.trim(),
                    photoUrl: response.user.photoUrl || response.user.avatar || undefined,
                };
                setSearchResults([recipient]);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
    }, []);

    return {
        searchQuery,
        searchResults,
        isSearching,
        handleSearch,
        clearSearch,
    };
};

