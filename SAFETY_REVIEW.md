# 1iQ Safety Features Review for Service Contracts

**Date:** March 6, 2026
**Scope:** Review of safety features currently implemented in the 1iQ codebase
**Codebase:** React landing page / marketing site (no backend)

---

## 1. Currently Implemented Safety Features

### 1.1 Legal & Policy Pages

| Document | Location | Last Updated |
|----------|----------|-------------|
| Terms of Use | `src/pages/TermsOfUse/TermsOfUse.jsx` | November 19, 2025 |
| Privacy Policy | `src/pages/PrivacyPolicy/PrivacyPolicy.jsx` | November 19, 2025 |

**Terms of Use covers:**
- Acceptance of terms clause
- Service description (construction management platform)
- User account accuracy requirements
- Privacy Policy cross-reference
- Intellectual property ownership (copyright, trademark)
- Termination rights (immediate, without prior notice)
- 30-day notice for material changes
- Contact: `support@1iq.ai`

**Privacy Policy covers:**
- Data collection disclosure (name, email, phone, company info)
- Purpose limitation (service delivery, communications)
- Third-party sharing limited to service providers
- Industry-standard encryption and security protocols (claimed)
- User rights: access, correct, delete personal data
- Cookies and tracking technology disclosure
- Third-party links disclaimer
- Contact: `privacy@1iq.ai`

### 1.2 Form Input Validation

Four forms with validation (Schedule, ContactUs, BuilderForm, PartnershipInquiry):

- **Email validation:** Regex pattern enforcement
- **Phone validation:** International format regex
- **URL validation:** HTTP/HTTPS format checking
- **Required fields:** Enforced on all critical inputs
- **Minimum length:** 20+ characters on description fields
- **Validation mode:** Triggers on blur for real-time feedback
- **Consent checkboxes:** Opt-in for marketing communications, sales outreach, and event updates

### 1.3 Data Transmission

- All form data submitted over HTTPS to `api.web3forms.com`
- Form data normalized via FormData API with type conversion

---

## 2. Claimed Features NOT Yet Implemented

The Platform page (`src/pages/Platform/Platform.jsx`) advertises the following features that have **no backing code or infrastructure**:

| Claimed Feature | Actual Status |
|-----------------|---------------|
| Military-grade encryption and security protocols | **Not implemented** — no encryption logic in codebase |
| Blockchain-enabled tracking | **Not implemented** — no blockchain integration |
| Immutable audit trails | **Not implemented** — no audit logging |
| AI-powered risk identification and mitigation | **Not implemented** — no AI backend |
| Automated quality assurance with defect detection | **Not implemented** — no QA automation |
| Real-time monitoring with instant alerts | **Not implemented** — no monitoring infrastructure |
| Compliance with industry standards | **Not implemented** — no compliance tooling |
| Neural network processing | **Not implemented** — no ML models |
| Predictive analytics engine | **Not implemented** — no analytics backend |
| Edge computing / distributed intelligence | **Not implemented** — client-side only |

**Contract Risk:** If these claims are referenced in service agreements, they could create enforceable obligations that cannot be fulfilled.

---

## 3. Security Gaps Relevant to Service Contracts

### 3.1 Critical

- **Hardcoded API keys** — 4 Web3Forms access keys are exposed in client-side source code (Schedule.jsx, ContactUs.jsx, BuilderForm.jsx, PartnershipInquiry.jsx). These should be moved to environment variables or proxied through a backend.
- **No input sanitization** — Form inputs are not sanitized for XSS (no DOMPurify or equivalent).

### 3.2 High

- **No CAPTCHA or bot protection** — Forms are vulnerable to automated spam and abuse.
- **No rate limiting** — No protection against submission floods (client or server side).
- **No CSRF protection** — No cross-site request forgery tokens on form submissions.
- **No authentication system** — No user accounts, sessions, or access controls exist.

### 3.3 Medium

- **No GDPR consent banner** — Despite Privacy Policy mentioning cookies/tracking, there is no consent management implementation.
- **No CCPA compliance** — No California-specific privacy rights handling.
- **No error monitoring service** — Only `console.log`/`console.error` in production code; no Sentry, Datadog, or similar.
- **No audit logging** — No trail of user actions or system events.
- **Console logs in production** — Sensitive form data logged to browser console.

### 3.4 Low

- **No Content Security Policy headers** — No CSP configured in deployment.
- **No dependency security auditing** — No automated npm audit in CI/CD pipeline.

---

## 4. Recommendations Before Finalizing Service Contracts

### 4.1 Separate Marketing Claims from Contractual Obligations
Do not reference unimplemented features (encryption, blockchain, AI) in service contracts. Use phased language (e.g., "planned capabilities" vs. "current features").

### 4.2 Privacy Policy Enhancements Needed
- Specify data retention periods
- Add GDPR-specific sections (legal basis, DPO contact, cross-border transfers)
- Add CCPA-specific sections (right to opt-out, do-not-sell)
- Define data breach notification timelines (e.g., 72 hours per GDPR)
- Publish a sub-processor list

### 4.3 Terms of Use Enhancements Needed
- Service Level Agreement (SLA) with uptime commitments
- Data Processing Agreement (DPA) for enterprise customers
- Limitation of liability specifics (caps, exclusions)
- Indemnification clauses
- Force majeure provisions
- Governing law and dispute resolution
- Data portability and exit provisions

### 4.4 Technical Remediation Required
1. Move all API keys to environment variables (`.env.local`)
2. Implement input sanitization (DOMPurify or equivalent)
3. Add CAPTCHA to all public forms
4. Remove `console.log` statements from production builds
5. Set up error monitoring (Sentry or similar)
6. Implement a GDPR/CCPA consent management banner
7. Add Content Security Policy headers
8. Configure automated dependency security scanning

### 4.5 For Future Backend Development
Before any backend goes live, the following must be in place for contract compliance:
- Authentication and authorization (OAuth 2.0, JWT, or equivalent)
- Encryption at rest and in transit (specify AES-256, TLS 1.3)
- Audit logging with tamper-evident storage
- Incident response procedures and runbook
- Regular penetration testing schedule
- SOC 2 Type II readiness (if targeting enterprise customers)
- Data residency controls (if serving international customers)

---

## 5. Summary

The 1iQ codebase is currently a **well-built marketing landing page** with basic form validation and legal pages. However, there is a significant gap between what is **claimed** on the platform page and what is **actually implemented**. Service contracts should be carefully scoped to reflect the current state of the platform, with clear language about future capabilities and timelines.

**Key takeaway:** The codebase has foundational legal pages and basic input validation, but lacks the security infrastructure, compliance tooling, and backend features needed to back up the safety claims made in marketing content. Address these gaps before committing to contractual safety guarantees.
