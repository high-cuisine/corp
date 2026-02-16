'use client';

import { useEffect, useState } from 'react';
import { UserAvatar } from '@/components/ui/userAvatar/userAvatar';
import { userService } from '@/entites/user/api/api';
import cls from './friendsList.module.scss';

export interface FriendItem {
  id: number;
  username: string | null;
  photoUrl: string | null;
  invitedAt: string;
}

const FriendsList = () => {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    userService
      .getFriends()
      .then((data) => {
        if (!cancelled) setFriends(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Не удалось загрузить список друзей');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const avatarUrl = (photoUrl: string | null) => {
    if (!photoUrl) return '';
    return photoUrl.startsWith('http') ? photoUrl : `/avatars/${photoUrl}`;
  };

  if (loading) {
    return (
      <div className={cls.friendsList}>
        <h3 className={cls.friendsListTitle}>Мои друзья</h3>
        <p className={cls.status}>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cls.friendsList}>
        <h3 className={cls.friendsListTitle}>Мои друзья</h3>
        <p className={cls.statusError}>{error}</p>
      </div>
    );
  }

  return (
    <div className={cls.friendsList}>
      <h3 className={cls.friendsListTitle}>Мои друзья</h3>
      <div className={cls.listContainer}>
        {friends.length === 0 ? (
          <p className={cls.empty}>Пока никого нет. Поделитесь ссылкой-приглашением.</p>
        ) : (
          friends.map((friend) => (
            <div className={cls.friendItem} key={friend.id}>
              <UserAvatar
                avatar={avatarUrl(friend.photoUrl)}
                name={friend.username ?? 'Пользователь'}
              />
              <span className={cls.username}>
                {friend.username ? `@${friend.username}` : 'Без имени'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsList;
