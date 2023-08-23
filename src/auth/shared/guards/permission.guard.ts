import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { isArray } from 'class-validator';
export function PermissionGuard(permission: any): Type<CanActivate> {
  class PermissionGuardMixin implements CanActivate {

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<any>();
      const profile: number = request?.user?.profile;

      if (isArray(permission)) {

        return permission?.includes(profile)

      }
      return permission === profile;
    }
  }
  return mixin(PermissionGuardMixin);
}