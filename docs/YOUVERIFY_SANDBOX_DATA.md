# YouVerify Sandbox Test Data Guide

## Overview

This document provides comprehensive sandbox test data for YouVerify API integration, organized by KYC tiers and user roles for the aplet360 platform.

## Environment Configuration

- **Sandbox Base URL**: `https://api.sandbox.youverify.co`
- **Production Base URL**: `https://api.youverify.co`
- **API Version**: v2

## KYC Tier Requirements by Role

### User Role

- **Required Tiers**: Tier 1 only
- **Purpose**: Basic platform access
- **Verification Flow**:
  1. Email verification
  2. Phone number verification
  3. NIN verification

### Owner Role

- **Required Tiers**: Tier 1 + Tier 2
- **Purpose**: Property listing capability
- **Verification Flow**:
  1. Email verification
  2. Phone number verification
  3. NIN verification
  4. Utility bill upload and manual review

### Admin Role

- **Required Tiers**: None
- **Purpose**: Platform administration
- **Verification Flow**: No KYC required

## Tier 1: Phone Number + NIN Verification

### Valid Test Data (Returns "found" status)

#### Phone Numbers

```
08000000000  # Primary sandbox phone
08111111111  # Alternative valid phone
08222222222  # Additional valid phone
07000000000  # MTN test number
09000000000  # 9mobile test number
```

#### National Identification Numbers (NIN)

```
11111111111  # Primary sandbox NIN
22222222222  # Alternative valid NIN
33333333333  # Additional valid NIN
```

#### Expected NIN Response Sample

```json
{
  "firstName": "JOHN",
  "middleName": "ADEBAYO",
  "lastName": "DOE",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "mobile": "08000000000",
  "address": "123 Test Street, Lagos, Nigeria",
  "birthState": "Lagos",
  "birthLGA": "Lagos Island",
  "birthCountry": "Nigeria",
  "religion": "Christianity"
}
```

### Invalid Test Data (Returns "not_found" status)

#### Phone Numbers

```
08000000001  # Invalid phone (not found)
00000000000  # Invalid format
```

#### NINs

```
00000000000  # Invalid NIN (not found)
99999999999  # Another invalid NIN
```

## Tier 2: Utility Bill Verification

### Document Types Accepted

- `electricity` - NEPA/PHCN bill
- `water` - Water corporation bill
- `gas` - Gas company bill
- `internet` - Internet service provider bill
- `cable_tv` - Cable TV subscription
- `phone` - Phone/telecom bill

**Note**: Tier 2 requires manual document review by admin. No automated verification through YouVerify API.

## Tier 3: BVN + Bank Account + Business Verification

### Valid Test Data

#### Bank Verification Numbers (BVN)

```
11111111111  # Primary sandbox BVN
22222222222  # Alternative valid BVN
```

#### Bank Accounts

```json
[
  {
    "account_number": "1000000000",
    "bank_code": "058",
    "bank_name": "Guaranty Trust Bank",
    "account_name": "JOHN ADEBAYO DOE"
  },
  {
    "account_number": "2000000000",
    "bank_code": "011",
    "bank_name": "First Bank of Nigeria",
    "account_name": "JANE ADEBAYO SMITH"
  },
  {
    "account_number": "3000000000",
    "bank_code": "033",
    "bank_name": "United Bank for Africa",
    "account_name": "MICHAEL ADEBAYO JOHNSON"
  }
]
```

#### Business Registration

```json
[
  {
    "rc_number": "RC0000000",
    "business_name": "Test Company Limited",
    "business_type": "company",
    "country_code": "NG"
  },
  {
    "rc_number": "BN0000000",
    "business_name": "Test Business Enterprise",
    "business_type": "business",
    "country_code": "NG"
  }
]
```

#### Expected BVN Response Sample

```json
{
  "firstName": "JOHN",
  "middleName": "ADEBAYO",
  "lastName": "DOE",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "08000000000",
  "registrationDate": "2010-01-01",
  "enrollmentBank": "058",
  "enrollmentBranch": "Victoria Island"
}
```

