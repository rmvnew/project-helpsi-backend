import { ApiProperty } from "@nestjs/swagger"



export class FilterPagination {

    @ApiProperty({ required: false, default: 1 })
    page: number

    @ApiProperty({ required: false, default: 10 })
    limit: number

    @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
    sort: string

    @ApiProperty({ required: false, default: 'NAME', enum: ['ID', 'NAME'] })
    orderBy: string

    route: string
}