import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application, ApplicationStatus } from './entity/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationRepository } from './application.repository';

@Injectable()
export class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}
  async createApplication(application: Application): Promise<Application> {
    return this.applicationRepository.createApplication(application);
  }

  async getApplicationById(
    applicationId: number,
  ): Promise<Application | undefined> {
    return this.applicationRepository.getApplicationById(applicationId);
  }

  async updateApplication(
    applicationId: number,
    updatedApplication: Partial<Application>,
  ): Promise<Application> {
    return this.applicationRepository.updateApplication(
      applicationId,
      updatedApplication,
    );
  }

  async deleteApplication(applicationId: number): Promise<void> {
    await this.applicationRepository.deleteApplication(applicationId);
  }

  // async updateStatus(
  //   applicationId: number,
  //   status: Partial<Application>,
  // ): Promise<Application> {
  //   const application = await this.applicationRepository.updateApplication(
  //     applicationId,
  //     status,
  //   );
  //   if (!applicationId) {
  //     throw new Error('신청이 존재하지 않습니다.');
  //   }

  //   application.status = status;
  //   return this.applicationRepository.save(application);
  // }

  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return this.applicationRepository.find({ where: { userId } });
  }
}
