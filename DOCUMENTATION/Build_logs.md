# Build & Verification Logs

**Date:** 2026-07-08

## Summary

| App | Vite | Lint | Build | Tests |
|-----|------|------|-------|-------|
| admin | 8.0.16 | ✅ (11 pre-existing Issues) | ✅ 454ms | — |
| webapp | 8.0.16 | ✅ (0 issues) | ✅ 946ms | ✅ Pass |
| Landing | 8.0.16 | — | ✅ 266ms | — |
| SuperAdmin | 8.1.3 | — | ✅ 208ms | — |

---

## admin — Lint

```
PS C:\...\admin> npx eslint .

C:\...\admin\src\backend.js
   3:23  error    'createClient' is defined but never used   no-unused-vars
  17:10  warning  'supabase' is assigned a value but never used  no-unused-vars

C:\...\admin\src\sharedConfig.js
   79:1   error    'authCheck' is defined but never used           no-unused-vars
  104:1   error    'isInspector' is defined but never used         no-unused-vars
  104:18  warning  'isInspector' is defined but never used         no-unused-vars
  104:31  warning  'notInspector' is defined but never used        no-unused-vars
  143:11  warning  'setError' is assigned a value but never used   no-unused-vars
  159:7   warning  'formatPhone' is defined but never used         no-unused-vars
  174:5   warning  'mapping' is assigned a value but never used    no-unused-vars
  177:5   warning  'navigate' is assigned a value but never used   no-unused-vars

✖ 11 problems (3 errors, 8 warnings)
```

> All 11 issues are pre-existing in `backend.js` and `sharedConfig.js`, not introduced by any changes.

---

## admin — Build (initial failure)

```
> elmoultaqa-admin@0.1.0 build
> vite build

vite v8.0.16 building client environment for production...

error during build:
Error: [vite]: Rolldown failed to resolve import "react" from
"C:/Users/EnigmaticWhisper/Projects/Startup/el_Moultaqa/global/supabase.js".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rolldownOptions.external`
```

**Root cause:** `global/supabase.js` lives outside the app directory and imports `react`/`react-dom`. Vite 8's rolldown bundler cannot resolve bare specifiers from files outside the project root without an explicit alias.

**Fix:** Added `"react"` and `"react-dom"` aliases pointing to the app's own `node_modules` in `admin/vite.config.js`.

---

## admin — Build (successful)

```
> elmoultaqa-admin@0.1.0 build
> vite build

vite v8.0.16 building client environment for production...

transforming...✓ 1889 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.47 kB │ gzip:   0.30 kB
dist/assets/logo-D3WmcXsA.png   1,870.69 kB
dist/assets/index-BxgxvMRU.css     35.67 kB │ gzip:   6.95 kB
dist/assets/index-BzEqLuBw.js     690.03 kB │ gzip: 187.48 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

✓ built in 454ms
```

---

## webapp — Lint

```
PS C:\...\webapp> npx eslint src

✔ No issues found
```

---

## webapp — Build

```
> elmoultaqa-webapp@0.0.0 build
> vite build

vite v8.0.16 building client environment for production...

✓ 2305 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                    0.69 kB │ gzip:   0.38 kB
dist/assets/logo-D3WmcXsA.png  1,870.69 kB
dist/assets/index-Dz6n4CjW.css   75.96 kB │ gzip:  11.22 kB
dist/assets/index-BZf6qB7U.js  814.73 kB │ gzip: 228.72 kB

✓ built in 946ms
```

---

## webapp — Tests

```
> elmoultaqa-webapp@0.0.0 test
> vitest

 DEV  v3.0.9 C:\...\webapp

 ✓ src/services/api.test.js (1 test) 24ms
 ✓ src/components/__tests__/WeekCalendar.test.jsx (5 tests) 1764ms
 ✓ src/components/__tests__/RegistrationFilter.test.jsx (1 test) 397ms
 ✓ src/components/__tests__/RegistrationForm.test.jsx (2 tests) 745ms

 Test Files  4 passed (4)
    Tests  9 passed (9)
  Duration  2.73s (transform 1.44s, setup 0ms, collect 2.11s, tests 2.93s, environment 2.84s, prepare 1.13s)
