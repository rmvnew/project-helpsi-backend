import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { Bootstrap } from './config/bootstrap';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from './config/environments/config.module';
import { SwaggerModule } from './config/swagger/swagger.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UserModule,
    DatabaseModule,
    SwaggerModule,
    ProfileModule
  ],
  controllers: [],
  providers: [
    Bootstrap,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }

  ],
})
export class AppModule { }
