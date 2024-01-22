import {Inject, Injectable} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {TaskRepository} from "./task.repository";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import {InjectQueue, OnQueueCompleted} from '@nestjs/bull';
import {Job, Queue} from 'bull';
import {TaskDto} from "./dto/task-item.dto";


@Injectable()
export class TaskService {
  private distributionDetails: Record<number, { taskId: number; data: string }> = {};

  constructor(
      private taskRepository: TaskRepository,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
      @InjectQueue('queueOne') private readonly taskQueueOne: Queue,
      @InjectQueue('queueTwo') private readonly taskQueueTwo: Queue
  ) {}

  async distributeTasks() {
    const tasksData = await this.taskRepository.find();

    if (tasksData.length > 0) {
      const queues = [this.taskQueueOne, this.taskQueueTwo];
      let queueIndex = 0;

      let data = [];
      for (let j = 0; j < tasksData.length; j++) {
        const title = tasksData[j].title;

        const currentQueue = queues[queueIndex];
        try {
          let cachedVal = await this.cacheManager.get(title);
          console.log('cachedVal: ', cachedVal);
          if (!cachedVal) {
            let queueData: any = await currentQueue.add({ title });

            queueData.finished().then(result => {
              const relatedData = queueData.data;

              this.cacheManager.set(relatedData.title, result, 24 * 60 * 60);
              data.push({'title': relatedData.title, result});

              console.log('Calculated result');
            });
          } else {
            data.push({title, 'result': cachedVal});

            console.log('Cached result', cachedVal);
          }
        } catch (error) {
          console.error('Error processing the job:', error);
        }

        queueIndex = (queueIndex + 1) % queues.length;
      }
      return data;
    }
  }

  async findAll() {
    return this.taskRepository.find();
  }
}
