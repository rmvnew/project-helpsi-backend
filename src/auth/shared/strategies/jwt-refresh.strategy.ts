import { Injectable, Request } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        
        super({
            
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true

        });
    }

    async validate(@Request() request: Request, payload: any): Promise<any> {
 
        const refresh_token = request.headers['authorization'].replace('Bearer', '').trim()
        return {
            id: payload.sub,
            refresh_token
        };
    }
 }