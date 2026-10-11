import { NotFoundException } from '@nestjs/common';

export class ActivityLogNotFoundException extends NotFoundException {
    constructor(activityLogId: number) {
        super({
            error: 'Activity Log Not Found',
            message: `El registro de actividad con identificador ${activityLogId} no fue encontrado.`,
        });
    }
}
