import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeederService {
    constructor(private readonly connection: Connection) {}

    async seedTasks(): Promise<void> {
        const methods = ['add', 'mul'];

        await this.connection.transaction(async (manager) => {
            const queryRunner = manager.queryRunner;
            const result = await queryRunner.query('SELECT COUNT(*) AS taskCount FROM tasks');
            const taskCount = result[0].taskCount;
            console.log('Total Seeded Tasks:', taskCount);
            console.log('If you want to seed more tasks, change "TASKS" in .env file.');

            const tasks = +(process.env.TASKS);
            if (taskCount <= tasks) {
                for (let i = 1; i <= tasks; i++) {
                    let j = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
                    for (const method of methods) {
                        const title = `${i},${j},${method}`;

                        const id = uuidv4();
                        await queryRunner.query(
                            'INSERT INTO tasks (id, title) VALUES (?, ?)',
                            [id, title]
                        );

                        console.log('Task inserted: ', title);
                    }
                }
                console.log('Tasks seeded successfully');
            }
        });
    }
}
