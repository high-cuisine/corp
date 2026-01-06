import { Injectable, OnModuleInit } from '@nestjs/common';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramUpdate implements OnModuleInit {
  constructor(private readonly telegramService: TelegramService) {}

  onModuleInit() {
    this.setupUpdates();
  }

  private setupUpdates() {
    const bot = this.telegramService.getBot();

    // Обработка команды /start
    bot.command('start', async (ctx: Context) => {
      await this.telegramService.start(ctx);
    });

    // Обработка текстовых сообщений
    bot.on('text', async (ctx: Context) => {
      // Здесь можно добавить логику обработки текстовых сообщений
      console.log('Received text message:', ctx.message);
    });

    // Обработка callback query (кнопки)
    bot.on('callback_query', async (ctx: Context) => {
      // Здесь можно добавить логику обработки callback query
      console.log('Received callback query:', ctx.callbackQuery);
    });

    // Обработка ошибок
    bot.catch((err: Error, ctx: Context) => {
      console.error('Telegram bot error:', err);
    });
  }
}

