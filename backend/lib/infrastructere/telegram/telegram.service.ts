import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }
    this.bot = new Telegraf(token);
    this.setupCommands();
  }

  async onModuleInit() {
    await this.bot.launch();
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  private setupCommands() {
    this.bot.command('start', async (ctx) => {
      await ctx.reply('Привет! Бот запущен и готов к работе.');
    });
  }

  async sendMessage(tgId: number, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(tgId, message);
    } catch (error) {
      throw new Error(`Failed to send message to user ${tgId}: ${error.message}`);
    }
  }
}

