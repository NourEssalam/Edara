import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // Strips properties that don't have decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 👈 Swagger UI will be at /api

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
