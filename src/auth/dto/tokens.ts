import { IsNotEmpty, IsString } from "class-validator";

export default class Tokens {
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}