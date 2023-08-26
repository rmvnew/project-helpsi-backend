import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerService } from './config/swagger/swagger.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: 'http://localhost:4200',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    });

    app.setGlobalPrefix('/api/v1')
    new SwaggerService().init(app)
    await app.listen(3000);
  } catch (error) {
    console.log('->', error);
  }
}
bootstrap();
