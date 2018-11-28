# crypto-api
API for cryptocurrency arbitrage app

## How to deploy

### Create a IAM on an AWS account
- Give it permissions:
  - all permissions, // TODO enumerate only needed permissions
- Store the credential as `CryptoArb` profile on AWS credentials file (probably on path `~/.aws/credentials`)
```
[CryptoArb]
aws_access_key_id = XXXXXXXXXXXXXXXXXXXX
aws_secret_access_key = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Use Serverless Framework (sls) to deploy to AWS
- Deploy to AWS (it will use `CriptoArb` profile)
```
npx sls deploy
```

- Wait until the command finishes.
- In case of succes, it will output a message similar to:
```
Serverless: Stack update finished...
Service Information
service: crypto-api
stage: dev
region: us-east-2
stack: crypto-api-dev
api keys:
  None
endpoints:
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/dev/dashboard
functions:
  dashboard: crypto-api-dev-dashboard
```

### Show deployed resources ID's
- Use the info command while verbose to print stack outputs
```
npx sls info --verbose
```
- It will print something with a `Stack Outputs` section similar to:
```
Stack Outputs
UserPoolClientId: xxxxxxxxxxxxxxxxxxxxxxxxxx
UserPoolId: us-east-2_XXXXXXXXX
IdentityPoolId: us-east-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ServiceEndpoint: https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/dev
```


### Create a test user
- Use scripts/create_test_user.sh passing email and password
```
./scripts/create_test_user.sh change-me@email.com change-to-a-strong-password
```
