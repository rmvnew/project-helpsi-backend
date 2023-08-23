import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerService } from './config/swagger/swagger.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors()
    app.setGlobalPrefix('/api/v1')
    new SwaggerService().init(app)
    await app.listen(3000);
  } catch (error) {
    console.log('->',error);
  }
}
bootstrap();
