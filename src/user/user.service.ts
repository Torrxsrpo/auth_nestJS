import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { User } from '../user/entities/user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> { //"Oye TypeScript, te prometo que esta función devuelve un objeto con todos los datos del usuario, EXCEPTO la contraseña, porque por seguridad se la acabamos de eliminar".
    const { email, password } = createUserDto;

    // 1. ¿El correo ya existe en la base de datos?
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      // 409 Conflict: El recurso ya existe
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    try {
      // 2. Hashear la contraseña de forma segura
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 3. Crear el objeto del usuario con la contraseña hasheada
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
      });

      // 4. Guardarlo en la base de datos de Postgres
      await this.userRepository.save(user);

      // 5. Devolver el usuario SIN el password (por seguridad)
      const { password: _, ...userWithoutPassword } = user; //Crea una nueva variable userWithoutPassword que contiene todos los campos de user excepto password. El _ es una convención para indicar que no nos interesa esa variable.
      return userWithoutPassword as Omit<User, 'password'>;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
