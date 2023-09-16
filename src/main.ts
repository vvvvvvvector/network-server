import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe()); // i can validate dtos because of this (in gerneral classes i guess) with class-validator

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Network API')
    .setVersion('0.1')
    .addBearerAuth();
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = +app.get(ConfigService).get('APP_PORT') || 5173;

  await app.listen(port);
}
bootstrap();
