import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserRepository],
})
export class UserModule {}
