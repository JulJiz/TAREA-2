import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { ActivityExerciseService } from './activity-exercise.service';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Controller('activity-exercises')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ActivityExerciseController {
    constructor(private readonly activityExerciseService: ActivityExerciseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_activity_log')
    create(@Body() createActivityExerciseDto: CreateActivityExerciseDto) {
        return this.activityExerciseService.create(createActivityExerciseDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('read_activity_log')
    findAll() {
        return this.activityExerciseService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('read_activity_log')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.activityExerciseService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('update_activity_log')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateActivityExerciseDto: UpdateActivityExerciseDto) {
        return this.activityExerciseService.update(id, updateActivityExerciseDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_activity_log')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.activityExerciseService.remove(id);
    }
}
