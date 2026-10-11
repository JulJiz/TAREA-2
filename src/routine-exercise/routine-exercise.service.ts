import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoutineExerciseNotFoundException } from '../common/exceptions';
import { RoutineService } from '../routine/routine.service';
import { ExerciseService } from '../exercise/exercise.service';

import { RoutineExercise } from './entities/routine-exercise.entity';
import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Injectable()
export class RoutineExerciseService {
    constructor(
        @InjectRepository(RoutineExercise)
        private readonly routineExerciseRepository: Repository<RoutineExercise>,
        private readonly routineService: RoutineService,
        private readonly exerciseService: ExerciseService,
    ) {}

    async create(createRoutineExerciseDto: CreateRoutineExerciseDto): Promise<RoutineExercise> {
        const { routineId, exerciseId, ...routineExerciseData } = createRoutineExerciseDto;
        await this.routineService.findOne(routineId);
        await this.exerciseService.findOne(exerciseId);

        const routineExercise = this.routineExerciseRepository.create({
            ...routineExerciseData,
            routine: { id: routineId },
            exercise: { id: exerciseId },
        });
        const savedRoutineExercise = await this.routineExerciseRepository.save(routineExercise);
        return this.findOne(savedRoutineExercise.id);
    }

    async findAll(): Promise<RoutineExercise[]> {
        return await this.routineExerciseRepository.find({
            relations: { routine: true, exercise: true },
            order: { routine: { id: 'ASC' }, orderIndex: 'ASC' },
        });
    }

    async findOne(id: number): Promise<RoutineExercise> {
        const routineExercise = await this.routineExerciseRepository.findOne({
            where: { id },
            relations: { routine: true, exercise: true },
        });
        if (!routineExercise) {
            throw new RoutineExerciseNotFoundException(id);
        }
        return routineExercise;
    }

    async update(id: number, updateRoutineExerciseDto: UpdateRoutineExerciseDto): Promise<RoutineExercise> {
        const { routineId, exerciseId, ...routineExerciseData } = updateRoutineExerciseDto;
        await this.findOne(id);

        if (routineId) {
            await this.routineService.findOne(routineId);
        }
        if (exerciseId) {
            await this.exerciseService.findOne(exerciseId);
        }

        await this.routineExerciseRepository.update(id, {
            ...routineExerciseData,
            ...(routineId && { routine: { id: routineId } }),
            ...(exerciseId && { exercise: { id: exerciseId } }),
        });
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.routineExerciseRepository.delete(id);
        return { id };
    }
}
