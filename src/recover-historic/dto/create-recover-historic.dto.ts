import { UserEntity } from "src/user/entities/user.entity"


export class CreateRecoverHistoricDto {

    recover_quantity: number

    user: UserEntity
}
