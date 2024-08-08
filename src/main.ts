import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Github Repo Scoring API')
    .setDescription('The GitHub repo scoring API description')
    .setVersion('1.0')
    .addTag('repositories')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}

bootstrap();
