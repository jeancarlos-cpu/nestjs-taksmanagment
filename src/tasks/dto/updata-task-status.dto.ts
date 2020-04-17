import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}
