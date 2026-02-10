import { userService } from '@/entites/user/api/api';
import { useUserStore } from '@/entites/user/model/user';
import { jwtDecode } from 'jwt-decode';

class AuthService {
    async login(initData: string): Promise<{accessToken: string}> {
        const response = await userService.login(initData);
        localStorage.setItem('accessToken', response.accessToken);
        const decodedToken = jwtDecode(response.accessToken) as any;
        useUserStore.getState().setUser(decodedToken);
        return response;
    }

    async getUser(username: string): Promise<{id: number, username: string, photoUrl: string | null}> {
        return await userService.findUserByUsername(username);
    }

    async completeLevel(): Promise<{ id: number; level: number }> {
        const result = await userService.completeLevel();
        const { user, setUser } = useUserStore.getState();
        if (user) {
            setUser({ ...user, level: result.level });
        }
        return result;
    }

}

export const authService = new AuthService();

