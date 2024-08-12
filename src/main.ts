import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RawBody, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger('PaymentsMs-Main')

  const app = await NestFactory.create(AppModule,
    {
      rawBody: true}
  );


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen(envs.port);

  logger.log(`Gateway runing on port ${envs.port}`)
}
bootstrap();
