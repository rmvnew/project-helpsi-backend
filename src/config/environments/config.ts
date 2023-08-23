
export default () => ({
    application: {
        port: parseInt(process.env.APP_PORT)
    },
    swagger: {
        title: process.env.SWAGGER_TITLE,
        description: process.env.SWAGGER_DESCRIPTION,
        version: process.env.SWAGGER_VERSION
    },
    auth: {
        token_secret: process.env.JWT_SECRET,
        token_expires_in: process.env.JWT_EXPIRES_IN,
        refresh_token_secret:  process.env.JWT_REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    },
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        // schema:'dbo',
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        extra: {
            trustServerCertificate: true,
    
        }
    },
    
    minio: {
        endpoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT),
        bucket: process.env.MINIO_BUCKET,
        ssl: process.env.MINIO_SSL,
        access_key: process.env.MINIO_ACCESS_KEY,
        secret_key: process.env.MINIO_SECRET_KEY
    }
});