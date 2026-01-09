import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    console.log(`PORT: ${process.env.PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Enable CORS with credentials
    app.enableCors({
      origin: process.env.CLIENT_URL || 'http://localhost:3001',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    // Enable cookie parser
    app.use(cookieParser());
    
    const port = process.env.PORT ?? 3000;
    console.log(`Attempting to listen on port ${port}...`);
    console.log('Waiting for all modules to initialize...');
    
    // Give modules time to initialize (especially Prisma connection)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      console.log('Starting HTTP server...');
      
      // Use Promise to catch any errors during listen
      const server = await app.listen(port, '0.0.0.0');
      
      console.log(`✅ Application is running on: http://0.0.0.0:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
      console.log(`Server address: ${server.address()}`);
      
      // Keep process alive
      process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received: closing HTTP server');
        await app.close();
      });
      
      process.on('SIGINT', async () => {
        console.log('SIGINT signal received: closing HTTP server');
        await app.close();
      });
    } catch (listenError) {
      console.error('❌ Error listening on port:', listenError);
      console.error('Error details:', listenError instanceof Error ? listenError.message : String(listenError));
      console.error('Error stack:', listenError instanceof Error ? listenError.stack : 'No stack trace');
      throw listenError;
    }
  } catch (error) {
    console.error('❌ Error starting application:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Fatal error in bootstrap:', error);
  process.exit(1);
});
