import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from './entities/routine.entity';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Routine])],
    controllers: [RoutineController],
    providers: [RoutineService],
    exports: [RoutineService],
})
export class RoutineModule {}
