import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateRoutineExerciseDto {
    @IsNotEmpty({ message: 'Debe especificar el id de la rutina' })
    @IsInt({ message: 'El id de la rutina debe ser un número entero' })
    @IsPositive({ message: 'El id de la rutina debe ser positivo' })
    routineId: number;

    @IsNotEmpty({ message: 'Debe especificar el id del ejercicio' })
    @IsInt({ message: 'El id del ejercicio debe ser un número entero' })
    @IsPositive({ message: 'El id del ejercicio debe ser positivo' })
    exerciseId: number;

    @IsInt({ message: 'El orden debe ser un número entero' })
    @Min(1, { message: 'El orden debe ser mayor o igual a 1' })
    orderIndex: number;

    @IsOptional()
    @IsInt({ message: 'Las series objetivo deben ser un número entero' })
    @Min(0, { message: 'Las series objetivo no pueden ser negativas' })
    targetSets?: number;

    @IsOptional()
    @IsInt({ message: 'Las repeticiones objetivo deben ser un número entero' })
    @Min(0, { message: 'Las repeticiones objetivo no pueden ser negativas' })
    targetReps?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El peso objetivo debe ser un número' })
    @Min(0, { message: 'El peso objetivo no puede ser negativo' })
    targetWeightKg?: number;

    @IsOptional()
    @IsInt({ message: 'La duración objetivo debe ser un número entero' })
    @Min(0, { message: 'La duración objetivo no puede ser negativa' })
    targetDurationMin?: number;
}
