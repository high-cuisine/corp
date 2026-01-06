import { UserAvatar } from '@/components/ui/userAvatar/userAvatar';
import cls from './friendsList.module.scss';

const FriendsList = () => {

    const friends = [
        {
            id: 1,
            name: 'John Doe',
            avatar: 'https://c1.peakpx.com/wallpaper/623/966/324/grey-and-white-short-fur-cat-wallpaper-preview.jpg',
        },
        {
            id: 2,
            name: 'Jane Doe',
            avatar: null,
        }
    ]
    return (
        <div className={cls.friendsList}>
            <h3 className={cls.friendsListTitle}>Мои друзья</h3>
            <div className={cls.listContainer}>
                {friends.map((friend) => (
                    <div className={cls.friendItem} key={friend.id}>
                        <UserAvatar avatar={friend.avatar || ''} name={friend.name} />
                        <span>@{friend.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FriendsList;