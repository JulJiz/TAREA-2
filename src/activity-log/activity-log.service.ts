import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import { ActivityLogNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';
import { RoutineService } from '../routine/routine.service';

import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

const ACTIVITY_LOG_SELECT: FindOptionsSelect<ActivityLog> = {
    id: true,
    startedAt: true,
    completedAt: true,
    createdAt: true,
    user: { id: true, username: true, email: true },
    routine: { id: true, name: true, description: true },
};

@Injectable()
export class ActivityLogService {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,
        private readonly routineService: RoutineService,
    ) {}

    async create(createActivityLogDto: CreateActivityLogDto, user: User): Promise<ActivityLog> {
        const { routineId, startedAt, completedAt } = createActivityLogDto;
        await this.routineService.findOne(routineId);

        const startDate = new Date(startedAt);
        const endDate = completedAt ? new Date(completedAt) : null;
        this.validateDates(startDate, endDate);

        const activityLog = this.activityLogRepository.create({
            startedAt: startDate,
            ...(endDate && { completedAt: endDate }),
            user: { id: user.id },
            routine: { id: routineId },
        });
        const savedActivityLog = await this.activityLogRepository.save(activityLog);
        return this.findOne(savedActivityLog.id);
    }

    async findAll(): Promise<ActivityLog[]> {
        return await this.activityLogRepository.find({
            select: ACTIVITY_LOG_SELECT,
            relations: { user: true, routine: true },
            order: { startedAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<ActivityLog> {
        const activityLog = await this.activityLogRepository.findOne({
            where: { id },
            select: { ...ACTIVITY_LOG_SELECT, activityExercises: true },
            relations: { user: true, routine: true, activityExercises: { routineExercise: { exercise: true } } },
        });
        if (!activityLog) {
            throw new ActivityLogNotFoundException(id);
        }
        return activityLog;
    }

    async update(id: number, updateActivityLogDto: UpdateActivityLogDto): Promise<ActivityLog> {
        const { routineId, startedAt, completedAt } = updateActivityLogDto;
        const activityLog = await this.findOne(id);

        if (routineId) {
            await this.routineService.findOne(routineId);
        }

        const startDate = startedAt ? new Date(startedAt) : activityLog.startedAt;
        const endDate = completedAt ? new Date(completedAt) : activityLog.completedAt;
        this.validateDates(startDate, endDate);

        await this.activityLogRepository.update(id, {
            ...(startedAt && { startedAt: startDate }),
            ...(completedAt && { completedAt: endDate }),
            ...(routineId && { routine: { id: routineId } }),
        });
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.activityLogRepository.delete(id);
        return { id };
    }

    private validateDates(startedAt: Date, completedAt: Date | null): void {
        if (completedAt && completedAt < startedAt) {
            throw new BadRequestException('La fecha de finalización no puede ser anterior a la fecha de inicio');
        }
    }
}
