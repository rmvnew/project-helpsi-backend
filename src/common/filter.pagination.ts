import { ApiProperty } from "@nestjs/swagger"



export class FilterPagination {

    @ApiProperty({ required: false, default: 1 })
    page: number = 1

    @ApiProperty({ required: false, default: 10 })
    limit: number = 10

    @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
    sort: string = 'ASC'

    @ApiProperty({ required: false, default: 'NAME', enum: ['ID', 'NAME'] })
    orderBy: string = 'NAME'

    route: string
}