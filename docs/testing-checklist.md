# Aircraft Program Platform Testing Checklist

Use this as the master QA checklist before sending a build to the client or pushing a production release.

For each item, record:

- Status: Pass / Fail / Blocked / Not built yet
- Device: Desktop / Mobile / Tablet
- Browser: Chrome / Safari / Edge
- Notes: What happened, screenshots, and exact URL

## 1. Pre-Test Setup

- [ ] Confirm the latest code is deployed or running locally.
- [ ] Confirm database migrations have been applied.
- [ ] Confirm Stripe test keys are set in the target environment.
- [ ] Confirm Stripe webhook endpoint is configured.
- [ ] Confirm Resend API key is set.
- [ ] Confirm `RESEND_FROM` is set to a verified sender or Resend test sender.
- [ ] Confirm admin notification email variable is set.
- [ ] Confirm file upload/storage works in the target environment.
- [ ] Confirm test accounts are available for subscriber, admin, and supplier.
- [ ] Confirm seed/test data includes at least one active aircraft, one pending aircraft, one AOG case, one supplier, and one quote.

## 2. Public Marketing Site

- [ ] Homepage loads without console or server errors.
- [ ] Homepage hero image is sharp and positioned well on desktop.
- [ ] Homepage hero image is sharp and positioned well on mobile.
- [ ] Hero copy clearly explains Aircraft Program is an enrolment program for aircraft owners and operators.
- [ ] Primary CTA `Enrol Aircraft` opens the correct enrolment/sign-up flow.
- [ ] Secondary CTA `See how it works` opens the correct page/section.
- [ ] Icons under the hero display at the intended size and do not overlap.
- [ ] Homepage AMO relationship section is present and readable.
- [ ] Fee/incentive explanation is clear and does not imply zero markup.
- [ ] No outdated `PlaneServe`, `PSP`, `programme`, `pillar 1`, or `pillar 2` wording appears in visible copy unless intentionally retained as logo/legal text.
- [ ] About page loads.
- [ ] About page imagery displays correctly.
- [ ] How It Works page loads.
- [ ] How It Works page avoids “zero markup” messaging.
- [ ] Services / What’s Included page loads.
- [ ] Services page uses service-led section labels, not `Pillar 01` / `Pillar 02`.
- [ ] Pricing page loads.
- [ ] Pricing copy mentions per-aircraft pricing and sourcing fee clearly.
- [ ] Contact page loads.
- [ ] Contact page uses a different hero image from the homepage.
- [ ] Contact form fields display correctly.
- [ ] Contact form submission either sends/stores a message or shows a clear not-yet-built state.
- [ ] Footer displays `Desk active · 24/7 controller cover`.
- [ ] Footer has Shro Web credit/link.
- [ ] All public nav links work on desktop.
- [ ] Mobile menu opens, closes, and every link works.
- [ ] Brand/logo/favicon are consistent across public pages.

## 3. Authentication Journey

- [ ] Login page loads.
- [ ] Login page has the correct brand/logo.
- [ ] Login page image is correct and not blurry.
- [ ] Sign-up page loads.
- [ ] New user can create an account with required fields.
- [ ] Sign-up explains what happens next.
- [ ] Sign-up success state confirms account creation.
- [ ] Sign-up success state prompts user to log in or continue.
- [ ] Welcome email is sent after account creation.
- [ ] Welcome email arrives in Resend logs.
- [ ] Welcome email arrives in recipient inbox or test inbox.
- [ ] Login succeeds with a valid subscriber account.
- [ ] Login fails gracefully with invalid credentials.
- [ ] Forgot password sends reset email.
- [ ] Reset password link opens the set-password page.
- [ ] Set-password page accepts a valid new password.
- [ ] User can log in with the new password.
- [ ] Sign out works from subscriber portal.
- [ ] Sign out works from admin portal.
- [ ] Sign out works from supplier portal.
- [ ] Protected pages redirect unauthenticated users to login/create account.
- [ ] Authenticated users are routed to the right dashboard for their role.

## 4. Enrolment Journey

