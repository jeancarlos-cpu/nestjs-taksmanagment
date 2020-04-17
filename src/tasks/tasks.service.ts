import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return task;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    await task.save();
    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }
}
