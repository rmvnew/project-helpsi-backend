import { INestApplication, Injectable } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

@Injectable()
export class SwaggerService {

    init(app: INestApplication) {
        const config = new DocumentBuilder()
            .setTitle(process.env.SWAGGER_TITLE)
            .setDescription(process.env.SWAGGER_DESCRIPTION)
            .setVersion(process.env.SWAGGER_VERSION)
            .addBearerAuth()
            .addServer(process.env.SWAGGER_API_URL)
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('/swagger', app, document);
    }
}