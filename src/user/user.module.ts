import { Module } from '@nestjs/common';
import { UsersService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // 1. Registra el repositorio de la entidad User para poder usar @InjectRepository(User)
  imports: [TypeOrmModule.forFeature([User])],
  // 2. Registra el servicio para que este módulo lo pueda usar
  providers: [UsersService],
  // 3. Exporta el servicio para que otros módulos (como AuthModule) lo puedan usar en el futuro
  exports: [UsersService],
})
export class UserModule {}