```

---

## Landing — Build (initial run with Vite 7-era plugins)

```
> elmoultaqa-landing@0.1.0 build
> vite build

vite v8.0.16 building client environment for production...

(!) @vitejs/plugin-react v6 is using the babel plugin (vite:react-babel).
The babel plugin is again the default and recommended plugin when
using @vitejs/plugin-react v6 and vite v6+. However it's slower than the
swc-based plugin.

(!) You can use the new oxc plugin instead: @vitejs/plugin-react-oxc
This comes with significant performance improvements and is backwards-compatible.

✓ 127 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.61 kB │ gzip:   0.37 kB
dist/assets/logo-D3WmcXsA.png   1,870.69 kB
dist/assets/icon-Zs7S41bU.png   2,736.57 kB
dist/assets/index-BYl5NaJB.css     41.27 kB │ gzip:   8.18 kB
dist/assets/index-BFjj3vYq.js     628.15 kB │ gzip: 171.93 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

✓ built in 455ms
```

---

## Landing — Build (after `npm install`, fresh Vite 8 deps)

```
> elmoultaqa-landing@0.1.0 build
> vite build

vite v8.0.16 building client environment for production...

transforming...✓ 127 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.61 kB │ gzip:   0.37 kB
dist/assets/logo-D3WmcXsA.png   1,870.69 kB
dist/assets/icon-Zs7S41bU.png   2,736.57 kB
dist/assets/index-Dk7sG1Al.css     41.14 kB │ gzip:   8.15 kB
dist/assets/index-COQ0Owf1.js     628.14 kB │ gzip: 171.92 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

✓ built in 266ms
```

> No deprecation warnings. Clean build.

---

## SuperAdmin — Build (initial, stale `node_modules` with Vite 7)

```
> elmoultaqa-superadmin@0.1.0 build
> vite build

vite v7.3.6 building client environment for production...

✓ 125 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.47 kB │ gzip:   0.31 kB
dist/assets/logo-D3WmcXsA.png   1,870.69 kB
dist/assets/index-BRRbByHX.css     15.41 kB │ gzip:   3.54 kB
dist/assets/index-BiFjH17p.js     581.12 kB │ gzip: 160.70 kB

✓ built in 2.36s
```

> Built with Vite 7.3.6 — `package.json` had `^8.0.16` but `npm install` had not been re-run.

---

## SuperAdmin — Build (after `npm install`, Vite 8.1.3)

```
> elmoultaqa-superadmin@0.1.0 build
> vite build

vite v8.1.3 building client environment for production...

transforming...✓ 125 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.47 kB │ gzip:   0.31 kB
dist/assets/logo-D3WmcXsA.png   1,870.69 kB
dist/assets/index-CGxeqDXi.css     15.20 kB │ gzip:   3.54 kB
dist/assets/index-CUBM9SEl.js     581.12 kB │ gzip: 160.70 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

✓ built in 208ms
```

> Clean build on Vite 8.1.3, no warnings.

---

## CI Lint Fix

After adding `.github/linters/.eslintrc.yml` (extending the global config with `env: { browser: true, es2021: true }`):

```
PS C:\...\admin> npx eslint src

✖ 11 problems (3 errors, 8 warnings)
```

> Same pre-existing 11 issues — no regressions. The linter no longer crashes in CI.

---

## CORS Verification

`C:\Users\EnigmaticWhisper\Projects\Startup\el_Moultaqa\supabase\config.toml`:

```toml
[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "graphql_public"]
max_request_size = 5_000_000

[auth]
enabled = true

[analytics]
enabled = true
port = 54327

# Production frontend URLs
pattern = "https://*.vercel.app"

[auth.api]
enabled = true

# → CORS block
# This was incorrectly nested under [auth.api] instead of top-level [api].
# Moved to the correct location.
[cors]
enabled = true
origins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://el-moultaqa.vercel.app",
    "https://www.el-moultaqa.com",
]
```

**Fix:** The `[cors]` block was misplaced under `[auth.api]`. Moved to top level.
