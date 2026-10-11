import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoutineModule } from '../routine/routine.module';
import { ExerciseModule } from '../exercise/exercise.module';

import { RoutineExercise } from './entities/routine-exercise.entity';
import { RoutineExerciseService } from './routine-exercise.service';
import { RoutineExerciseController } from './routine-exercise.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RoutineExercise]), RoutineModule, ExerciseModule],
    controllers: [RoutineExerciseController],
    providers: [RoutineExerciseService],
    exports: [RoutineExerciseService],
})
export class RoutineExerciseModule {}
