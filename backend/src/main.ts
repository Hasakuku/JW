import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { WsAdapter } from '@nestjs/platform-ws';
import * as config from 'config';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as serveStatic from 'serve-static';
import { join } from 'path';
// import { HttpExceptionFilter } from './http-filter/http-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    serveStatic(join(__dirname, '..', 'client'), {
      index: ['index.html'],
    }),
  );
  app.enableCors({
    // origin: [
    //   'https://jwproject.vercel.app',
    //   'http:localhost:3000',
    //   'http:localhost:8080',
    //   'http:43.201.9.57',
    //   'http:43.201.9.57:3000',
    // ],
    origin: '*',
    exposedHeaders: ['Authorization'],
    // credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  // app.useWebSocketAdapter(new WsAdapter(app));
  // app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('JW 프로젝트')
    .setDescription('JW 프로젝트 API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        name: 'JWT',
        in: 'header',
      },
      'jwt',
    )
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);
  await Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
