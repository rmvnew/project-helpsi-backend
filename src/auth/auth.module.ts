import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";
/*
https://docs.nestjs.com/modules
*/

import { AuthService } from './shared/auth.service';
import { LocalStrategy } from './shared/strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './shared/strategies/jwt-refresh.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        ConfigModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy
    ],
})
export class AuthModule { }