- [ ] Unauthenticated visitor clicking `Enrol Aircraft` is prompted to log in or create an account.
- [ ] Authenticated user clicking `Enrol Aircraft` enters the enrolment flow.
- [ ] Existing user adding another aircraft does not have to re-enter account details unnecessarily.
- [ ] Step 1 usage type works.
- [ ] Step 2 user/contact details validates required fields.
- [ ] Step 3 aircraft fields validates required fields.
- [ ] Aircraft categories include Jet, Turboprop, Helicopter, Single Engine, and Multi Engine where required.
- [ ] Turboprop enrolment shows propeller manufacturer/type fields.
- [ ] Turboprop enrolment shows propeller serial number field.
- [ ] Single Engine enrolment shows propeller manufacturer/type fields.
- [ ] Single Engine enrolment shows propeller serial number field.
- [ ] Multi Engine enrolment shows propeller manufacturer/type fields.
- [ ] Multi Engine enrolment shows propeller serial number field.
- [ ] Jet enrolment does not show irrelevant propeller fields.
- [ ] Helicopter enrolment does not show irrelevant fixed-wing propeller fields unless required.
- [ ] Aircraft registration format validation works.
- [ ] Base airport / ICAO field is present.
- [ ] Engine details can be entered.
- [ ] Nationality field is removed where not needed.
- [ ] Registry standard remains if still required.
- [ ] Contacts step captures PIC, AMO, emergency, and maintenance contacts.
- [ ] Optional document upload works during/after enrolment.
- [ ] Review step displays entered details correctly.
- [ ] Stripe checkout/payment starts only once per submit.
- [ ] Submit button disables while Stripe/enrolment action is processing.
- [ ] Browser refresh/back does not create duplicate Stripe subscriptions.
- [ ] Successful checkout returns to the app.
- [ ] New aircraft appears in `My Aircraft`.
- [ ] Dashboard shows `Cover activation pending` until admin verifies.
- [ ] Subscriber receives aircraft enrolment email.
- [ ] Admin receives new aircraft/admin review email.

## 5. Stripe / Billing

- [ ] Stripe checkout session creates correctly for monthly cover.
- [ ] Stripe checkout session creates correctly for annual cover if enabled.
- [ ] Duplicate subscriptions are not created by double-clicking submit.
- [ ] Stripe webhook receives checkout completed event.
- [ ] Stripe webhook updates subscription status in the database.
- [ ] Billing page shows active subscription.
- [ ] Billing page shows invoice/payment history.
- [ ] Billing page handles empty state clearly.
- [ ] Failed/past-due payments display clearly.
- [ ] Admin revenue page shows MRR accurately.
- [ ] Admin revenue page shows active subscriptions accurately.
- [ ] Admin revenue page can download/export revenue performance if built.
- [ ] Invoice links/downloads work if built.

## 6. Subscriber Dashboard

- [ ] Dashboard loads for subscriber.
- [ ] Dashboard does not get stuck on `Loading...`.
- [ ] Empty state with no aircraft is clear.
- [ ] Empty state prompts user to enrol an aircraft.
- [ ] Dashboard shows enrolled aircraft count.
- [ ] Dashboard shows open AOG count.
- [ ] Dashboard shows cover status.
- [ ] Dashboard shows active AOG alert if applicable.
- [ ] If two aircraft are AOG, alert area shows a clear summary and route to cases.
- [ ] `Submit AOG` is disabled or replaced with `Enrol first` when no aircraft exists.
- [ ] `Submit AOG` works once aircraft is enrolled/allowed.
- [ ] Recent requests shows `Enrol aircraft` guidance when no aircraft exists.
- [ ] Recent requests shows latest AOG cases when cases exist.
- [ ] Support details display correctly.
- [ ] Times/dates display in user’s local timezone.
- [ ] Sidebar links all work.
- [ ] Mobile dashboard layout does not overflow horizontally.

## 7. My Aircraft

