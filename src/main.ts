import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // i can validate dtos because of this (in gerneral classes i guess) with class-validator

  // swagger
  const config = new DocumentBuilder().setTitle('Network API Docs.');
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
