import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from 'src/users/repositorys/user.repository';

@Injectable()
export class GameService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Обработка завершения уровня: инкрементируем уровень пользователя.
   * Возвращаем обновлённого пользователя (как минимум новое значение level).
   */
  async endLevel(userId: number): Promise<User> {
    return this.userRepository.incrementLevel(userId);
  }
}

