import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as mime from 'mime-types';
import { DiskStorageController } from './files.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          // (3)
          // callback 함수의 두번째 인자로 파일 저장 경로를 지정할 수 있습니다.
          callback(null, './images');
        },
        filename(req, file, callback) {
          // (4)
          // callback 함수의 두번째 인자로 저장할 때, 파일 명을 지정할 수 있습니다.
          callback(
            null,
            `${new Date().getTime()}.${mime.extension(file.mimetype)}`,
          );
        },
      }),
      // (1)
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
        files: 1,
      },
      fileFilter(req, file, callback) {
        // (2)
        // limits에서 파일 사이즈와 같은 부분을 검증 후, 파일 타입과 같은 부분에 대한 검증을 진행합니다.
        // 검증 진행 후, 정상적인 요청이면 callback의 두번쨰 인자로 true를 넣습니다.
        callback(null, true);
      },
    }),
  ],
  controllers: [DiskStorageController],
  providers: [],
})
export class DistStorageModule {}
