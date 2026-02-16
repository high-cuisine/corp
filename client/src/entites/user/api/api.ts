import * as api from '@/shared/lib/api/api';

class UserService {
    async login(initData: string): Promise<{accessToken: string}> {
        const response = await api.$host.post('/users/login', { initData });
        return response.data;
    }

    async findUserByUsername(username: string): Promise<{id: number, username: string, photoUrl: string | null}> {
        const response = await api.$authHost.get(`/users/get-user-by-name?name=${username}`);
        // Сервер возвращает объект напрямую {id, username, photoUrl}
        return response.data;
    }

    async completeLevel(): Promise<{ id: number; level: number }> {
        const response = await api.$authHost.post('/game/end-level');
        return response.data;
    }

    async getAchievements(): Promise<{
        achievements: {
            id: number;
            title: string;
            description: string;
            type: string;
            targetValue: number | null;
            sortOrder: number;
            obtained: boolean;
        }[];
    }> {
        const response = await api.$authHost.get('/achievement');
        return response.data;
    }

    async getFriends(): Promise<{ id: number; username: string | null; photoUrl: string | null; invitedAt: string }[]> {
        const response = await api.$authHost.get('/users/friends');
        return response.data;
    }
}

export const userService = new UserService();