# Comprehensive Setup & Integration Guide: Supabase + Clerk Multi-Tenancy

Welcome to the **el_Moultaqa** multi-tenant setup guide. This document provides step-by-step instructions to configure your Supabase backend, set up Clerk authentication with custom claims, configure the Clerk-to-Supabase webhook, and initialize environment variables across all three React applications (`webapp`, `admin`, and `Landing`).

---

## 🛠️ Section 1: Supabase Project Setup & Database Migrations

### 1. Create a New Supabase Project
1. Open your browser and navigate to [Supabase](https://supabase.com).
2. Click **Start your project** and sign in using your GitHub account (recommended) or email.
3. Click **New Project** and select your organization.
4. Fill in the project details:
   - **Name**: `el-moultaqa`
   - **Database Password**: Generate a strong password and **save it securely** (you will need it for CLI linking).
   - **Region**: Choose the region closest to your primary target audience (e.g., `eu-west-3` / Paris or `eu-central-1` / Frankfurt is recommended for Algeria/North Africa).
   - **Pricing Plan**: Choose **Free** (or your preferred tier).
5. Click **Create new project** and wait for provisioning to complete (takes about 2 minutes).

### 2. Copy API Keys and Secrets
Once the project is provisioned, navigate to **Project Settings** (gear icon on the left sidebar) → **API**:
* 📋 **Project URL**: Under *Project API keys*, copy the URL. This will be your `VITE_SUPABASE_URL`.
* 📋 **anon / public key**: Copy this key. This will be your `VITE_SUPABASE_ANON_KEY`.
* 🔒 **service_role / secret key**: Copy this key. This is your `SUPABASE_SERVICE_ROLE_KEY`.

> [!WARNING]
> The `service_role` key has superuser access and **bypasses all Row Level Security (RLS) policies**. Never expose this key in your client-side environment variables (`.env.local`) or commit it to Git. It should only reside in your server-side Supabase Edge Functions environment.

### 3. Run Database Migrations
We will run the 4 SQL migrations in chronological order to build the schema:

1. Click on the **SQL Editor** icon (the terminal `>_` icon on the left sidebar).
2. Click **New Query**.
3. Open the migration files located in your local project directory at `supabase/migrations/` and copy-paste their contents one by one:
   * **First**: Copy [001_public_schema.sql](file:///c:/Users/EnigmaticWhisper/Projects/Startup/el_Moultaqa/supabase/migrations/001_public_schema.sql) and paste it into the editor. Click **Run**.
   * **Second**: Copy [002_org_schema_template.sql](file:///c:/Users/EnigmaticWhisper/Projects/Startup/el_Moultaqa/supabase/migrations/002_org_schema_template.sql) and paste it into the editor. Click **Run**.
   * **Third**: Copy [003_rls_policies.sql](file:///c:/Users/EnigmaticWhisper/Projects/Startup/el_Moultaqa/supabase/migrations/003_rls_policies.sql) and paste it into the editor. Click **Run**.
   * **Fourth**: Copy [004_internal_helpers.sql](file:///c:/Users/EnigmaticWhisper/Projects/Startup/el_Moultaqa/supabase/migrations/004_internal_helpers.sql) and paste it into the editor. Click **Run**.

4. *Verification*: 
   * Navigate to the **Table Editor** (grid icon on the left sidebar).
   * Confirm that in the `public` schema, you see the `organizations`, `plans`, and `subscriptions` tables.
   * Click on the `plans` table; you should see 3 seed rows populated: `free`, `pro`, and `enterprise` with DZD pricing.

---

## 🔐 Section 2: Clerk Application, JWT Template, & Webhooks

### 1. Create a Clerk Project
1. Open your browser and navigate to [Clerk](https://clerk.com).
2. Sign up or log in to your developer account.
3. Click **Create application**.
4. Configure your application:
   - **Name**: `El Moultaqa`
   - **Authentication Profiles**: Select **Email** and **Google** (you can add GitHub or other social logins later).
5. Click **Create application**.
6. On the Clerk Dashboard, copy your keys from the **API Keys** section:
   - 📋 **Publishable Key**: This will be your `VITE_CLERK_PUBLISHABLE_KEY`.
   - 🔒 **Secret Key**: This will be your `CLERK_SECRET_KEY` (used for backend integrations).

### 2. Configure Clerk JWT Template for Supabase
To let Supabase authorize queries using Clerk session tokens, you must configure a JWT Template that mimics a Supabase authentication token:

1. In the Clerk Dashboard sidebar, navigate to **JWT Templates**.
2. Click **New template** and select **Supabase** from the pre-built integrations list.
3. Set the configuration details:
   - **Name**: `supabase` (⚠️ **MUST** be exactly this lowercase name; the client-side code requests this template specifically).
   - **Signing Algorithm**: `HS256`
   - **Signing Key**: Paste your **Supabase JWT Secret** here.
     * *Where to find it*: Go to Supabase → **Project Settings** → **API** → Scroll down to **JWT Settings** → **JWT Secret** (click *Reveal* to copy it).
4. Verify the claims in the JSON editor contain the critical `org_id` and `sub` variables:
    ```json
    {
      "aud": "authenticated",
      "role": "authenticated",
      "email": "{{user.primary_email_address}}",
      "org_id": "{{org.id}}",
      "app_metadata": {
        "provider": "clerk",
        "providers": ["clerk"]
      },
      "user_metadata": {
        "avatar_url": "{{user.image_url}}",
        "full_name": "{{user.full_name}}"
      }
    }
    ```
5. Click **Save**.

> [!IMPORTANT]
> The custom `org_id` claim in this JWT is the key to multi-tenancy. When an organization admin logs in, Clerk includes their active `org_id` in the token. Supabase reads this claim via `auth.jwt() ->> 'org_id'` to isolate queries to that organization's specific Postgres schema.

### 3. Deploy the Supabase Clerk Webhook Edge Function
The webhook function listens for Clerk organization creations and deletions to automatically provision isolated database schemas.

1. Open your terminal in the root of your project: `c:\Users\EnigmaticWhisper\Projects\Startup\el_Moultaqa`.
2. Make sure you have the Supabase CLI installed globally. If not, install it:
   ```bash
   npm install -g supabase
   ```
3. Log in to your Supabase CLI account:
   ```bash
   supabase login
   ```
4. Link your local project to your hosted Supabase project:
   ```bash
   supabase link --project-ref YOUR-SUPABASE-PROJECT-REF
   ```
   *(Note: `YOUR-SUPABASE-PROJECT-REF` is the sub-domain string in your project URL, e.g., `https://abcdefghijkl.supabase.co` → reference is `abcdefghijkl`)*
5. Configure the hosted Supabase Edge Function secrets so they are available at runtime:
   ```bash
   supabase secrets set SUPABASE_URL=https://YOUR-SUPABASE-PROJECT-REF.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   supabase secrets set CLERK_WEBHOOK_SIGNING_SECRET=whsec_placeholder-for-now
   ```
6. Deploy the Edge Function:
   ```bash
   supabase functions deploy clerk-webhook
   ```

### 4. Create the Clerk Webhook Endpoint
1. Go back to your **Clerk Dashboard** and click **Webhooks** in the left sidebar.
2. Click **Add Endpoint**.
3. In the **Endpoint URL** field, enter your deployed Edge Function URL:
   `https://YOUR-SUPABASE-PROJECT-REF.supabase.co/functions/v1/clerk-webhook`
4. Under **Message Filtering**, select **Subscribe to events** and check:
   - `organization.created`
   - `organization.deleted`
5. Click **Create**.
6. After creation, copy the **Signing Secret** (starts with `whsec_`).
7. Update your Supabase secrets in the terminal with the real signing secret so that the webhook signature can be validated:
   ```bash
   supabase secrets set CLERK_WEBHOOK_SIGNING_SECRET=whsec_your-actual-signing-secret
   ```

---

## 🔑 Section 3: Client Applications Environment Setup

### 1. Copy Environment Variable Template
We need to set up `.env.local` files in each of our three React applications. Since all apps are built using Vite, they require environment variables prefixed with `VITE_`.

Run the following commands in your PowerShell/Command Prompt from the project root:
```powershell
copy .env.example webapp\.env.local
copy .env.example admin\.env.local
copy .env.example Landing\.env.local
```

### 2. Populate Variables
Open each `.env.local` file and fill in your actual values copied from Supabase and Clerk dashboards:

```env
# ============================================================================
# el_Moultaqa — Local Environment Variables
# ============================================================================

# Supabase Configurations (Client-side, safe to expose)
VITE_SUPABASE_URL=https://YOUR-SUPABASE-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)

# Clerk Configurations (Client-side, safe to expose)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... (your publishable key)
```

> [!TIP]
> Keep the environment variables identical across `webapp/.env.local`, `admin/.env.local`, and `Landing/.env.local` to ensure a consistent connection.

---

## 🎯 Verification & Testing Flow

After completing the steps above, you can verify your installation:

1. Open your terminal in the `webapp`, `admin`, or `Landing` directory.
2. Install npm dependencies if you haven't already:
   ```bash
   npm install
   ```
3. Launch the development servers:
   ```bash
   npm run dev
   ```
4. Verify there are no console errors or environment crashes.
5. Create a new Organization in Clerk (e.g. via Clerk dashboard or your auth page):
   * Inspect the Supabase Edge Function logs (**Edge Functions** → **clerk-webhook** → **Logs**).
   * Verify that you see a successfully handled `organization.created` event.
   * Go to **Table Editor** → `organizations` table. A new row should be present mapping your Clerk Org ID to a custom schema name (e.g., `org_clerkorgid`).
   * Run a SQL query `SELECT schema_name FROM information_schema.schemata;` and verify that a schema named after your organization has been dynamically provisioned with all 5 isolate tables!

You are now fully configured and ready to build!
