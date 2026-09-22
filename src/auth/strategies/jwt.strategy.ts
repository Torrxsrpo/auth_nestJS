import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../user/entities/user.entity.js';
import { UsersService } from '../../user/user.service.js';

// 1. Definimos la interfaz de cómo luce el payload dentro del token
export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // 2. Le pasamos la configuración inicial a la librería de Passport
    super({
      // Le dice a Passport de dónde sacar el token: Del Header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token está vencido, Passport lo rechaza de inmediato con 401
      ignoreExpiration: false,
      // La clave secreta para comprobar la firma matemática
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // 3. Este método se ejecuta AUTOMÁTICAMENTE cuando Passport confirma que la firma es válida
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: id } = payload;

    // Buscamos al usuario en la base de datos para asegurarnos de que todavía existe y está activo
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new UnauthorizedException('Token inválido: el usuario no existe');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    // 💡 Lo que retornes aquí se guardará automáticamente en req.user
    return user;
  }
}