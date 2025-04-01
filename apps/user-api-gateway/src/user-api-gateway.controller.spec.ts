import { Test, TestingModule } from '@nestjs/testing';
import { UserApiGatewayController } from './user-api-gateway.controller';
import { UserApiGatewayService } from './user-api-gateway.service';

describe('UserApiGatewayController', () => {
  let userApiGatewayController: UserApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserApiGatewayController],
      providers: [UserApiGatewayService],
    }).compile();

    userApiGatewayController = app.get<UserApiGatewayController>(UserApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
