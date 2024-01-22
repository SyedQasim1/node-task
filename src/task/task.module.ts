import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./schema/task.schema";
import {CacheModule} from "@nestjs/cache-manager";
import {TaskRepository} from "./task.repository";
import { BullModule } from '@nestjs/bull';
import { TaskQueueProcessor1, TaskQueueProcessor2 } from './task.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    CacheModule.register({
      isGlobal: true,
      uri: process.env.REDIS_URL,
      ttl: 60
    }),
    BullModule.registerQueue({
      name: 'queueOne',
    }),
    BullModule.registerQueue({
      name: 'queueTwo',
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TaskQueueProcessor1, TaskQueueProcessor2],
})
export class TaskModule {}
