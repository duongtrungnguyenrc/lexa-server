import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class AnalysisService {
    @Cron("42 12 * * *")
    getAutoCompleteAnalysys() {
        console.log("hello");
    }
}
