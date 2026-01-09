import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  private readonly staticsPath: string;

  constructor(
    private configService: ConfigService, 
    private userService: UsersService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }
    this.bot = new Telegraf(token);
    
    // Устанавливаем путь для сохранения статических файлов
    this.staticsPath = this.configService.get<string>('STATICS_PATH') || path.join(process.cwd(), 'public', 'avatars');
    
    // Создаем директорию, если её нет
    if (!fs.existsSync(this.staticsPath)) {
      fs.mkdirSync(this.staticsPath, { recursive: true });
    }
  }

  async onModuleInit() {
   
    setImmediate(async () => {
      try {
       
        console.log('[TelegramService] Starting Telegram bot...');
        await this.bot.launch();
        console.log('[TelegramService] ✅ Telegram bot started successfully');
        //write bot
      } catch (error) {
        console.error('[TelegramService] ❌ Failed to start Telegram bot:', error);
        console.error('[TelegramService] Application will continue without Telegram bot');
      
      }
    });
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  getBot(): Telegraf {
    return this.bot;
  }

  async sendMessage(tgId: number, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(tgId, message);
    } catch (error) {
      throw new Error(`Failed to send message to user ${tgId}: ${error.message}`);
    }
  }

  async start(ctx: Context): Promise<void> {
    const telegramId = ctx.from?.id;
    if (!telegramId) {
      await ctx.reply('Не удалось определить ваш Telegram ID');
      return;
    }

    const user = await this.userService.findUserByTelegramId(telegramId);

    if (!user) {
      const photoUrl = await this.getUserPhoto(ctx);
      await this.userService.createUser({
        telegramId: telegramId.toString(),
        username: ctx.from?.username || '',
        photoUrl: photoUrl || ''
      });
      await ctx.reply('Добро пожаловать! Ваш профиль создан.');
    } else {
      await ctx.reply('Добро пожаловать обратно!');
    }
  }

  async getUserPhoto(ctx: Context): Promise<string | null> {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        return null;
      }

      const photos = await ctx.telegram.getUserProfilePhotos(telegramId, 0, 1);
      
      if (!photos.photos || photos.photos.length === 0) {
        return null;
      }

      const photo = photos.photos[0];
      if (!photo || photo.length === 0) {
        return null;
      }

      const fileId = photo[photo.length - 1].file_id;
      const file = await ctx.telegram.getFile(fileId);
      
      const filePath = file.file_path;
      if (!filePath) {
        return null;
      }

      const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
      if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
      }

      const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
      const fileName = `${telegramId}_${Date.now()}${path.extname(filePath)}`;
      const localFilePath = path.join(this.staticsPath, fileName);

      await this.downloadFile(fileUrl, localFilePath);

      return fileName;
    } catch (error) {
      console.error('Error getting user photo:', error);
      return null;
    }
  }

  private async downloadFile(url: string, dest: string): Promise<void> {
    try {
      const response = await axios.get(url, {
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(dest);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          writer.close();
          resolve();
        });
        writer.on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      });
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
}

