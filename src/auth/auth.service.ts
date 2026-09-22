import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service.js';
import { LoginDto } from '../user/dto/login-user.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Validar las credenciales (Email y Password)
  async validateUser(email: string, passwordPlain: string)  {
    const user = await this.usersService.findByEmailWithPassword(email);

    // Si el usuario no existe o fue desactivado
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparamos el password plano contra el hash guardado en Postgres
    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Si todo coincide, quitamos el password y retornamos el usuario limpio
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 2. Realizar el Login y emitir el JWT
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // A. Validamos que el usuario y la clave sean correctos
    const user = await this.validateUser(email, password);

    // B. Creamos el Payload que irá dentro del JWT
    const payload = {
      sub: user.id, // "sub" es el estándar JWT para el ID del sujeto
      email: user.email,
      roles: user.roles,
    };

    // C. Firmamos el token con nuestro JWT_SECRET y lo retornamos
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}


