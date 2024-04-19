import { SearchService } from "@/services";
import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("search")
@ApiTags("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get("")
    async search(@Req() request: Request, @Query("key") key: string, @Query("limit") limit?: number) {
        return this.searchService.search(request, key, limit);
    }
}
