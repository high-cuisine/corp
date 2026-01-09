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
}

export const userService = new UserService();