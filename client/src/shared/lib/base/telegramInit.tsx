'use client'
import { useEffect } from "react";
import { isMobile } from 'react-device-detect'

const TelegramInit = () => {
    useEffect(() => {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.disableVerticalSwipes();
    
          if (!window.Telegram.WebApp.isExpanded) {
            window.Telegram.WebApp.expand();
          }
    
          setTimeout(() => {
            if(!isMobile) return;
            if (window.Telegram?.WebApp) {
              window.Telegram.WebApp.onEvent("fullscreen_failed", (error) => {
                console.warn("Fullscreen request failed:", error);
              });
        
              window.Telegram.WebApp.onEvent("fullscreen_changed", (data) => {
                console.log("Fullscreen changed:", data);
              });
            }
          }, 200)
    
          return () => {
            window.Telegram?.WebApp?.offEvent("fullscreen_failed");
            window.Telegram?.WebApp?.offEvent("fullscreen_changed");
          };
        }
      }, []);

    return null;
}

export default TelegramInit;