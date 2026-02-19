import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('avatars')
export class AvatarsController {
  private readonly staticsPath: string;

  constructor(private readonly configService: ConfigService) {
    this.staticsPath =
      this.configService.get<string>('STATICS_PATH') ||
      path.join(process.cwd(), 'public', 'avatars');
  }

  @Get(':filename')
  getAvatar(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): void {
    if (!filename || filename.includes('..') || filename.includes('/')) {
      throw new NotFoundException('Invalid filename');
    }

    const filePath = path.join(this.staticsPath, filename);

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      throw new NotFoundException('File not found');
    }

    res.set('Cache-Control', 'public, max-age=86400');
    res.sendFile(filePath);
  }
}
