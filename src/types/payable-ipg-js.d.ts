declare module "payable-ipg-js" {
  export type PayablePaymentDetails = {
    logoUrl: string;
    returnUrl: string;
    notifyUrl?: string;
    checkValue: string;
    orderDescription: string;
    invoiceId: string;
    merchantKey: string;
    customerFirstName: string;
    customerLastName: string;
    customerMobilePhone: string;
    customerEmail: string;
    billingAddressStreet: string;
    billingAddressCity: string;
    billingAddressCountry: string;
    amount: string;
    currencyCode: string;
    paymentType: "1" | "2";
    billingAddressPostcodeZip?: string;
    billingAddressStateProvince?: string;
    billingCompanyName?: string;
    custom1?: string;
  };

  export type PayablePaymentResult = {
    success: boolean;
    status: number;
    message?: string;
    error?: string | Record<string, string[]>;
  };

  export function payablePayment(
    payment: PayablePaymentDetails,
    testMode?: boolean,
  ): Promise<PayablePaymentResult>;
}
