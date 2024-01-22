import {OnQueueCompleted, Process, Processor} from '@nestjs/bull';
import {Job} from "bull";

@Processor('queueOne')
export class TaskQueueProcessor1 {
    @Process()
    async handleTask(job: Job) {
        console.log(`QueueOne Processing Started:`, job.data);
        const task = job.data;
        const startTime = Date.now();

        let result = await this.calculateData(task.title);

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        console.log(`QueueOne Processing Stopped, Calculated Result is: ${result} and processing time was ${processingTime} sec.`);
        return result;
    }

    async calculateData(inputString) {
        const elements = inputString.split(',');
        const methodArray =  inputString.split(',');

        if (elements.length >= 3) {
            let method = methodArray.pop();
            const operands = elements.slice(0, -1);

            if (method == 'add') {
                let result = 0;
                for (const operand of operands) {
                    result += +operand;
                }
                return result;
            } else if (method == 'mul') {
                let result = 1;
                for (const operand of operands) {
                    result *= +operand;
                }
                return result;
            } else {
                return 'add or multiply only';
            }
        }
    }
}

@Processor('queueTwo')
export class TaskQueueProcessor2 {
    @Process()
    async handleTask(job: Job) {
        console.log(`QueueTwo Processing Started:`, job.data);
        const task = job.data;
        const startTime = Date.now();

        let result = await this.calculateData(task.title);

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        console.log(`QueueTwo Processing Stopped, Calculated Result is: ${result} and processing time was ${processingTime} sec.`);
        return result;
    }

    async calculateData(inputString) {
        const elements = inputString.split(',');
        const methodArray =  inputString.split(',');

        if (elements.length >= 3) {
            let method = methodArray.pop();
            const operands = elements.slice(0, -1);

            if (method == 'add') {
                let result = 0;
                for (const operand of operands) {
                    result += +operand;
                }
                return result;
            } else if (method == 'mul') {
                let result = 1;
                for (const operand of operands) {
                    result *= +operand;
                }
                return result;
            } else {
                return 'add or multiply only';
            }
        }
    }
}