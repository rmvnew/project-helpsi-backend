import { ApiProperty } from "@nestjs/swagger"



export class FilterPagination {

    @ApiProperty({ required: false, default: 1 })
    page: number = 1

    @ApiProperty({ required: false, default: 8 })
    limit: number = 8

    @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
    sort: string = 'DESC'

    @ApiProperty({ required: false, default: 'DATE', enum: ['DATE', 'NAME'] })
    orderBy: string = 'DATE'

    route: string
}