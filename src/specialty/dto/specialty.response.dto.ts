import { Expose } from "class-transformer";
import { UserEntity } from "src/user/entities/user.entity";


export class SpecialtyResponseDto {
    @Expose()
    specialty_id: string;

    @Expose()
    specialty_name: string;

    users?: UserEntity[];
}