- [ ] My Aircraft page loads.
- [ ] Aircraft list displays all active aircraft.
- [ ] Archived/removed aircraft are not shown as active.
- [ ] User can switch between multiple aircraft.
- [ ] Aircraft details panel is fully visible on desktop.
- [ ] Aircraft details panel is fully usable on mobile.
- [ ] Overview tab displays registration, category, make/model, base, owner/operator, plan, and cover status.
- [ ] Engine & Maintenance tab displays engine details.
- [ ] Propeller details display for turboprop/single/multi engine aircraft.
- [ ] User can update aircraft details where allowed.
- [ ] User can update base airport/location where allowed.
- [ ] User can update engine details where allowed.
- [ ] User can update propeller details where allowed.
- [ ] Contacts tab displays/edit contacts.
- [ ] Documents tab uploads documents.
- [ ] Documents tab downloads documents.
- [ ] Documents are scoped to the correct subscriber only.
- [ ] Verification tab displays pending/active/declined state.
- [ ] Parts history tab displays resolved case history.
- [ ] Quick edit works.
- [ ] Parts Passport export works.
- [ ] Remove/archive aircraft flow exists.
- [ ] Remove/archive aircraft asks for reason, e.g. sold aircraft/no longer requires support.
- [ ] Removed aircraft no longer allows new AOG requests.

## 8. Submit AOG Journey

- [ ] Submit AOG page requires login.
- [ ] User with no aircraft is prompted to enrol first.
- [ ] User can select an enrolled aircraft.
- [ ] User can choose ATA/system category.
- [ ] User can choose curated component where available.
- [ ] User can select `Other / not listed`.
- [ ] Free-text issue description is always available.
- [ ] Known part number can be entered.
- [ ] Location/ICAO can be entered.
- [ ] People on board/affected can be entered.
- [ ] Deadline/urgency can be entered.
- [ ] AMO awareness field works.
- [ ] Best contact number is prefilled or editable.
- [ ] Form validates required fields.
- [ ] Submit creates a case reference.
- [ ] Success screen is clear.
- [ ] Subscriber receives AOG submission email.
- [ ] Admin receives AOG alert email.
- [ ] New case appears in subscriber AOG Cases.
- [ ] New case appears in admin AOG queue.
- [ ] Case status starts as Submitted.

## 9. Subscriber AOG Cases

- [ ] AOG Cases list loads.
- [ ] Multiple cases display cleanly on desktop.
- [ ] Multiple cases display cleanly on mobile.
- [ ] Case status pills are readable.
- [ ] Case detail page opens.
- [ ] Case detail does not overflow on mobile.
- [ ] Case timeline/status history displays.
- [ ] Exception states display if present.
- [ ] Freight/tracking details display if entered by admin.
- [ ] Quote/options display when admin sends them.
- [ ] Supplier name is hidden from subscriber if business rule requires.
- [ ] Subscriber can approve an option.
- [ ] Approval success page does not expose supplier bank details.
- [ ] Approval triggers email/invoice workflow if built.
- [ ] Approved case status updates correctly.

## 10. Notifications

- [ ] Notifications page loads.
- [ ] Empty state explains what will appear.
- [ ] New aircraft verification notification appears.
- [ ] AOG status update notification appears.
- [ ] Quote ready notification appears.
- [ ] Invoice/payment notification appears if built.
- [ ] Read/unread handling works if built.
- [ ] Notification links open the right record.

## 11. Messages

- [ ] Messages page loads.
- [ ] Empty state is clear.
- [ ] User can send a message to the desk if built.
- [ ] Sent message appears immediately or after refresh.
- [ ] Admin can see/respond to message if built.
- [ ] Old messages are stored and visible.
- [ ] Message timestamps are correct.
- [ ] Mobile message input is usable.

## 12. Parts Intelligence / AOG Risk Index / Value Summary

