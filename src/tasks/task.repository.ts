import { DataSource, Repository } from 'typeorm';

import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { User } from 'src/auth/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { getTaskFilterDto } from './dto/get-task-filter-dto';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  private logger = new Logger('TaskRepository');
  constructor(private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  async createTask(payload: CreateTaskDto, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    const task = this.create({
      ...payload,
      status: TaskStatus.OPEN,
      user: rest,
    });
    try {
      await this.save(task);
      this.logger.verbose(
        `A new task was successfully created by:  ${task.user.username}`,
      );
    } catch (error) {
      this.logger.error(
        `Something went wrong when saving task: ${error.message}`,
      );
      throw new InternalServerErrorException();
    }
    return task;
  }

  async getTasks(
    user: User,
    filterDto?: getTaskFilterDto,
  ): Promise<TaskEntity[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
