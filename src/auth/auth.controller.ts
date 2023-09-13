/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { googleDto } from './dto/google.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './shared/auth.service';
import { GoogleAuthService } from './shared/google.auth.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './shared/guards/jwt.refresh-auth.guard';
import { LocalAuthGuard } from './shared/guards/local-auth.guard';


@ApiTags('Login')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private googleService: GoogleAuthService
    ) { }


    @Post('/login')
    @PublicRoute()
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ description: '## Route to login - [Public]' })
    @ApiBody({
        description: '## O twoFactorCode é uma variável `opcional`. O uso desta variável é `obrigatório` apenas quando o usuário ativa a autenticação de dois fatores.',
        type: LoginDTO
    })
    async auth(@Body() auth: LoginDTO) {
        return this.authService.login(auth)
    }

    @Post('/logout')
    @ApiBearerAuth()
    @ApiExcludeEndpoint()
    @UseGuards(JwtAuthGuard)
    async logout(@Request() payload: any) {
        return this.authService.removeRefreshToken(payload.user.sub);
    }

    @Post('/refresh_token')
    @ApiBearerAuth()
    @PublicRoute()
    // @ApiExcludeEndpoint()
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(@Request() payload: any) {



        return this.authService.refreshToken(payload.user.id, payload.user.refresh_token);
    }


    @Post('/validate')
    @ApiBearerAuth()
    @ApiExcludeEndpoint()
    @UseGuards(JwtAuthGuard)
    validateToken(@Request() req): any {
        return { userId: req.user.sub, name: req.user.name };
    }


    @Post('google-login')
    @ApiBearerAuth()
    @PublicRoute()
    @ApiOperation({
        description: `# Esta rota cadastra um paciente.
        Tipo: Pública. 
        Acesso: [Livre]` })
    @ApiBody({
        description: '## Schema padrão para cadastrar um paciente. ',
        type: googleDto
    })
    async googleLogin(@Body() token: googleDto) {
        return await this.googleService.validateToken(token)
    }

}