- [ ] Parts Intelligence page loads.
- [ ] Empty state is clear when there is no market signal data.
- [ ] Intelligence cards display when seeded data exists.
- [ ] AOG Risk Index page loads.
- [ ] AOG Risk Index font sizing matches Value Summary.
- [ ] Risk scoring explanation is readable.
- [ ] Risk data is marked clearly if manual/placeholder.
- [ ] Value Summary page loads.
- [ ] Value Summary empty state is clear.
- [ ] Value Summary displays resolved-case savings when data exists.
- [ ] Cost calculations are transparent and not presented as guaranteed savings.
- [ ] Export/download works if built.

## 13. Fleet Network

- [ ] Fleet Network page loads.
- [ ] Empty state is clear.
- [ ] Network/coverage data displays if seeded.
- [ ] Filters work if present.
- [ ] Links/cards open expected detail views if built.

## 14. Team Management

- [ ] Team page loads.
- [ ] Empty state is clear.
- [ ] Invite/add team member works if built.
- [ ] Roles/permissions are clear.
- [ ] Team member can be removed if built.
- [ ] Team invite email sends if built.
- [ ] Team member permissions restrict data appropriately.

## 15. Account

- [ ] Account page loads.
- [ ] User profile fields save.
- [ ] Address fields exist if required.
- [ ] Address fields save to the database if built.
- [ ] Password change works.
- [ ] Password change validates current/new password.
- [ ] Account contact details are reused in new enrolment where appropriate.

## 16. Admin Login / Permissions

- [ ] Admin login page loads.
- [ ] Admin can log in.
- [ ] Non-admin user cannot access admin pages.
- [ ] Admin sign out works.
- [ ] Admin dashboard loads.
- [ ] Admin dashboard does not expose raw IDs where names should appear.
- [ ] Admin sidebar links all work.
- [ ] Admin mobile layout is usable.

## 17. Admin Overview

- [ ] Open AOG counter is correct.
- [ ] SLA breach counter is correct.
- [ ] MRR counter is correct.
- [ ] Supplier live counter is correct.
- [ ] Pending enrolments counter is correct.
- [ ] SLA alert bar handles one breach.
- [ ] SLA alert bar handles multiple breaches.
- [ ] Critical queue links route to the right filtered views.
- [ ] Operations report button works or shows clear not-yet-built state.

## 18. Admin Enrolments

- [ ] Pending enrolments list loads.
- [ ] Enrolment detail opens.
- [ ] Admin can review aircraft details.
- [ ] Admin can review propeller details where relevant.
- [ ] Admin can verify aircraft.
- [ ] Verification updates subscriber dashboard to cover active.
- [ ] Verification sends subscriber email.
- [ ] Admin can decline aircraft.
- [ ] Decline requires reason.
- [ ] Decline cancels/refunds Stripe subscription if intended.
- [ ] Decline sends subscriber email.

## 19. Admin Aircraft

- [ ] Aircraft list loads.
- [ ] Stat counter shows total aircraft enrolled.
- [ ] Filter by location works if built.
- [ ] Filter by aircraft category works if built.
- [ ] View action opens details.
- [ ] Detail view displays owner/operator and contact.
- [ ] Detail view displays propeller details for relevant aircraft.
- [ ] Detail view does not overflow on mobile.
- [ ] Admin can verify/decline from aircraft view if intended.

## 20. Admin AOG Queue

- [ ] AOG queue loads.
- [ ] New submitted case appears.
- [ ] Admin can acknowledge case.
- [ ] Status updates through Submitted, Acknowledged, Sourcing, Options Ready, Awaiting Approval, Confirmed, Order Placed, In Transit, Arrived, Resolved, Cancelled.
- [ ] Status updates create timeline events.
- [ ] Status updates notify subscriber where intended.
- [ ] Admin can add exception states.
- [ ] Exception states appear alongside main status.
- [ ] Admin can add/update freight tracking.
- [ ] Admin can add internal notes.
- [ ] Internal notes are not visible to subscriber.
- [ ] Mobile layout is usable.

## 21. Admin Quotes / Supplier Options

