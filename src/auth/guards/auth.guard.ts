import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';
import { Observable } from 'rxjs';
import { JwtPayLoad } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

// Esto puede retornar un boolean, una Promesa que resulva un boolean o un Observable que emita un valor boolean.
// : boolean | Promise<boolean> | Observable<boolean> {
// Si se retorna un true el suuario puede entrar a esa ruta o hacer lo que esperaba hacer.
@Injectable()
export class AuthGuard implements CanActivate {

  constructor( 
    private jwtService: JwtService,
    private authService: AuthService, 
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    // Obtenemos la respuesta
    const request = context.switchToHttp().getRequest();
    //console.log({ request });
    // Obtenemos el token de la respuesta
    const token = this.extractTokenFromHeader(request);
    //console.log({ token });
    // Realizamos una primera validación, si no hay token.
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    // Realizamos la validación del token con el backend.
    // Este payload debe de lucir como la interface JwtPayLoad

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(
        token,
        { 
          secret: process.env.JWT_SEED // Nuestra llave secreata que esta en .env
        }
      );

      const user = await this.authService.findUserById( payload.id );
      // Si el usuario no existe
      if ( !user ) throw new UnauthorizedException('User does not exists');
      // Si el usuario no esta activo
      if ( !user.isActive ) throw new UnauthorizedException('User is not active');

      request['user'] = user;
  
      //console.log({ payload });  

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      //request['user'] = payload;
      //request['user'] = payload.id;

    } catch (error) {
      throw new UnauthorizedException();
    }

    //return Promise.resolve(true);
    // Aca ya podemos retornar un true
    return true;
  }

  //request.headers.authorization?. : Deberia de venir en los header pero no siempre viene por ello se cambia
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
