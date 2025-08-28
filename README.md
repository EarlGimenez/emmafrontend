## EMMA Frontend (mobile-first) 🚑📱

This repository is the mobile-first frontend for E.M.M.A., built primarily with Expo and React Native for Android and iOS devices. The app is designed for field use during emergency response and social assistance: quick household registration, multi-path verification of vulnerable members, household scanning, location-aware request/donation workflows, and volunteer coordination.

A lightweight Next.js wrapper exists to support a web entry (`app/page.tsx`), but the app is designed and optimized for mobile devices — offline support patterns, camera/QR utilities, GPS/location tracking, and touch-first navigation are prioritized.

### Mobile-first notes ⚙️

- Primary target platforms: Android and iOS via Expo (managed workflow).
- Mobile-specific features: camera & QR scanning, background location tracking, offline/local storage (AsyncStorage), and deep integration with device sharing and filesystem APIs.
- Navigation and UX are built for mobile: Stack and Drawer navigators, large-touch targets, and step-by-step registration flows.
- The Next.js/web entrypoint is for convenience and web previews; production usage should assume mobile as the primary platform.

## Quick summary 🔎

- Primary frameworks: React Native (Expo) + React Navigation. A Next.js `app/` entry is present and proxies to the React Native `App` for web.
- Language: TypeScript + React.
- Styling: Tailwind + custom CSS and design system components (Radix UI primitives used for some UI elements on web).
- State & utilities: Axios for HTTP, AsyncStorage for local storage, date-fns, zod for validation.

## Key features ✨


- Multi-path registration & verification: the app contains many specialized verification screens (PWD, senior, parental consent, parent verification, OTP and verification success) and account setup flows culminating in account success and final reminders.
- Household management: household scanning, household info entry, family lookup, create family, track family, and a dedicated "My Family" area.
- Volunteer workflows: onboarding, background checks, experience capture, and volunteer application submission screens.
- Requests & donations: create and process requests, view personal requests, and a donate screen.
- Location & emergency features: evacuation center lookup and details, location details entry, and maps/location tracking utilities.
- Auth and onboarding UX: Loading and Login screens handle authentication and redirection into the main app (Drawer + Stack navigation).

## Repository structure (high level) 🗂️

- `App.tsx` - main React Native app entry using React Navigation (Stack + Drawer). Navigation links to all primary screens.
- `app/` - Next.js App Router files. `app/page.tsx` returns the native `App` component for web.
- `screens/` - grouped screens for registration, main app flows, requests, volunteer flows, etc.
	- See "Screens overview" below for a complete list of screens and flows.
- `components/` - shared UI components, theme providers, custom drawer content, and small hooks.
- `components/ui/` - reusable UI primitives (buttons, inputs, dialogs, toasts, etc.).
- `assets/`, `public/` - images, fonts and static assets.
- `config/`, `lib/`, `utils/`, `hooks/` - API client, helpers, and utilities.

## Tech stack & notable deps 🧰

- Expo (managed) + React Native
- React Navigation (stack + drawer)
- Next.js (web entry)
- Tailwind CSS + tailwindcss-animate
- Radix UI packages (web primitives)
- Axios, date-fns, zod, react-hook-form

See `package.json` for the full dependency list.

## Prerequisites ✅

- Node.js (recommended >= 18)
- pnpm (recommended) or npm/yarn
- Expo CLI (optional globally) if you prefer `expo` commands directly: `npm install -g expo-cli` or use `npx expo` / `pnpm dlx expo`.

## Install 🛠️

Open a terminal in the project root and run (choose pnpm or npm):

PowerShell / Windows example:

```powershell
pnpm install
# or
npm install
```

## Run (development) ▶️

Use the scripts in `package.json`. Typical flows:

PowerShell:

```powershell
# Start Expo dev tools (choose device: Android/iOS/web)
pnpm start

# Start and open directly on Android emulator/device
pnpm android

# Start and open directly for iOS (macOS only)
pnpm ios

# Start web (uses Expo for web)
pnpm web
```

Notes:
- The repository uses Expo as the primary start command. The `app/` Next.js files are set up so the Next entrypoint imports and renders the `App` component — this makes it possible to run a web build that leverages the same React components.
- If you want to build a production web bundle with Next.js, inspect `next.config.mjs` and adapt scripts; this project currently uses Expo-first scripts in `package.json`.

## Running lint 🧹

```powershell
pnpm lint
# or
npm run lint
```

## Useful files 📁