- [ ] Admin can create/send quote option for a case.
- [ ] Supplier name is hidden from subscriber if required.
- [ ] Subscriber sees condition, documentation, price, lead time, core charge, and freight route.
- [ ] Subscriber can approve one option.
- [ ] Approved option updates admin case.
- [ ] Approved option sends email to subscriber.
- [ ] Approved option sends admin/internal email.
- [ ] Approved option creates/stores invoice/payment instruction if built.
- [ ] Supplier bank/payment details are not sent directly to subscriber.

## 22. Admin Customers

- [ ] Customers list loads.
- [ ] Customer health/status is understandable.
- [ ] Health/status is either automatically calculated or clearly marked manual.
- [ ] Customer detail opens.
- [ ] Customer aircraft and cases are visible.
- [ ] Customer search/filter works if present.

## 23. Admin Suppliers

- [ ] Suppliers list loads.
- [ ] Supplier application appears after supplier applies.
- [ ] Admin can approve supplier.
- [ ] Admin can decline supplier with reason.
- [ ] Supplier approval email sends.
- [ ] Supplier decline email sends.
- [ ] Supplier profile includes document/certification capabilities.
- [ ] Supplier profile can record EASA Form 1 capability.
- [ ] Supplier profile can record FAA Form 8130-3 capability.
- [ ] Supplier profile can record TCCA Form 1 capability.
- [ ] Supplier profile can record CAA Form 1 UK capability.
- [ ] Supplier profile can record dual release capability.
- [ ] Supplier can add team members if built.

## 24. Supplier Application Journey

- [ ] Supplier application page loads from public site.
- [ ] Company step validates required fields.
- [ ] Speciality step captures aircraft types, ATA systems, inventory platform, stock type, response time, and geography.
- [ ] Compliance step supports document upload.
- [ ] Compliance step captures expiry dates where required.
- [ ] Contacts step captures primary 24/7 AOG contact.
- [ ] Account step creates supplier application.
- [ ] Supplier sees confirmation screen.
- [ ] Supplier receives confirmation email.
- [ ] Admin receives pending supplier alert.

## 25. Supplier Portal

- [ ] Supplier login page loads.
- [ ] Approved supplier can log in.
- [ ] Pending/declined supplier cannot access portal.
- [ ] RFQ inbox loads.
- [ ] Empty RFQ state is clear.
- [ ] RFQ appears when admin sends matching request if built.
- [ ] Supplier can submit quote if built.
- [ ] Supplier can revise quote before admin selection if built.
- [ ] Quote history loads.
- [ ] Supplier profile loads.
- [ ] Supplier can update company/contact details.
- [ ] Supplier can update compliance documents.
- [ ] Supplier can update release document capabilities.
- [ ] Supplier can add team members if built.
- [ ] Supplier sign out works.

## 26. Emails / Resend

- [ ] Test email sends from app environment.
- [ ] Account welcome email sends.
- [ ] Password reset email sends.
- [ ] Aircraft enrolment email sends to subscriber.
- [ ] Aircraft enrolment alert sends to admin.
- [ ] Aircraft verified email sends.
- [ ] Aircraft declined email sends.
- [ ] AOG submitted email sends to subscriber.
- [ ] AOG alert email sends to admin.
- [ ] AOG status update emails send where intended.
- [ ] Quote ready email sends.
- [ ] Option approved email sends.
- [ ] Invoice/payment instruction email sends if built.
- [ ] Supplier application confirmation sends.
- [ ] Supplier approval/decline emails send.
- [ ] Team invite email sends if built.
- [ ] All email links open the correct page.
- [ ] Emails use verified sender once production domain is available.
- [ ] Resend logs show no failed events.

## 27. API

- [ ] API auth rejects unauthenticated requests.
- [ ] Current user endpoint works.
- [ ] Aircraft list endpoint returns only the current user’s aircraft.
- [ ] Aircraft create endpoint creates valid aircraft.
- [ ] Aircraft create endpoint supports propeller fields.
- [ ] Part/component match endpoint returns expected data.
- [ ] Invalid payloads return clear validation errors.
- [ ] API does not expose another subscriber’s documents or aircraft.

## 28. File Uploads / Documents

