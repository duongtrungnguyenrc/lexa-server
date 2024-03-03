import { IsNotEmpty, IsUUID } from "class-validator";

export class LearningRecordDto {
    @IsNotEmpty()
    @IsUUID()
    vocabulary: { id: string };
}
