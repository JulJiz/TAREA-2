import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityExerciseNotFoundException } from '../common/exceptions';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { RoutineExerciseService } from '../routine-exercise/routine-exercise.service';

import { ActivityExercise } from './entities/activity-exercise.entity';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Injectable()
export class ActivityExerciseService {
    constructor(
        @InjectRepository(ActivityExercise)
        private readonly activityExerciseRepository: Repository<ActivityExercise>,
        private readonly activityLogService: ActivityLogService,
        private readonly routineExerciseService: RoutineExerciseService,
    ) {}

    async create(createActivityExerciseDto: CreateActivityExerciseDto): Promise<ActivityExercise> {
        const { activityLogId, routineExerciseId, startedAt, completedAt, ...activityExerciseData } =
            createActivityExerciseDto;
        await this.validateRoutineMatch(activityLogId, routineExerciseId);

        const startDate = startedAt ? new Date(startedAt) : null;
        const endDate = completedAt ? new Date(completedAt) : null;
        this.validateDates(startDate, endDate);

        const activityExercise = this.activityExerciseRepository.create({
            ...activityExerciseData,
            ...(startDate && { startedAt: startDate }),
            ...(endDate && { completedAt: endDate }),
            activityLog: { id: activityLogId },
            routineExercise: { id: routineExerciseId },
        });
        const savedActivityExercise = await this.activityExerciseRepository.save(activityExercise);
        return this.findOne(savedActivityExercise.id);
    }

    async findAll(): Promise<ActivityExercise[]> {
        return await this.activityExerciseRepository.find({
            relations: { activityLog: true, routineExercise: { exercise: true } },
            order: { activityLog: { id: 'ASC' }, id: 'ASC' },
        });
    }

    async findOne(id: number): Promise<ActivityExercise> {
        const activityExercise = await this.activityExerciseRepository.findOne({
            where: { id },
            relations: { activityLog: { routine: true }, routineExercise: { exercise: true, routine: true } },
        });
        if (!activityExercise) {
            throw new ActivityExerciseNotFoundException(id);
        }
        return activityExercise;
    }

    async update(id: number, updateActivityExerciseDto: UpdateActivityExerciseDto): Promise<ActivityExercise> {
        const { activityLogId, routineExerciseId, startedAt, completedAt, ...activityExerciseData } =
            updateActivityExerciseDto;
        const activityExercise = await this.findOne(id);

        if (activityLogId || routineExerciseId) {
            await this.validateRoutineMatch(
                activityLogId ?? activityExercise.activityLog.id,
                routineExerciseId ?? activityExercise.routineExercise.id,
            );
        }

        const startDate = startedAt ? new Date(startedAt) : activityExercise.startedAt;
        const endDate = completedAt ? new Date(completedAt) : activityExercise.completedAt;
        this.validateDates(startDate, endDate);

        await this.activityExerciseRepository.update(id, {
            ...activityExerciseData,
            ...(startedAt && { startedAt: startDate }),
            ...(completedAt && { completedAt: endDate }),
            ...(activityLogId && { activityLog: { id: activityLogId } }),
            ...(routineExerciseId && { routineExercise: { id: routineExerciseId } }),
        });
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.activityExerciseRepository.delete(id);
        return { id };
    }

    private async validateRoutineMatch(activityLogId: number, routineExerciseId: number): Promise<void> {
        const activityLog = await this.activityLogService.findOne(activityLogId);
        const routineExercise = await this.routineExerciseService.findOne(routineExerciseId);

        if (activityLog.routine.id !== routineExercise.routine.id) {
            throw new BadRequestException(
                'El ejercicio de la rutina no pertenece a la rutina asociada al registro de actividad',
            );
        }
    }

    private validateDates(startedAt: Date | null, completedAt: Date | null): void {
        if (startedAt && completedAt && completedAt < startedAt) {
            throw new BadRequestException('La fecha de finalización no puede ser anterior a la fecha de inicio');
        }
    }
}
