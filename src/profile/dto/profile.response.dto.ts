import { Expose } from "class-transformer"





export class ProfileResponseDto {
    @Expose()
    profile_id: number

    @Expose()
    profile_name: string
}