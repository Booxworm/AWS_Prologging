const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const lambdaDest = require('@aws-cdk/aws-lambda-destinations');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');
const sqs = require('@aws-cdk/aws-sqs');
const logs = require('@aws-cdk/aws-logs');
const logsDest = require('@aws-cdk/aws-logs-destinations');
const s3 = require('@aws-cdk/aws-s3');
const sns = require('@aws-cdk/aws-sns');
const subs = require('@aws-cdk/aws-sns-subscriptions');

class ProactiveLoggingStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // // Policies
    // const policy = new iam.PolicyStatement({
    //   resource : [],
    //   action : ['s3:PutObject']
    // });

    // // Roles
    // const role = new iam.Role(this, BucketRole, )

    // Input lambda function
    const inputFn = new lambda.Function(this, 'InputFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset('lambda'),
      handler: 'input.handler',

      logRetention: logs.RetentionDays.ONE_DAY
    });

    const queue = new sqs.Queue(this, 'InputQueue');

    inputFn.addEventSource(new eventSources.SqsEventSource(queue));

    const bucket = new s3.Bucket(this, 'MyBucket', {
      // accessControl: s3.BucketAccessControl.PUBLIC_READ,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const logsTopic = new sns.Topic(this, 'LogsTopic');

    const logsFn = new lambda.Function(this, 'LogsFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset('lambda'),
      handler: 'logs.handler',
      logRetention: logs.RetentionDays.ONE_DAY,

      environment: {
        BUCKET_NAME: bucket.bucketName
      },

      onSuccess: new lambdaDest.SnsDestination(logsTopic)
    });

    bucket.grantReadWrite(logsFn);

    new logs.SubscriptionFilter(this, 'Subscription', {
      logGroup: inputFn.logGroup,
      destination: new logsDest.LambdaDestination(logsFn),
      filterPattern: logs.FilterPattern.allTerms('ERROR')
    });

    // logsTopic.addSubscription(new subs.EmailSubscription('lee.wonnjen@gmail.com', {
    //   json: false
    // }));
  }
}

module.exports = { ProactiveLoggingStack }
