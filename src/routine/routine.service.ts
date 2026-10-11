import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import { RoutineNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';

import { Routine } from './entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

const ROUTINE_SELECT: FindOptionsSelect<Routine> = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    user: { id: true, username: true, email: true },
};

@Injectable()
export class RoutineService {
    constructor(
        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,
    ) {}

    async create(createRoutineDto: CreateRoutineDto, user: User): Promise<Routine> {
        const routine = this.routineRepository.create({ ...createRoutineDto, user: { id: user.id } });
        const savedRoutine = await this.routineRepository.save(routine);
        return this.findOne(savedRoutine.id);
    }

    async findAll(): Promise<Routine[]> {
        return await this.routineRepository.find({
            select: ROUTINE_SELECT,
            relations: { user: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Routine> {
        const routine = await this.routineRepository.findOne({
            where: { id },
            select: { ...ROUTINE_SELECT, routineExercises: true },
            relations: { user: true, routineExercises: { exercise: true } },
            order: { routineExercises: { orderIndex: 'ASC' } },
        });
        if (!routine) {
            throw new RoutineNotFoundException(id);
        }
        return routine;
    }

    async update(id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
        await this.findOne(id);
        await this.routineRepository.update(id, updateRoutineDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.routineRepository.delete(id);
        return { id };
    }
}
