import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto, UpdateUserDto } from './dto/auth-credential.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserContext } from './types/user.interface';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(param: AuthCredentialDto): Promise<void> {
    const { password, username, email } = param;
    try {
      //   Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.create({ username, password: hashedPassword, email });
      await this.save(user);
      this.logger.verbose(`Account created for user: ${user.username}`);
    } catch (error) {
      this.logger.error('Something went wrong =====>', error.message, true);
      if (Number(error.code) === 23505) {
        //Duplicate usernames
        throw new ConflictException('This user already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async getUserInfo(id: string): Promise<UserContext> {
    try {
      const userInfo = await this.findOne({ where: { id } });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = userInfo;
      return rest;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  async updateUserInfo(param: UpdateUserDto, user: User) {
    if (user.email) {
      const { email, username } = param;
      const u_info = user;
      u_info.email = email || user.email;
      u_info.username = username || user.username;
      await this.save(u_info);
      return user;
    }
  }
}
