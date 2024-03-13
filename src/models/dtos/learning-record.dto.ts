import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class LearningRecordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    vocabulary: { id: string };
}
