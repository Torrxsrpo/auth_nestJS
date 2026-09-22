import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/entities/user.entity.js';
import { UserModule } from './user/user.module.js';

import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la app sin re-importar
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres123'),
        database: configService.get<string>('DB_NAME', 'auth_db'),
        entities: [User],
        synchronize: true, // ⚠️ Solo para desarrollo (crea las tablas automáticamente)
      }),
    }),
    UserModule,
    AuthModule,
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}