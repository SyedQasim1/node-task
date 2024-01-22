import { IsArray, ArrayMinSize, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

class TaskItemDto {
    @ArrayMinSize(1)
    @IsObject()
    @ValidateNested()
    @Type(() => String)
    title: string;
}

export class TaskDto {
    @ApiProperty()
    @ArrayMinSize(1)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TaskItemDto)
    tasks: TaskItemDto[];
}