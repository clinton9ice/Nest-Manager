import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserContext } from './types/user.interface';
import * as bcrypt from 'bcrypt';
import type { ErrorFormat } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: AuthCredentialDto): Promise<void> {
    return this.userRepo.createUser(payload);
  }
  async signIn(
    payload: Pick<AuthCredentialDto, 'email' | 'password'>,
  ): Promise<UserContext | HttpException> {
    const { email, password } = payload;
    const user = await this.userRepo.findOne({ where: { email } });

    try {
      if (user) {
        const isRight = await bcrypt.compare(password, user.password);
        if (isRight) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = user;
          const token = await this.jwtService.sign(rest);
          return { ...rest, token };
        }
      }
    } catch (error) {
      this.logger.error('Something went wrong ====>', error.message);
    }
    const errorResponse = new UnauthorizedException(
      'incorrect login email or password',
    ).getResponse() as ErrorFormat;

    throw new HttpException(errorResponse, errorResponse.statusCode);
  }
  async resetPassword() {}
}
