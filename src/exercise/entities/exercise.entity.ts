import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoutineExercise } from '../../routine-exercise/entities/routine-exercise.entity';

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 50 })
    type: string;

    @Column({ name: 'estimated_calories', type: 'float', nullable: true })
    estimatedCalories: number;

    @Column({ name: 'estimated_distance_km', type: 'float', nullable: true })
    estimatedDistanceKm: number;

    @Column({ name: 'estimated_duration_min', type: 'int', nullable: true })
    estimatedDurationMin: number;

    @Column({ length: 255, nullable: true })
    icon: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises: RoutineExercise[];
}
