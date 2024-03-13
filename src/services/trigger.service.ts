import { Injectable, OnModuleInit } from "@nestjs/common";
import * as cron from "node-cron";
import { exec } from "child_process";

@Injectable()
export class TriggerService implements OnModuleInit {
    onModuleInit() {
        cron.schedule("06 22 * * *", async () => {
            console.log("Complete automatic trend prediction analysis!");
            await exec("python3 src/services/analysis.service.py", (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(stdout);
            });
        });
    }
}