- `App.tsx` — navigation structure and app bootstrap.
- `app/page.tsx` — Next.js page that renders the native `App` for web.
- `config/api.ts` — API client and endpoint config.
- `utils/locationTracking.ts` — location background tracking helpers.

## Development notes & tips 💡

- The navigation structure is implemented with a main Stack navigator and a nested Drawer (`MainAppDrawer`) that contains `Home` and other drawer-accessible screens.
- Registration is a long linear flow: many screens live under `screens/registration` and are registered as Stack screens in `App.tsx`.
- Many components are shared between web and native; platform-specific hooks live under `components/` (for example `useClientOnlyValue.*`).
- Tailwind and Radix primitives are used for UI consistency; check `components/ui/` for patterns to reuse.

## Contributing 🤝

- Open an issue to discuss larger changes.
- Create feature branches from `master` and open pull requests with a short description and testing notes.

## License 📄

No license file provided in the repository. Add a `LICENSE` file if you wish to open-source this project.

---

## Expected output 📱

When the mobile app runs on a device you should expect the following outcomes:

- ✅ Guided, step-by-step registration with OTP and specialized verification flows (PWD, senior, parental consent).
- 🏠 Household and family workflows: scan or enter household data, create or lookup a family, then view and manage "My Family" and tracking details.
- 🆘 Requests & donations: submit requests, follow processing flows, and view your requests history; donors and coordinators can review incoming requests.
- 🧭 Location-aware behavior: view evacuation centers and details, share location, and (with permission) run background location tracking for monitoring.
- 👥 Volunteer flows: register, provide experience/background info, and submit applications which can be confirmed in-app.

These are the intended user-facing behaviors when the app is used on Android or iOS via Expo.

## Screens overview 📋

This project contains the following screens grouped by feature area (listed by filename):

- Root/entry
	- `LoadingScreen.tsx` — initial auth/loading checks and redirects.
	- `LoginScreen.tsx` — user login flow.

- Main app (`screens/main`)
	- `LandingScreen.tsx` — initial landing or dashboard entry.
	- `HomeScreen.tsx` — primary home view inside the Drawer.
	- `CheckFamilyScreen.tsx` — lookup and check existing family records.
	- `CreateFamilyScreen.tsx` — create a new family/household.
	- `MyFamilyScreen.tsx` — details and management for the user's family.
	- `TrackFamilyScreen.tsx` — tracking and status view for a family/household.
	- `DonateScreen.tsx` — donation UI / donation-related interactions.
	- `ProfileScreen.tsx` / `ProfileUpdateScreen.tsx` — user profile and profile update.
	- `TrainingsScreen.tsx` — trainings and resources for volunteers/users.

- Registration (`screens/registration`)
	- `DataPrivacyScreen.tsx` — data privacy and consent information.
	- `AccountTypeScreen.tsx` — choose account type (user/volunteer/etc.).
	- `BasicInfoScreen.tsx`, `AdditionalInfoScreen.tsx` — capture user details.
	- `ChildInfoScreen.tsx`, `ParentInfoScreen.tsx` — household member specifics.
	- `ParentalConsentScreen.tsx`, `ParentVerificationScreen.tsx` — parental flows.
	- `PWDVerificationScreen.tsx`, `SeniorVerificationScreen.tsx`, `GeneralVerificationScreen.tsx` — specialized verification flows.
	- `OTPScreen.tsx` — OTP verification screen.
	- `VerificationSuccessScreen.tsx`, `AccountSuccessScreen.tsx` — success confirmations.
	- `HouseholdScanScreen.tsx`, `HouseholdInfoScreen.tsx` — scan & enter household data.
	- `LocationDetailsScreen.tsx`, `EvacuationCenterScreen.tsx`, `EvacuationDetailsScreen.tsx` — location and evacuation center screens.
	- `AccountSetupScreen.tsx`, `FinalRemindersScreen.tsx` — final setup and reminders.

- Requests (`screens/requests`)
	- `RequestEntryScreen.tsx` — create/submit a new assistance request.
	- `RequestProcessScreen.tsx` — workflow for processing a request.
	- `MyRequestsScreen.tsx` — list and manage user requests.

- Volunteer (`screens/volunteer`)
	- `DataPrivacyConsentScreen.tsx` — volunteer-specific consent flow.
	- `VolunteerExperienceScreen.tsx` — capture volunteer experience details.
	- `VolunteerBackgroundCheckScreen.tsx` — background-check workflow.
	- `VolunteerApplicationSubmittedScreen.tsx` — post-submission confirmation.