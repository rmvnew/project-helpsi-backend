import { ApiProperty } from "@nestjs/swagger";



export class CreateProfileDto {
    
    @ApiProperty()
    profile_name: string
}
