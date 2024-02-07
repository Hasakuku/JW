import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entity/application.entity';

@Injectable()
export class ApplicationRepository extends Repository<Application> {
  constructor(dataSource: DataSource) {
    super(Application, dataSource.createEntityManager());
  }

  async createApplication(application: Application): Promise<Application> {
    return this.save(application);
  }

  async getApplicationById(
    applicationId: number,
  ): Promise<Application | undefined> {
    return this.findOne({ where: { applicationId } });
  }
  async getApplicationByUserId(
    userId: number,
  ): Promise<Application | undefined> {
    return this.findOne({ where: { userId } });
  }

  async updateApplication(
    applicationId: number,
    status: Partial<Application>,
    // status: ApplicationStatus,
  ): Promise<Application> {
    await this.update(applicationId, status);
    return this.findOne({ where: { applicationId } });
  }

  async deleteApplication(applicationId: number): Promise<void> {
    await this.delete(applicationId);
  }
}