### Invalid Test Data

#### BVNs

```
00000000000  # Invalid BVN (not found)
```

#### Bank Accounts

```json
{
  "account_number": "1111111111",
  "bank_code": "058",
  "bank_name": "Guaranty Trust Bank"
}
```

#### Business Registration

```json
{
  "rc_number": "RC11111111",
  "business_name": "Invalid Company",
  "business_type": "company"
}
```

## Additional YouVerify Services (Future Implementation)

### Driver's License

- **Valid**: `AAA00000AA00`
- **Invalid**: `AAA11111AA11`

### International Passport

- **Valid**: `A11111111`
- **Invalid**: `A00000000`

### Permanent Voter's Card (PVC)

- **Valid**: `00A0A0A000000000000`
- **Invalid**: `11A1A1A111111111111`

### Virtual NIN (vNIN)

- **Valid**: `YV111111111111FY`
- **Invalid**: `YV000000000000FY`

### Tax Identification Number (TIN)

- **Valid**: `00000000-0000`
- **Invalid**: `11111111-1111`

## Testing Scenarios

### Successful Tier 1 Verification

```json
{
  "phone_number": "08000000000",
  "nin": "11111111111",
  "expected_result": "verified"
}
```

### Failed Tier 1 - Phone Verification

```json
{
  "phone_number": "08000000001",
  "nin": "11111111111",
  "expected_result": "phone_verification_failed"
}
```

### Failed Tier 1 - NIN Verification

```json
{
  "phone_number": "08000000000",
  "nin": "00000000000",
  "expected_result": "nin_verification_failed"
}
```

### Successful Tier 3 Verification

```json
{
  "bvn": "11111111111",
  "account_number": "1000000000",
  "bank_code": "058",
  "business_name": "Test Company Limited",
  "rc_number": "RC0000000",
  "expected_result": "verified"
}
```

### Failed Tier 3 - BVN Verification

```json
{
  "bvn": "00000000000",
  "account_number": "1000000000",
  "bank_code": "058",
  "expected_result": "bvn_verification_failed"
}
```

### Failed Tier 3 - Bank Account Verification

```json
{
  "bvn": "11111111111",
  "account_number": "1111111111",
  "bank_code": "058",
  "expected_result": "bank_verification_failed"
}
```

## API Endpoint for Sandbox Data

### GET /api/kyc/sandbox-data

Returns the complete sandbox test data configuration.

**Response:**

```json
{
  "message": "YouVerify Sandbox Test Data",
  "environment": "sandbox",
  "base_url": "https://api.sandbox.youverify.co",
  "data": {
    "tier1": { ... },
    "tier2": { ... },
    "tier3": { ... },
    "additional_services": { ... },
    "role_requirements": { ... },
    "test_scenarios": { ... }
  },
  "usage_notes": [
    "Use valid test data for successful verification scenarios",
    "Use invalid test data for failure testing scenarios",
    "Tier 2 requires manual document review by admin",
    "All test data only works in sandbox environment",
    "Switch to production data when going live"
  ]
}
```

## Important Notes

1. **Environment Restriction**: Sandbox data only works in the sandbox environment
2. **Production Switch**: Remember to switch to production data when going live
3. **Manual Review**: Tier 2 utility bills require manual admin review
4. **API Keys**: Use sandbox API keys for testing, production keys for live environment
5. **Rate Limits**: Sandbox environment may have different rate limits than production

## Bank Codes Reference

Common Nigerian bank codes for testing:

- `058` - Guaranty Trust Bank (GTBank)
- `011` - First Bank of Nigeria
- `033` - United Bank for Africa (UBA)
- `044` - Access Bank
- `057` - Zenith Bank
- `070` - Fidelity Bank
- `221` - Stanbic IBTC Bank

## Support

For issues with YouVerify integration:

- Documentation: https://doc.youverify.co
- Support: Contact YouVerify support team
- Environment: Ensure you're using the correct sandbox/production environment
