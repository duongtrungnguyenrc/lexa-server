import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class CreateTopicSerializePipe implements PipeTransform {
    transform(value: { data: string }, _metadata: ArgumentMetadata) {
        return JSON.parse(value.data);
    }
}
