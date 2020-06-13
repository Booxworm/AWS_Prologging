const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const ProactiveLogging = require('../lib/proactive_logging-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ProactiveLogging.ProactiveLoggingStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
