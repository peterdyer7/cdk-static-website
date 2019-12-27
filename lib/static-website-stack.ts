import cdk = require("@aws-cdk/core");
import s3 = require("@aws-cdk/aws-s3");
import s3d = require("@aws-cdk/aws-s3-deployment");
// import cf = require("@aws-cdk/aws-cloudfront");
// import r53 = require("@aws-cdk/aws-route53");
// import acm = require("@aws-cdk/aws-certificatemanager");
// import targets = require("@aws-cdk/aws-route53-targets/lib");

export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // commenting out code that requires a domain to be deployed/registered

    // const domainName = "mydomain.com";
    // const subDomain = "test";
    // const fqdn = subDomain + domainName;
    // new cdk.CfnOutput(this, "Site", { value: "https://" + fqdn });

    // const zone = r53.HostedZone.fromLookup(this, "Zone", { domainName });

    // website content bucket
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      // bucketName: domainName,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY // update for production use
    });
    new cdk.CfnOutput(this, "Bucket", { value: websiteBucket.bucketName });

    // certificate
    // const certificateArn = new acm.DnsValidatedCertificate(
    //   this,
    //   "SiteCertificate",
    //   {
    //     domainName: fqdn,
    //     hostedZone: zone
    //   }
    // ).certificateArn;
    // new cdk.CfnOutput(this, "Certificate", { value: certificateArn });

    // distribution
    // const distribution = new cf.CloudFrontWebDistribution(
    //   this,
    //   "SiteDistribution",
    //   {
    //     aliasConfiguration: {
    //       acmCertRef: certificateArn,
    //       names: [fqdn],
    //       sslMethod: cf.SSLMethod.SNI,
    //       securityPolicy: cf.SecurityPolicyProtocol.TLS_V1_1_2016
    //     },
    //     originConfigs: [
    //       {
    //         s3OriginSource: {
    //           s3BucketSource: websiteBucket
    //         },
    //         behaviors: [{ isDefaultBehavior: true }]
    //       }
    //     ]
    //   }
    // );
    // new cdk.CfnOutput(this, "DistributionId", {
    //   value: distribution.distributionId
    // });

    // Route53 alias record for the CloudFront distribution
    // new r53.ARecord(this, "SiteAliasRecord", {
    //   recordName: fqdn,
    //   target: r53.AddressRecordTarget.fromAlias(
    //     new targets.CloudFrontTarget(distribution)
    //   ),
    //   zone
    // });

    // deploy to bucket
    new s3d.BucketDeployment(this, "DeployWebsite", {
      sources: [s3d.Source.asset("./site")],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: "web/static" // optional prefix in destination bucket
      // distribution
    });
  }
}
