# Set up

Create a `.env` file with the following contents:

```env
ENDPOINT=<comma-separated list of endpoint names>
DB_CONNECTION=<comma-separated list of pg connection strings>
PORT=<optional, default 3000>
```

For example:

```env
ENDPOINT=mainnet,testnet
DB_CONNECTION=postgres://user:pass@mainnet_host/db_name,postgres://user:pass@testnet_host/db_name
```

You can use the public endpoints found [here](https://github.com/near/near-indexer-for-explorer#shared-public-access).

# Run

Node:

```
$ npm run start
```

Docker:

```
$ docker-compose up
```
