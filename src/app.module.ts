import {Module, OnModuleInit} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { TaskModule } from './task/task.module';
import { Task } from './task/schema/task.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { SeederService } from './seeder/seeder.service';
import {TaskRepository} from "./task/task.repository";
import {TaskService} from "./task/task.service";
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          Task
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      // store: redisStore,
      uri: process.env.REDIS_URL,
      ttl: 60
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TaskModule,
  ],
  controllers: [],
  providers: [SeederService],
})
// export class AppModule {}

export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit(): Promise<void> {
    await this.seederService.seedTasks();
  }
}