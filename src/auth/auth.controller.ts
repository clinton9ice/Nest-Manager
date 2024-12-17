import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthCredentialDto,
  LoginCredentialDto,
} from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/sign-up')
  signUp(@Body() payload: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(payload);
  }
  @Post('/sign-in')
  signIn(@Body() payload: LoginCredentialDto) {
    return this.authService.signIn(payload);
  }
}
