import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateActivityLogDto {
    @IsNotEmpty({ message: 'Debe especificar el id de la rutina' })
    @IsInt({ message: 'El id de la rutina debe ser un número entero' })
    @IsPositive({ message: 'El id de la rutina debe ser positivo' })
    routineId: number;

    @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
    @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO 8601' })
    startedAt: string;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de finalización debe tener formato ISO 8601' })
    completedAt?: string;
}
