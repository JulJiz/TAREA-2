import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogModule } from '../activity-log/activity-log.module';
import { RoutineExerciseModule } from '../routine-exercise/routine-exercise.module';

import { ActivityExercise } from './entities/activity-exercise.entity';
import { ActivityExerciseService } from './activity-exercise.service';
import { ActivityExerciseController } from './activity-exercise.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityExercise]), ActivityLogModule, RoutineExerciseModule],
    controllers: [ActivityExerciseController],
    providers: [ActivityExerciseService],
    exports: [ActivityExerciseService],
})
export class ActivityExerciseModule {}
