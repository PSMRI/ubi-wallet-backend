import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  // app.enableCors({
  //   origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [
  //     'http://localhost:1234',
  //   ],
  // });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('UBI Wallet Backend API')
    .setDescription(
      'A comprehensive NestJS-based backend service for managing digital wallets with Dhiway integration, Verifiable Credentials (VC) management, and advanced wallet operations including VC watching and callback processing.',
    )
    .setVersion('1.0.0')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Wallet', 'Wallet operations and VC management')
    .addTag('Housekeeping', 'System maintenance and monitoring')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3018', 'Development server')
    .addServer('https://api.example.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'UBI Wallet API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1f2937; font-size: 2rem; }
      .swagger-ui .info .description { color: #6b7280; font-size: 1.1rem; }
    `,
  });

  const port = process.env.PORT ?? 3018;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
