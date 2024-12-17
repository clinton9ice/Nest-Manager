import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { getTaskFilterDto } from './dto/get-task-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@GetUser() user: User, @Query() filterDto: getTaskFilterDto) {
    this.logger.verbose(`User: ${user.username} retrieving all tasks`);
    return this.taskService.getTasks(user, filterDto);
  }

  @Get('/:id')
  getTaskById(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createANewTask(@GetUser() user: User, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.newTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(@GetUser() user: User, @Param('id') id: string) {
    return this.taskService.deleteTask(id, user);
  }
  @Patch('/:id/status')
  updateTaskStatusById(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() statusParam: UpdateTaskStatusDto,
  ) {
    const { status } = statusParam;
    return this.taskService.updateTaskStatus({ id, taskStatus: status }, user);
  }
}
