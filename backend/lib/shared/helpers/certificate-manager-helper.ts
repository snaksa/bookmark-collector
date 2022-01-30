import { Construct } from "constructs";
import { Certificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";

export class CertificateManagerHelper {
  static getCertificateFromArn(
    construct: Construct,
    id: string,
    certificateArn: string
  ): ICertificate {
    return Certificate.fromCertificateArn(construct, id, certificateArn);
  }
}
