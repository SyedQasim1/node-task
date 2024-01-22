import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './schema/task.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectRepository(Task) private taskModel: Repository<Task>) {}

  async find(): Promise<Task[] | []> {
    return this.taskModel.find();
  }

  async create(data: any): Promise<any | null> {
    return this.taskModel.save(data);
  }
}
