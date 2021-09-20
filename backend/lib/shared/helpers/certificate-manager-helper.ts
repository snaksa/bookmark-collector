import { Construct } from "@aws-cdk/core";
import { Certificate, ICertificate } from "@aws-cdk/aws-certificatemanager";

export class CertificateManagerHelper {
  static getCertificateFromArn(
    construct: Construct,
    id: string,
    certificateArn: string
  ): ICertificate {
    return Certificate.fromCertificateArn(construct, id, certificateArn);
  }
}
