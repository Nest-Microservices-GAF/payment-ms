import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RawBody, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { options } from 'joi';

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


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers
    }
  },
  {
    inheritAppConfig: true
  }
    
  )

  await app.startAllMicroservices()
  await app.listen(envs.port);

  logger.log(`Gateway runing on port ${envs.port}`)
}
bootstrap();
