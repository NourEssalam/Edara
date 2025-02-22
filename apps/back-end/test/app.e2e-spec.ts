import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
// import { HttpAdapterHost } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication; // Remove the <App> generic type

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion
      await request(app.getHttpServer() as any)
        .get('/')
        .expect(200)
        .expect('Hello World!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error:', error);
      }
      fail('Request failed');
    }
  });
});
