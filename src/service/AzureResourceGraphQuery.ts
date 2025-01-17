import { ResourceGraphClient } from '@azure/arm-resourcegraph';
import { ClientSecretCredential } from '@azure/identity';

export class AzureResourceGraphQuery {
  private client: ResourceGraphClient;

  constructor(tenantId: string, clientId: string, clientSecret: string) {
    const credentials = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret,
    );
    this.client = new ResourceGraphClient(credentials);
  }

  async queryResourcesByTag(
    subscriptionId: string,
    tagKey: string,
    tagValue: string,
  ) {
    const query = `Resources
      | where tags['${tagKey}'] == '${tagValue}'`;

    const result = await this.client.resources({
      subscriptions: [subscriptionId],
      query: query,
    });

    return result.data;
  }
}
