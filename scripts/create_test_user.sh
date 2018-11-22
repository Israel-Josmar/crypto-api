#!/usr/bin/env bash

PROJECT_PROFILE="CryptoArb"

die() {
  echo -e >&2 "\nError: $@\n"
  exit 1
}

# verify args
if [ $# -ne 2 ]; then
  die "usage: $0 <email> <passsword>"
fi

# aws cli should be installed
(
  command -v aws &>/dev/null
)
if [ $? -ne 0 ]; then
  die "awscli should be installed"
fi

# aws profile should exist
(
  aws configure --profile $PROJECT_PROFILE list &>/dev/null
)
if [ $? -ne 0 ]; then
  die "AWS profile $PROJECT_PROFILE should exist"
fi

# aws cli should be working with profile
(
  export AWS_PROFILE=$PROJECT_PROFILE
  aws s3 ls &>/dev/null
)
if [ $? -ne 0 ]; then
  die "awscli unexpected error"
fi

# change dir to project root
cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null
cd ..

# test user from args
TEST_USER_EMAIL=$1
TEST_USER_PASSWORD=$2

# collect project data
SLS_OUTPUT=$(npx sls info --verbose)
REGION=$(echo "$SLS_OUTPUT" | grep 'region: ' | cut -d' ' -f2)
USER_POOL_CLIENT_ID=$(echo "$SLS_OUTPUT" | grep 'UserPoolClientId: ' | cut -d' ' -f2)
USER_POOL_ID=$(echo "$SLS_OUTPUT" | grep 'UserPoolId: ' | cut -d' ' -f2)

# create user
(
  aws cognito-idp sign-up \
   --region $REGION \
   --client-id $USER_POOL_CLIENT_ID \
   --username $TEST_USER_EMAIL \
   --password $TEST_USER_PASSWORD
)
if [ $? -ne 0 ]; then
  die "fail to sign-up user"
fi

# confirm user
(
  export AWS_PROFILE=$PROJECT_PROFILE
  AWS_PROFILE=$PROJECT_PROFILE aws cognito-idp admin-confirm-sign-up \
    --region $REGION \
    --user-pool-id $USER_POOL_ID \
    --username $TEST_USER_EMAIL
)
if [ $? -ne 0 ]; then
  die "fail confirm user sign-up"
fi
