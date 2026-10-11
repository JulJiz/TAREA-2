import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../entities/user.entity';

import { PermissionsGuard } from './permissions.guard';

const buildUser = (permissionNames: string[]): User =>
    ({
        id: 1,
        role: {
            name: 'user',
            rolePermissions: permissionNames.map((name) => ({ permission: { name } })),
        },
    }) as unknown as User;

const buildContext = (user?: User): ExecutionContext =>
    ({
        getHandler: () => jest.fn(),
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
    }) as unknown as ExecutionContext;

describe('PermissionsGuard', () => {
    let reflector: Reflector;
    let guard: PermissionsGuard;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new PermissionsGuard(reflector);
    });

    it('allows access when the handler does not require permissions', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(undefined);

        expect(guard.canActivate(buildContext())).toBe(true);
    });

    it('throws UnauthorizedException when there is no authenticated user', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['read_routine']);

        expect(() => guard.canActivate(buildContext())).toThrow(UnauthorizedException);
    });

    it('allows access when the user has the required permission', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['read_routine']);
        const user = buildUser(['create_routine', 'read_routine']);

        expect(guard.canActivate(buildContext(user))).toBe(true);
    });

    it('throws ForbiddenException when the user lacks the required permission', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['manage_exercises']);
        const user = buildUser(['read_exercise']);

        expect(() => guard.canActivate(buildContext(user))).toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when the user has no role permissions', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['manage_users']);
        const user = buildUser([]);

        expect(() => guard.canActivate(buildContext(user))).toThrow(ForbiddenException);
    });

    it('requires every permission when several are declared', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['read_routine', 'update_routine']);
        const user = buildUser(['read_routine']);

        expect(() => guard.canActivate(buildContext(user))).toThrow(ForbiddenException);
    });
});
