import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Con la siguiente linea se tiene accesos a las variables de entorno.
    ConfigModule.forRoot(),
    // Aca se da la ruta de la Base de Datos
    MongooseModule.forRoot( process.env.MONGO_URI ),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log(process.env);
  }

}
