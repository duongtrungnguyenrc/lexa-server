import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(compression());
    app.setGlobalPrefix("/api");
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle("E learning application server")
        .setDescription("The english vocabulary learning application with nest js & flutter")
        .setVersion("1.0")
        .addServer("/")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/", app, document);

    await app.listen(3000);
}
bootstrap();