- [ ] Upload accepts expected file types.
- [ ] Upload rejects unsafe/unsupported file types.
- [ ] Upload size limit is enforced.
- [ ] Uploaded document appears in aircraft documents tab.
- [ ] Download link works.
- [ ] Download link requires authentication.
- [ ] User cannot access another user’s file by changing URL.
- [ ] Admin can view required documents if intended.

## 29. Responsive / Cross-Browser

- [ ] Public homepage works at 375px mobile width.
- [ ] Public homepage works at tablet width.
- [ ] Public homepage works at desktop width.
- [ ] Subscriber dashboard works at mobile width.
- [ ] My Aircraft works at mobile width.
- [ ] Submit AOG works at mobile width.
- [ ] Admin dashboard works at mobile width.
- [ ] Admin AOG queue works at mobile width.
- [ ] Supplier portal works at mobile width.
- [ ] No horizontal overflow on key pages.
- [ ] Buttons remain tappable on mobile.
- [ ] Sticky/fixed elements do not cover form fields.
- [ ] Safari desktop works.
- [ ] Safari iOS works.
- [ ] Chrome desktop works.
- [ ] Chrome Android works if available.

## 30. PWA

- [ ] Web app manifest loads.
- [ ] 192x192 icon loads.
- [ ] 512x512 icon loads.
- [ ] Maskable icon loads.
- [ ] App can be installed on supported mobile browser.
- [ ] Service worker registers.
- [ ] Offline fallback works.
- [ ] Cached public pages load offline where intended.
- [ ] Authenticated/offline states are clear and not misleading.
- [ ] iOS mobile meta tags are present.
- [ ] Android theme color/status bar looks correct.

## 31. Error Handling / Empty States

- [ ] Broken database connection shows a user-friendly error.
- [ ] Missing environment variables do not expose secrets.
- [ ] Failed Stripe call shows useful message and does not duplicate subscriptions.
- [ ] Failed email send is logged and does not crash the user journey.
- [ ] Failed file upload shows clear message.
- [ ] Failed AOG submission does not create partial duplicate case.
- [ ] All empty dashboard sections explain what will appear there.

## 32. Security / Data Access

- [ ] Subscriber cannot access `/admin`.
- [ ] Supplier cannot access `/admin`.
- [ ] Subscriber cannot access supplier portal.
- [ ] Supplier cannot access subscriber portal.
- [ ] Subscriber cannot view another subscriber’s aircraft.
- [ ] Subscriber cannot view another subscriber’s documents.
- [ ] Subscriber cannot approve another subscriber’s quote.
- [ ] Admin-only actions are server-side protected.
- [ ] Stripe webhook signature is verified.
- [ ] Resend/API keys are not exposed to browser bundle.
- [ ] File upload endpoint validates auth and ownership.

## 33. Final Release Smoke Test

- [ ] Public homepage loads.
- [ ] Create new account.
- [ ] Receive welcome email.
- [ ] Log in.
- [ ] Enrol aircraft.
- [ ] Complete Stripe test checkout.
- [ ] Aircraft appears pending.
- [ ] Admin verifies aircraft.
- [ ] Subscriber dashboard shows cover active.
- [ ] Submit AOG.
- [ ] Admin sees AOG.
- [ ] Admin acknowledges and updates status.
- [ ] Admin sends option/quote if built.
- [ ] Subscriber approves option.
- [ ] Payment/invoice email flow triggers if built.
- [ ] Case can be marked in transit/arrived/resolved.
- [ ] Parts history/passport/value summary update as expected.

## Known Items To Mark Clearly During Testing

- [ ] CMS/admin content editing: confirm whether built or future phase.
- [ ] Automated AOG risk scoring: confirm whether manual/seeded or future rules engine.
- [ ] Revenue export/download: confirm whether built.
- [ ] Supplier quote submission from supplier portal: confirm whether fully wired.
- [ ] Full invoice/payment instruction workflow after quote approval: confirm whether fully wired.
- [ ] Team invites and role permissions: confirm whether fully wired.
- [ ] Production email sending domain: confirm whether verified or still using Resend test sender.
