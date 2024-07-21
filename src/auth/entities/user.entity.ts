
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Asi como esta solo es una simple clase, pero se requiere de que se cree esto es como un esquema en Mongoos y 
// que sea un objeto en mi base de datos donde se puedan obtener los nombres por el id y por ello se agrega el decorador @Schema()  
@Schema()
export class User {

    // Mongo me crea por nostros el id
    // _id: string;
    // Al momento de crear el registro allí se nos visualiza un error por el id que crea Mongo, por ello lo dejamos aca diciendo que ese parametro puede o no venir
    _id?: string;
    
    // @Prop() Con esta directiva definimos las propiedades que tenga en la base de datos 
    // No se permiten tener registros sin correo y no se permiten correos duplicados
    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    name: string;

    // Con el caracter ? indicamos que el password puede o no venir.
    @Prop({ minlength: 6, required: true })
    password?: string;

    // Por defecto le mandamos el valor de true, cuando se cree un usuario va a ser true
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}

// Aca lo que debemos ahora es proporcionar el esquema es decir que la base de datos reciba este esquema y lo cree en la base de datos.
export const UserSchema = SchemaFactory.createForClass( User );    
