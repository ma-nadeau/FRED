import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );

  await app.listen(4590);
  Logger.log('Application is running on: ' + (await app.getUrl()));
}
bootstrap();
