import { IsEmail, IsString, MinLength } from "class-validator";

// Este DTO es igual al de Create-user pero en la vida real se le pueden adicionar campos
// y se le pueden adicionar más campos o colocar mas validaciones, y se hace todo para no cambiar el login.
export class RegisterUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}