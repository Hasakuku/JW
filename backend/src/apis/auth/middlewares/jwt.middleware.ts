import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['your-token-name']; // 'your-token-name'을 실제 토큰 이름으로 변경해주세요.

    if (token) {
      try {
        const user = verify(token, process.env.JWT_SECRET); // JWT_SECRET는 환경 변수에서 JWT 비밀키를 가져옵니다.
        req.user = user;
      } catch (err) {
        console.error('Invalid token', err);
      }
    }

    next();
  }
}
