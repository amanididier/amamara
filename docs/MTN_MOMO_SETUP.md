# Amamaza MTN MoMo setup

This integration targets Supabase project `kuuvfikaupbsdhdhpcrm`.

## Current architecture

- `momo-payments`: authenticated Edge Function for wallet reads, MTN payment initiation, status polling, and ad-order payment requests.
- `momo-callback`: production-only callback endpoint. It does not trust the callback body; it asks MTN for the transaction status before finalizing the ledger.
- PostgreSQL tables: `wallet_accounts`, `wallet_transactions`, `momo_payments`, and `ad_orders`.
- RLS lets signed-in customers read only their own rows. Writes and financial finalization are service-role-only.
- Wallet credits are idempotent. Sandbox credits are stored separately from real RWF.
- MTN's published tariff is not hard-coded as a customer fee. Contracted merchant charges must be confirmed with MTN.

## Required sandbox secrets

In Supabase Dashboard → Edge Functions → Secrets, add:

| Name | Value |
| --- | --- |
| `MTN_COLLECTION_SUBSCRIPTION_KEY` | Collections product subscription key from the MTN Developer Portal |
| `MTN_API_USER` | Sandbox API User UUID generated through MTN sandbox provisioning |
| `MTN_API_KEY` | API Key belonging to that sandbox API User |
| `MTN_TARGET_ENVIRONMENT` | `sandbox` |
| `MTN_LIVE_ENABLED` | `false` |

Optional sandbox override:

| Name | Value |
| --- | --- |
| `MTN_BASE_URL` | `https://sandbox.momodeveloper.mtn.com` |

The sandbox code uses EUR and submits a fixed 1 EUR test request to MTN. The RWF amount chosen in Amamaza is retained as test-only ledger credit. This is deliberately not an exchange-rate conversion and is not real money.

Do not reuse credentials from another project or environment. Never place MTN credentials in browser code, GitHub, Vercel public variables, screenshots, email, or chat. Enter them directly into Supabase Edge Function Secrets.

## Sandbox test procedure

1. Subscribe to the **Collections** product in the MTN Rwanda Developer Portal and copy its subscription key.
2. Use the MTN sandbox provisioning collection to create a fresh API User and API Key for Amamaza.
3. Add the sandbox secrets above in Supabase.
4. Sign in to Amamaza and open `/app/wallet`.
5. Enter a Rwanda MTN number accepted by the sandbox, choose a test top-up amount, and start the payment.
6. Approve the sandbox prompt if MTN issues one.
7. Select **Check payment**. A successful status is verified with MTN's GET request-to-pay endpoint before the sandbox balance is credited.
8. Confirm that the test amount appears under **Sandbox test balance**, not the real wallet balance.

A `202 Accepted` response means MTN accepted the request for processing; it does not mean the payment is successful. Keep checking until MTN returns a final status. The sandbox callback is intentionally not configured: MTN's Rwanda documentation specifies HTTP callback behavior for sandbox, while this integration uses secure status polling.

## Both payment routes

- Wallet top-up: fixed allowed amounts are validated on the server (RWF 5,000 / 10,000 / 25,000 / 50,000).
- Direct ad order: the server calculates the order price from the current Amamaza service pricing; it never trusts a client-supplied amount.
- Wallet payment for an ad order: the database locks the wallet/order rows, checks the relevant balance, and records the debit atomically.
- The order-payment backend helper is exported as `createMomoAdOrder()`. The current ad-creation route is still an introductory placeholder, so the final ad-builder checkout UI and fulfillment workflow must be connected before accepting paid ad orders from customers.

## Production go-live checklist

Do not enable live payments until MTN has approved Amamaza, the contract is signed, and production credentials are issued.

1. Confirm with MTN Rwanda the production Collections base URL, country target environment, currency, merchant category, transaction limits, settlement account, fees, refund/reversal process, and callback requirements. Do not infer the production base URL from generic MTN examples.
2. Generate production API User and API Key in the MTN Partner Portal and obtain the production Collections subscription key.
3. Register the callback host `kuuvfikaupbsdhdhpcrm.supabase.co` with MTN if MTN accepts the Supabase function host. The callback function accepts both PUT and POST and verifies the final status against MTN before updating the database.
4. Add production secrets in Supabase:
   - `MTN_COLLECTION_SUBSCRIPTION_KEY`
   - `MTN_API_USER`
   - `MTN_API_KEY`
   - `MTN_TARGET_ENVIRONMENT=mtnrwanda` (confirm this exact value with MTN Rwanda)
   - `MTN_CURRENCY=RWF`
   - `MTN_BASE_URL` (exact production URL supplied by MTN Rwanda)
   - `MTN_CALLBACK_URL=https://kuuvfikaupbsdhdhpcrm.supabase.co/functions/v1/momo-callback`
   - `MTN_LIVE_ENABLED=true` only after approval and production credential verification.
5. Run controlled low-value production tests with MTN's supervision. Confirm settlement and reconciliation against the merchant statement.
6. Obtain written confirmation from MTN and, where appropriate, the National Bank of Rwanda before enabling a stored-value/prepaid wallet for customers. Until that is resolved, prefer direct pay-per-order in production.

## Operational safeguards

- The browser never receives MTN credentials or Supabase service-role credentials.
- The public payment function requires a valid Supabase user JWT.
- A customer can only check a payment belonging to their own user ID.
- Payment amounts and service prices are calculated server-side.
- Sandbox money cannot enter the real wallet.
- The callback endpoint is not itself proof of payment; it performs an authenticated server-to-server MTN status lookup.
- If MTN does not send a callback, the status endpoint can reconcile pending transactions.
- Review Supabase Security Advisor and database backups regularly.
