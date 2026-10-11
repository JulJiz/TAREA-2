import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateActivityExerciseDto {
    @IsNotEmpty({ message: 'Debe especificar el id del registro de actividad' })
    @IsInt({ message: 'El id del registro de actividad debe ser un número entero' })
    @IsPositive({ message: 'El id del registro de actividad debe ser positivo' })
    activityLogId: number;

    @IsNotEmpty({ message: 'Debe especificar el id del ejercicio de la rutina' })
    @IsInt({ message: 'El id del ejercicio de la rutina debe ser un número entero' })
    @IsPositive({ message: 'El id del ejercicio de la rutina debe ser positivo' })
    routineExerciseId: number;

    @IsOptional()
    @IsInt({ message: 'Las series realizadas deben ser un número entero' })
    @Min(0, { message: 'Las series realizadas no pueden ser negativas' })
    actualSets?: number;

    @IsOptional()
    @IsInt({ message: 'Las repeticiones realizadas deben ser un número entero' })
    @Min(0, { message: 'Las repeticiones realizadas no pueden ser negativas' })
    actualReps?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El peso utilizado debe ser un número' })
    @Min(0, { message: 'El peso utilizado no puede ser negativo' })
    actualWeightKg?: number;

    @IsOptional()
    @IsInt({ message: 'La duración real debe ser un número entero' })
    @Min(0, { message: 'La duración real no puede ser negativa' })
    actualDurationMin?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Las calorías quemadas deben ser un número' })
    @Min(0, { message: 'Las calorías quemadas no pueden ser negativas' })
    caloriesBurned?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La distancia recorrida debe ser un número' })
    @Min(0, { message: 'La distancia recorrida no puede ser negativa' })
    distanceCoveredKm?: number;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO 8601' })
    startedAt?: string;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de finalización debe tener formato ISO 8601' })
    completedAt?: string;
}
