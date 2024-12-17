import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
}
