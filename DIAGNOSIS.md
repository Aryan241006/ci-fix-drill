# CI Failure Diagnosis

## 1. Discount assertion (Type 1: assertion)

- **Step:** `Run tests` (reproduced locally with `npx jest --runInBand`)
- **Exact failure:** `Expected: 100` / `Received: 90`
- **Cause:** `calculateDiscount(100, 10)` correctly returns 90. The test expected the original price, so the assertion was wrong. The test now expects 90.

## 2. Currency object matcher (Type 1: assertion)

- **Step:** `Run tests` (reproduced locally with `npx jest --runInBand`)
- **Exact failure:** `expect(received).toBe(expected) // Object.is equality` and `Received: serializes to the same string`
- **Cause:** `formatCurrency` returns a new object with the expected fields. `toBe` checks object identity, so this assertion must use `toEqual` for deep value equality.

## 3. Dependency lockfile mismatch (Type 2: dependency)

- **Step:** `Install dependencies`
- **Exact failure:** ``npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.``, followed by `Missing: lodash@4.18.1 from lock file`
- **Cause:** `package.json` declares lodash but the committed lockfile did not include it. `npm install` regenerated the lockfile, and the workflow now uses `npm ci` for reproducible installs.

## 4. Test job sequencing and runner setup (Type 3: config)

- **Step:** `Run tests`
- **Exact failure indicated by workflow configuration:** the `test` job had no `needs` dependency on `install`, no checkout step, and no dependency install. GitHub jobs use separate fresh runners, so the test job could start in parallel and had no repository checkout or `node_modules`.
- **Cause:** the job graph did not sequence installation before testing, and steps from one job do not carry over to another. The test job now declares `needs: install`, checks out the repository, configures Node 18, and runs `npm ci` itself.

## 5. Lint configuration (Type 3: config)

- **Step:** `Lint` (reproduced locally with `npm run lint`)
- **Exact failure:** `ESLint couldn't find a configuration file.`
- **Cause:** the repository had a lint script but no ESLint config. Added `.eslintrc.json` with Node and Jest environments and ESLint's recommended rules.

## GitHub Actions log availability

The fork's Actions API returned no registered workflows or runs after the initial branch push, so no GitHub-hosted failure log was available to quote. The exact assertion, install, and lint messages above come from local reproductions against the checked-in starting revision. The workflow sequencing diagnosis is based on the original `ci.yml` job definitions.
