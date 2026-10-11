import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Controller('activity-logs')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ActivityLogController {
    constructor(private readonly activityLogService: ActivityLogService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_activity_log')
    create(@Body() createActivityLogDto: CreateActivityLogDto, @CurrentUser() user: User) {
        return this.activityLogService.create(createActivityLogDto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('read_activity_log')
    findAll() {
        return this.activityLogService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('read_activity_log')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.activityLogService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('update_activity_log')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateActivityLogDto: UpdateActivityLogDto) {
        return this.activityLogService.update(id, updateActivityLogDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_activity_log')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.activityLogService.remove(id);
    }
}
