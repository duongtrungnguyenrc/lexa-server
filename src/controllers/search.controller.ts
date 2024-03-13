import { SearchService } from "@/services";
import { Controller } from "@nestjs/common";

@Controller("rest/search")
export class SearchController {
    constructor(private readonly service: SearchService) {}
}
