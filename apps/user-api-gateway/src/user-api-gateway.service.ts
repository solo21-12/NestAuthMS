import { Injectable } from '@nestjs/common';

@Injectable()
export class UserApiGatewayService {
  getHello(): any {
    return {
      message: '👋 Welcome to the User Management API Gateway!',
      description:
        'This project is a NestJS-based hybrid system with a Gateway and a Microservice communicating over TCP.',
      features: {
        authentication: [
          {
            method: 'POST',
            endpoint: '/auth/sign-up',
            description: 'Register a new user',
          },
          {
            method: 'POST',
            endpoint: '/auth/sign-in',
            description: 'Login a user',
          },
          {
            method: 'POST',
            endpoint: '/auth/sign-out',
            description: 'Logout a user',
          },
          {
            method: 'POST',
            endpoint: '/auth/refresh-token',
            description: 'Refresh authentication token',
          },
        ],
        userManagement: [
          {
            method: 'GET/POST/PATCH/DELETE',
            endpoint: '/users',
            description:
              'Manage user data (admin only for POST, PATCH, DELETE)',
          },
        ],
      },
      architecture: {
        framework: 'NestJS',
        communication: 'TCP',
        database: 'MongoDB',
        DTOs: true,
        RTOs: true,
        roleBasedAccessControl: true,
        validation: 'Class-validator',
        apiDocumentation: 'Swagger integrated',
      },
      userModel: {
        name: 'string (required)',
        email: 'string (required, unique, valid format)',
        password: 'string (required)',
        role: 'enum: user | admin (default: user)',
      },
      access: {
        swaggerDocs: '/api/docs/',
      },
      note: 'Only authenticated users can interact with the system. Only admins can modify user data.',
      deadline: '📅 April 4',
    };
  }
}
