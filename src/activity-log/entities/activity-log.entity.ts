import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { Routine } from '../../routine/entities/routine.entity';
import { ActivityExercise } from '../../activity-exercise/entities/activity-exercise.entity';

@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'started_at', type: 'timestamp' })
    startedAt: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Routine, (routine) => routine.activityLogs, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'routine_id' })
    routine: Routine;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.activityLog)
    activityExercises: ActivityExercise[];
}
