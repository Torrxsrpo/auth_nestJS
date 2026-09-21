import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { UserModule } from './user/user.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 🔥 Elimina cualquier campo que no esté definido en el DTO
      forbidNonWhitelisted: true, // 🔥 Lanza un error 400 si envían campos no permitidos
      transform: true, // 🔥 Convierte los payloads automáticamente a instancias de sus DTOs
    }),
  );
  

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
