import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const allowedOrigins = config
    .getOrThrow<string>('FRONTEND_ORIGIN')
    .split(',')
    .map((origin) => origin.trim())

  app.setGlobalPrefix('api')
  app.enableCors({ origin: allowedOrigins, credentials: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  await app.listen(config.getOrThrow<number>('PORT'), '0.0.0.0')
}

void bootstrap()
