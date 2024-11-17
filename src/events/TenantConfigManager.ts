// TenantConfigManager.ts
import { Options } from 'amqplib';

interface TenantSettings {
  queueOptions?: Options.AssertQueue;
  publishOptions?: Options.Publish;
}

class TenantConfigManager {
  private tenantConfigs: { [tenantId: string]: TenantSettings } = {
    tenantA: {
      queueOptions: { durable: true, maxPriority: 10 },
      publishOptions: { persistent: true },
    },
    tenantB: {
      queueOptions: { durable: false },
      publishOptions: { persistent: false },
    },
    // Add more tenant configurations as needed
  };

  getSettings(tenantId: string): TenantSettings | undefined {
    return this.tenantConfigs[tenantId];
  }
}

export const tenantConfigManager = new TenantConfigManager();
