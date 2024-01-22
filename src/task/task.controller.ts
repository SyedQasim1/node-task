import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import {TaskDto} from "./dto/task-item.dto";

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('distribute')
  async distributeTasks() {
    let data = await this.taskService.distributeTasks();
    return {
      data,
      'message': 'Tasks distributed successfully.'
    };
  }

  @Get('list')
  findAll() {
    return this.taskService.findAll();
  }
}
