import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

type TenantStore = { tenantId?: string };

@Injectable()
export class TenantContextService {
  private readonly als = new AsyncLocalStorage<TenantStore>();

  run<T>(cb: () => T): T {
    return this.als.run({}, cb);
  }
  setTenantId(id: string): void {
    const store = this.als.getStore();

    if (!store) {
      throw new Error(
        'TenantContextService.setTenantId() called outside ALS run() scope',
      );
    }

    store.tenantId = id;
  }
  getTenantId(): string {
    const store = this.als.getStore();

    if (!store || !store.tenantId) {
      throw new Error(
        'TenantContextService.getTenantId() called outside request context or tenantId not set',
      );
    }

    return store.tenantId;
  }
}
