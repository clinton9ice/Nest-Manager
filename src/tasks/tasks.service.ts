import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { getTaskFilterDto } from './dto/get-task-filter-dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  constructor(private taskRepo: TaskRepository) {}

  async getTaskById(id: string, user: User): Promise<TaskEntity> {
    const task = await this.taskRepo.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
  async getTasks(
    user: User,
    filterDto?: getTaskFilterDto,
  ): Promise<TaskEntity[]> {
    return await this.taskRepo.getTasks(user, filterDto);
  }

  async newTask(payload: CreateTaskDto, user: User) {
    return await this.taskRepo.createTask(payload, user);
  }

  async deleteTask(id: string, user: User) {
    const result = await this.taskRepo.delete({ id, user });
    if (result.affected === 0) {
      this.logger.error(`Task with id not found for user: ${user.username}`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    } else {
      this.logger.log(`Task deleted successfully by: ${user.username}`);
      return {
        message: 'Task Deleted successfully',
      };
    }
  }
  // async softDeleteTask(id: string, user: User) {
  //   const task = await this.getTaskById(id, user);
  //   this.taskRepo.extend({ is_deleted: true });
  // }

  async updateTaskStatus(
    arg: { id: string; taskStatus: TaskStatus },
    user: User,
  ) {
    const { id, taskStatus } = arg;
    const task = await this.getTaskById(id, user);
    task.status = taskStatus;
    await this.taskRepo.save(task);
    return task;
  }
}
