import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateExerciseDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString({ message: 'El tipo debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El tipo de ejercicio es obligatorio' })
    @MaxLength(50, { message: 'El tipo no puede exceder 50 caracteres' })
    type: string;

    @IsOptional()
    @IsNumber({}, { message: 'Las calorías estimadas deben ser un número' })
    @Min(0, { message: 'Las calorías estimadas no pueden ser negativas' })
    estimatedCalories?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La distancia estimada debe ser un número' })
    @Min(0, { message: 'La distancia estimada no puede ser negativa' })
    estimatedDistanceKm?: number;

    @IsOptional()
    @IsInt({ message: 'La duración estimada debe ser un número entero' })
    @Min(0, { message: 'La duración estimada no puede ser negativa' })
    estimatedDurationMin?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    icon?: string;
}
