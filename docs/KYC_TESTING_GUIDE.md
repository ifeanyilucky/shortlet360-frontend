# KYC Testing Guide for Shortlet360

## Overview

This guide provides step-by-step instructions for testing the KYC (Know Your Customer) verification system using YouVerify sandbox data.

## Prerequisites

1. **Environment Setup**: Ensure you're running in development/sandbox mode
2. **API Keys**: Use YouVerify sandbox API keys
3. **Base URL**: Set `YOUVERIFY_BASE_URL=https://api.sandbox.youverify.co`
4. **Environment Variable**: Set `NODE_ENV=development` or `NODE_ENV=sandbox`

## Quick Start

### 1. Get Sandbox Test Data

**Endpoint**: `GET /api/kyc/sandbox-data`

```bash
curl -X GET http://localhost:5000/api/kyc/sandbox-data
```

This returns all available test data organized by tiers and roles.

### 2. Test User Registration and KYC Flow

#### Step 1: Register a Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john.doe@test.com",
    "password": "password123",
    "role": "user"
  }'
```

#### Step 2: Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@test.com",
    "password": "password123"
  }'
```

Save the returned JWT token for subsequent requests.

#### Step 3: Check Initial KYC Status
```bash
curl -X GET http://localhost:5000/api/kyc/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Scenarios by Role

### USER Role Testing

Users only need **Tier 1** verification (Phone + NIN).

#### Successful Tier 1 Verification
```bash
curl -X POST http://localhost:5000/api/kyc/tier1/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "08000000000",
    "nin": "11111111111"
  }'
```

**Expected Result**: Both phone and NIN verification succeed, Tier 1 status becomes "verified".

#### Failed Phone Verification Test
```bash
curl -X POST http://localhost:5000/api/kyc/tier1/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "08000000001",
    "nin": "11111111111"
  }'
```

**Expected Result**: Phone verification fails, error message returned.

#### Failed NIN Verification Test
```bash
curl -X POST http://localhost:5000/api/kyc/tier1/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "08000000000",
    "nin": "00000000000"
  }'
```

**Expected Result**: NIN verification fails, error message returned.

### OWNER Role Testing

Owners need **Tier 1 + Tier 2** verification (Phone + NIN + Utility Bill).

#### Step 1: Complete Tier 1 (same as User)
Use the successful Tier 1 verification from above.

#### Step 2: Submit Tier 2 (Utility Bill)
```bash
curl -X POST http://localhost:5000/api/kyc/tier2/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "utility_bill=@/path/to/test-utility-bill.pdf" \
  -F "document_type=electricity"
```

**Expected Result**: Document uploaded successfully, Tier 2 status becomes "pending" (requires manual admin review).

#### Step 3: Admin Review (Manual Process)
Admin users can review and approve/reject Tier 2 submissions through the admin dashboard.

### Advanced Testing (Tier 3)

For users who need monthly rent payment capabilities.

#### Successful Tier 3 Verification
```bash
curl -X POST http://localhost:5000/api/kyc/tier3/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bvn_number": "11111111111",
    "account_number": "1000000000",
    "bank_code": "058",
    "business_name": "Test Company Limited",
    "business_type": "company",
    "rc_number": "RC0000000"
  }'
```

**Expected Result**: All verifications (BVN, Bank Account, Business) succeed.

#### Failed BVN Verification Test
```bash
curl -X POST http://localhost:5000/api/kyc/tier3/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bvn_number": "00000000000",
    "account_number": "1000000000",
    "bank_code": "058",
    "business_name": "Test Company Limited",
    "business_type": "company",
    "rc_number": "RC0000000"
  }'
```

**Expected Result**: BVN verification fails, other verifications may succeed.

#### Failed Bank Account Verification Test
```bash
curl -X POST http://localhost:5000/api/kyc/tier3/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bvn_number": "11111111111",
    "account_number": "1111111111",
    "bank_code": "058",
    "business_name": "Test Company Limited",
    "business_type": "company",
    "rc_number": "RC0000000"
  }'
```

**Expected Result**: Bank account verification fails, other verifications may succeed.

## Test Data Quick Reference

### Valid Test Data
- **Phone**: `08000000000`, `08111111111`, `08222222222`
- **NIN**: `11111111111`, `22222222222`, `33333333333`
- **BVN**: `11111111111`, `22222222222`
- **Bank Account**: `1000000000` (GTBank), `2000000000` (First Bank), `3000000000` (UBA)
- **RC Number**: `RC0000000`, `BN0000000`

### Invalid Test Data (for failure testing)
- **Phone**: `08000000001`, `00000000000`
- **NIN**: `00000000000`, `99999999999`
- **BVN**: `00000000000`
- **Bank Account**: `1111111111`
- **RC Number**: `RC11111111`

## Automated Testing with Jest

### Example Test Suite

```javascript
describe('KYC Verification Tests', () => {
  let userToken;
  
  beforeAll(async () => {
    // Register and login test user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    userToken = loginResponse.body.token;
  });

  describe('Tier 1 Verification', () => {
    test('should succeed with valid phone and NIN', async () => {
      const response = await request(app)
        .post('/api/kyc/tier1/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          phone_number: '08000000000',
          nin: '11111111111'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.kyc.tier1.status).toBe('verified');
    });

    test('should fail with invalid phone number', async () => {
      const response = await request(app)
        .post('/api/kyc/tier1/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          phone_number: '08000000001',
          nin: '11111111111'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Phone number verification failed');
    });
  });

  describe('Tier 3 Verification', () => {
    test('should succeed with valid BVN and bank account', async () => {
      const response = await request(app)
        .post('/api/kyc/tier3/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          bvn_number: '11111111111',
          account_number: '1000000000',
          bank_code: '058',
          business_name: 'Test Company Limited',
          business_type: 'company',
          rc_number: 'RC0000000'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.kyc.tier3.status).toBe('verified');
    });
  });
});
```

## Common Issues and Troubleshooting

### 1. "Sandbox data not available in production"
- **Cause**: Trying to access sandbox endpoint in production
- **Solution**: Ensure `NODE_ENV` is set to `development` or `sandbox`

### 2. "Phone number verification failed"
- **Cause**: Using invalid test phone number
- **Solution**: Use valid sandbox phone numbers: `08000000000`, `08111111111`, etc.

### 3. "NIN verification failed"
- **Cause**: Using invalid test NIN
- **Solution**: Use valid sandbox NIMs: `11111111111`, `22222222222`, etc.

### 4. "YouVerify API token missing"
- **Cause**: Missing or incorrect API token
- **Solution**: Ensure `YOUVERIFY_API_TOKEN` environment variable is set with sandbox token

### 5. "Bank account verification failed"
- **Cause**: Using invalid test bank account
- **Solution**: Use valid sandbox accounts: `1000000000`, `2000000000`, `3000000000`

## Environment Variables Checklist

```bash
# YouVerify Configuration
YOUVERIFY_BASE_URL=https://api.sandbox.youverify.co
YOUVERIFY_API_TOKEN=your_sandbox_api_token

# Application Environment
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (use test database)
MONGODB_URI=mongodb://localhost:27017/shortlet360_test
```

## Next Steps

1. **Run Tests**: Execute the test scenarios above
2. **Check Logs**: Monitor console logs for verification responses
3. **Admin Dashboard**: Test manual Tier 2 review process
4. **Integration**: Test with frontend KYC forms
5. **Production**: Switch to production environment and real data when ready

## Support

- **Documentation**: See `docs/YOUVERIFY_SANDBOX_DATA.md` for complete test data
- **API Reference**: https://doc.youverify.co
- **Issues**: Check application logs and YouVerify response messages
