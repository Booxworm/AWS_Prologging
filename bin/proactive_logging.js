#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ProactiveLoggingStack } = require('../lib/proactive_logging-stack');

const app = new cdk.App();
new ProactiveLoggingStack(app, 'ProactiveLoggingStack', {
    env : {
        account : 917066274413,
        region : 'ap-southeast-1'
    }
});
