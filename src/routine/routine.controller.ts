import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routines')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RoutineController {
    constructor(private readonly routineService: RoutineService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_routine')
    create(@Body() createRoutineDto: CreateRoutineDto, @CurrentUser() user: User) {
        return this.routineService.create(createRoutineDto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('read_routine')
    findAll() {
        return this.routineService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('read_routine')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.routineService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('update_routine')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateRoutineDto: UpdateRoutineDto) {
        return this.routineService.update(id, updateRoutineDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_routine')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.routineService.remove(id);
    }
}
