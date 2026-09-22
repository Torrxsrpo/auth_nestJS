import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../user/user.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from '../user/dto/login-user.dto.js';

@Controller('auth')
export class AuthController {

    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}


  @Post('register') // 👈 Ruta final: POST /auth/register
  @HttpCode(HttpStatus.CREATED) // 👈 Código HTTP 201
  async register(@Body() createUserDto: CreateUserDto) {
    // 1. El ValidationPipe ya validó el createUserDto antes de entrar aquí
    // 2. Delegamos la creación y el hasheo al UsersService
    return this.usersService.create(createUserDto);
  }

    @Post('login')
  @HttpCode(HttpStatus.OK) // 👈 💡 Retorna 200 OK (no 201 porque no crea un nuevo recurso)
  async login(@Body() loginDto: LoginDto) {
    // Aquí es donde llamaremos al AuthService para validar y generar el token
    return this.authService.login(loginDto);

}}
