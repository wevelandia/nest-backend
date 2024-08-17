import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitanos el CORS para decirle al usuario que url estan permitidas para consumir en el backend
  app.enableCors();

  // Este Pipe Global donde se restringe que se deben enviar la información como decimos en el DTO.
  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );
    
  await app.listen( process.env.PORT || 3000);
}
bootstrap();
