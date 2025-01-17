# Azure Resource Backend Plugin

Welcome to the **Azure Resource backend Plugin**!

_This plugin was created through the Backstage CLI._

---

## Features

- it run a query on azure graph api to retrive resources.

---

## Limitations

- Supports Azure resources queried through the **Azure Resource Graph API**.
- Requires **tags** to be defined in the `catalog-info.yaml` for filtering.

---

## Setup

### Installation and Configuration

To set up the Azure Resource backend Plugin in your Backstage instance, follow these steps:

#### 1. Install the Plugin

Run the following command in the backend directory of your Backstage project:

```bash
yarn --cwd packages/app add @anuragpachauri/azure-backend
```

### Configuration

#### 1. add these line in packages/backend/src/index.ts

```bash
backend.add(import('@anuragpachauri/azure-backend'));
```

After registration, add the azure resource plugin to Configure Front-end
https://github.com/anuragpachauri/azure-resource

Future Enhancements
Support for additional Azure services beyond those accessible via the Resource Graph API.

Enhanced filtering and sorting capabilities.
Feedback

Feel free to suggest changes or report issues by creating a GitHub issue.
