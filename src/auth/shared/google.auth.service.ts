/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID

@Injectable()
export class GoogleAuthService {

    private readonly client = new OAuth2Client(CLIENT_ID);


    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService
    ) { }


    async validateToken(idToken: string): Promise<any> {



        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error('Token inválido');
        }
        // console.log(payload);

        let user = await this.userService.findByEmail(payload.email);


        if (!user) {

            user = await this.userService.createPatientWithGoogle({
                user_email: payload.email,
                user_name: payload.name,
                google_id: payload.sub,
                google_picture: payload.picture
            });

        }


        const newJwtToken = await this.authService.generateAndReturnTokens(user);

        // console.log(newJwtToken);

        return {
            access_token: newJwtToken,
            // outras informações que você deseja retornar
        };
    }

}
