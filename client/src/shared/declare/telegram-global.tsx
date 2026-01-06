declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                ready(): unknown;
                initData: string;
                initDataUnsafe?: {
                    user?: {
                        id: number;
                        first_name: string;
                        username: string;
                        photo_url: string;
                    };
                };
                HapticFeedback?: {
                    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
                };
                disableVerticalSwipes: () => void;
                shareToStory: (options: {
                  media_url: string;
                  text: string;
                  widget_link: {
                    url: string;
                    name: string;
                  };
                }) => void;
                expand: () => void;
                isExpanded?: boolean;
                onEvent: (event: string, callback: (data: Record<string, unknown>) => void) => void;
                offEvent: (event: string) => void;
                openWallet: (params?: { url?: string }) => void;
            };
        };
        TelegramWebviewProxy?: {
            postEvent: (eventType: string, eventData: unknown) => void;
        };
    }
}

const TelegramGlobal = () => {
    return (
        <></>
    )
}

export { TelegramGlobal };