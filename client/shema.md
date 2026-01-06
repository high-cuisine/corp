src/
├── app/                    # Next.js App Router (страницы и layouts)
│   ├── (mains)/
│   └── (secondary)/
│
├── components/             # Переиспользуемые UI компоненты
│   ├── ui/                 # Базовые компоненты (Button, Card, Input и т.д.)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.scss
│   │   │   └── index.ts
│   │   └── ...
│   ├── layout/             # Layout компоненты (Header, Footer, Sidebar)
│   │   ├── Header/
│   │   └── Footer/
│   └── features/           # Feature-specific компоненты
│
├── features/               # Бизнес-логика по доменам (Feature-Sliced Design)
│   ├── navigation/
│   │   ├── config/
│   │   │   └── routes.ts   # Конфигурация маршрутов
│   │   ├── hooks/
│   │   │   └── useActiveRoute.ts
│   │   └── components/
│   │       └── NavLink/
│   ├── user/
│   │   ├── api/            # API вызовы
│   │   ├── hooks/
│   │   └── components/
│   └── ...
│
├── shared/                 # Общие утилиты и константы
│   ├── lib/                # Утилиты
│   │   ├── utils.ts
│   │   └── cn.ts           # Утилита для объединения классов
│   ├── hooks/              # Общие хуки
│   ├── types/              # TypeScript типы
│   └── constants/          # Константы
│
├── assets/                 # Статические ресурсы
└── styles/                 # Глобальные стили (если нужны)


//login

//get-transactions

//achivments 

//start-game

//game-result

//got-money + ton

//switch

//got-money //rename later

//send


---shema

user

telegramId
username
currentLevel



tokens

id
symbol
balance
name


user_balances

id
userId
tokenId
balance

