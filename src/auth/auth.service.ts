import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto';

/* import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
 */
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  // Debemos hacer la inyeccion de nuestro modelo para poder trabajar con esa base de datos
  // No se requiere colocar esto @InjectModel( User.name, 'users'), ya esta identificado en User.name es como si ubiesemos escrito User.name, User.name 
  constructor(
    @InjectModel( User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  // Aca se crearon automaticamente los metodos para manejar las peticiones GET, PUT, DELETE, etc.
  // Aca solo se deben de ajustar las piezas para que graben en base de datos.
/*   async create(createUserDto: CreateUserDto): Promise<User> {  
    // Si desde Postman no se manda data, no hace nada y ni si quiera imprime por consola.
    // Aca no nos preocupamos pues la data del POST que se envia debe de ser del tipo CreateUserDto que se definio. 
    //console.log(createUserDto);

    //const newUser = new this.userModel( createUserDto );

    //return newUser.save(); // este save es una promesa que me retorna ese User.

    // return 'This action adds a new auth';

    try {
      const newUser = new this.userModel( createUserDto );

      // 1. Encriptar la Contraseña

      // 2. Guardar el usuario

      return await newUser.save(); 
    } catch (error) {
      console.log(error.code);
      if(error.code === 11000) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happen!!!');
    }

  } */

  async create(createUserDto: CreateUserDto): Promise<User> {   
    try {
      // Desestructuramos el password y los demas datos se añade en el objeto userData.
      const { password, ...userData } = createUserDto;

      // Encriptamos la contraseña y enviamos los demas campos
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });
 
      // Se crea bien el usuario pero estamos retornando esa contraseña, asi este encripatada no la debemos de devolcer.
      await newUser.save(); 
      const { password:_, ...user } = newUser.toJSON();

      return user;

    } catch (error) {
      console.log(error.code);
      if(error.code === 11000) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happen!!!');
    }
  }

  async register( registerUserDto: RegisterUserDto ): Promise<LoginResponse> {
    
    // En estos casos si lso DTO de user y register son diferentes se debe de realizar el llamado así enviando cada uno de los atributos
    //const user = await this.create({ email: registerUserDto.enail, name: registerUserDto.name, password: registerUserDto.password });
    // Creamos aca el usuario y si se presenta un error la excepción se maneja en el create.
    const user = await this.create( registerUserDto );
    console.log({user});
    
    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    } 
  }

  async login( loginDto: LoginDto ): Promise<LoginResponse> {
    //console.log( loginDto );

    const { email, password } = loginDto;

    // Consultamos si el email existe
    const user = await this.userModel.findOne({ email });

    // Si no existe el email
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }

    // Realizamos la validación de la contraseña
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    // Desestructuramos para retornar el usuario
    const { password:_, ...rest } = user.toJSON();
    
    // De esta manera no sale la informacion del usuario agrupada sino cada variable
    // return {
    //   ...rest,
    //   token: 'ABC-123'
    // };

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    };

    // Este metodo me debe retornar algo así:
    /**
     * User { _id, name, email, roles }
     * Token -> ASDASDASD.ASASADSAS.ASASASAS
     */
  }

  /* Esto se creo automaticamente, y o que hacemos en el siguiente es traer todos los usuarios
  /* findAll() {
    return `This action returns all auth`;
  } */
  findAll(): Promise<User[]> {
    //return `This action returns all auth`;
    return this.userModel.find();
  }

  // Creamos un nuevo metodo para retornar el usuario que ha enviado la solicitud
  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    console.log({ user });
    const { password, ...rest } = user.toJSON();

    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //Se crea un nuevo metodo para obtener el token
  getJwtToken( payLoad: JwtPayLoad ) {
    const token = this.jwtService.sign(payLoad);
    return token;
  }
}
