import { useState, useCallback } from 'react';
import { userService } from '@/entites/user/api/api';
import { SelectedUser } from './useTopUpForm';

interface UseUserSearchReturn {
    searchQuery: string;
    searchResults: SelectedUser[];
    isSearching: boolean;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
}

export const useUserSearch = (): UseUserSearchReturn => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SelectedUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);
        
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // TODO: Заменить на реальный API запрос
            // const response = await userService.findUserByUsername(query);
            // setSearchResults(response.user ? [response.user] : []);
            
            // Временная mock логика
            setSearchResults([
                { id: '1', username: 'user1', photoUrl: '' },
                { id: '2', username: 'user2', photoUrl: '' },
            ]);
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

