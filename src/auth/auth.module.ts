import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
/*
https://docs.nestjs.com/modules
*/

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './shared/auth.service';
import { GoogleAuthService } from './shared/google.auth.service';
import { JwtRefreshStrategy } from './shared/strategies/jwt-refresh.strategy';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { LocalStrategy } from './shared/strategies/local.strategy';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET as string,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        GoogleAuthService
    ],
})
export class AuthModule { }
