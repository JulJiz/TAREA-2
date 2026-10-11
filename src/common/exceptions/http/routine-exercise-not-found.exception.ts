import { NotFoundException } from '@nestjs/common';

export class RoutineExerciseNotFoundException extends NotFoundException {
    constructor(routineExerciseId: number) {
        super({
            error: 'Routine Exercise Not Found',
            message: `El ejercicio de rutina con identificador ${routineExerciseId} no fue encontrado.`,
        });
    }
}
