import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/entities/user.entity';
import * as config from 'config';
import { Request } from 'express';
import { UserService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromBodyField('jwt'),
    });
  }

  async validate(payload) {
    const { email } = payload;
    const user: User = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectEntityManager()
//     private entityManager: EntityManager,
//     private userService: UserService,
//   ) {
//     super({
//       secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           let token = null;
//           if (request && request.cookies) {
//             token = request.cookies['jwt'];
//           }
//           return token;
//         },
//       ]),
//     });
//   }

//   async validate(payload) {
//     const { email } = payload;
//     const user: User = await this.userService.getUserByEmail(email);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
