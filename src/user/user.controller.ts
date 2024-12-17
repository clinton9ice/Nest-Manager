import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from 'src/auth/dto/auth-credential.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userInfo: UserRepository) {}

  @Get('/')
  getLoggedInUser(@GetUser() userInfo: User) {
    return userInfo;
  }
  @Put('/')
  updateUserInfo(@GetUser() userInfo: User, @Body() payload: UpdateUserDto) {
    return this.userInfo.updateUserInfo(payload, userInfo);
  }
  @Get('/:user_id')
  getUser(@Param('user_id') id: string) {
    return this.userInfo.getUserInfo(id);
  }
}
