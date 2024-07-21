// La idea de los Dto (Data Transfer Object) es que Nest sepa que data esperar 

import { IsEmail, IsString, MinLength } from "class-validator";

// Aca en los Dto se le pueden colocar otro nombres por ejemplo en ligar de email puede colocar correo, pero cuando se haga la petición post debe venir en nombre correo y su valor.
export class CreateUserDto {

    // Aca usamos los decoradores de Class Validator
    // Aca email tiene que lucir como un correo, si no no lo acepta.
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    // Si no vienen al menos 6 caracteres no se acepta.
    @MinLength(6)
    password: string;

    // Los roles se podria pedir al usuario, pero ello se puede crear despues
    // debido a que un usuario no deberia de decir que rol pertenece.

}
