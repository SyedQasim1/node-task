import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('Node Task')
      .setDescription('API description')
      .setVersion('1.0')
      .addTag('node/nest')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT;
  await app.listen(port, async () => {
    console.log(
        `The server is running on ${port} port: http://localhost:${port}/api`,
    );
  });
}
bootstrap();
