// ─── Site content model ─────────────────────────────────────────────────────
// All footer/legal/editorial content lives here as structured data so pages are
// data-driven, reusable, and ready for i18n (swap this module per locale later).
// Content is original and written for a fictional travel platform.

export const SITE = {
  name: 'Asia Grand Tour',
  legalName: 'Asia Grand Tour Travel Services Co., Ltd.',
  tagline: 'Considered journeys across Asia and beyond.',
  email: 'hello@asiagrandtour.example',
  supportEmail: 'support@asiagrandtour.example',
  privacyEmail: 'privacy@asiagrandtour.example',
  hotline: '+65 6000 1234',
  address: '18 Marina Boulevard, #22-01, Singapore 018980',
  founded: 2009,
  url: 'https://asiagrandtour.example',
}

export interface NavItem {
  slug: string
  label: string
}

// ── Column 1: INFORMATION ──────────────────────────────────────────────────
export const INFO_NAV: NavItem[] = [
  { slug: 'about', label: 'About Us' },
  { slug: 'visa-statistics', label: 'Visa Approval Statistics' },
  { slug: 'magazine', label: 'Travel Magazine' },
  { slug: 'news', label: 'News' },
  { slug: 'sitemap', label: 'Sitemap' },
  { slug: 'help', label: 'Help Center' },
]

// ── Column 2: TERMS & POLICIES ───────────────────────────────────────────────
export const LEGAL_NAV: NavItem[] = [
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms-of-service', label: 'Terms of Service' },
  { slug: 'data-protection', label: 'Personal Data Protection Policy' },
  { slug: 'booking-terms', label: 'Booking Terms & Conditions' },
  { slug: 'flight-policy', label: 'Flight Booking Policy' },
  { slug: 'hotel-policy', label: 'Hotel Booking Policy' },
  { slug: 'visa-terms', label: 'Visa Service Terms' },
  { slug: 'payment-policy', label: 'Payment Policy' },
  { slug: 'refund-policy', label: 'Refund Policy' },
  { slug: 'cancellation-policy', label: 'Cancellation Policy' },
  { slug: 'account-security', label: 'Account Security Policy' },
  { slug: 'cookie-policy', label: 'Cookie Policy' },
  { slug: 'anti-fraud', label: 'Anti-Fraud Policy' },
  { slug: 'website-terms', label: 'Website Terms of Use' },
  { slug: 'promotional-terms', label: 'Promotional Terms' },
  { slug: 'pricing-policy', label: 'Pricing Policy' },
  { slug: 'complaint-resolution', label: 'Complaint Resolution Policy' },
  { slug: 'compensation-policy', label: 'Compensation Policy' },
  { slug: 'business-terms', label: 'Business Customer Terms' },
  { slug: 'partner-terms', label: 'Travel Agency Partner Terms' },
  { slug: 'customer-rights', label: 'Customer Rights & Responsibilities' },
  { slug: 'company-rights', label: 'Company Rights & Responsibilities' },
  { slug: 'liability', label: 'Limitation of Liability' },
  { slug: 'force-majeure', label: 'Force Majeure' },
  { slug: 'third-party', label: 'Third-Party Services Policy' },
  { slug: 'copyright', label: 'Copyright Policy' },
  { slug: 'intellectual-property', label: 'Intellectual Property Policy' },
  { slug: 'anti-spam', label: 'Anti-Spam Policy' },
  { slug: 'dispute-resolution', label: 'Dispute Resolution' },
  { slug: 'service-termination', label: 'Service Termination Policy' },
  { slug: 'policy-updates', label: 'Policy Updates & Effective Date' },
  { slug: 'accessibility', label: 'Accessibility Statement' },
  { slug: 'code-of-conduct', label: 'Code of Conduct' },
  { slug: 'community-guidelines', label: 'Community Guidelines' },
  { slug: 'acceptable-use', label: 'Acceptable Use Policy' },
  { slug: 'security-disclosure', label: 'Security Disclosure Policy' },
  { slug: 'data-retention', label: 'Data Retention Policy' },
  { slug: 'gdpr', label: 'GDPR Compliance' },
  { slug: 'travel-disclaimer', label: 'International Travel Disclaimer' },
  { slug: 'health-disclaimer', label: 'Medical & Health Disclaimer' },
]

// ── Terms & Policies, split into three logical sub-groups for the footer ──────
export const LEGAL_GROUPS: { title: string; links: NavItem[] }[] = [
  {
    title: 'General Policies',
    links: [
      { slug: 'privacy-policy', label: 'Privacy Policy' },
      { slug: 'terms-of-service', label: 'Terms of Service' },
      { slug: 'website-terms', label: 'Website Terms of Use' },
      { slug: 'cookie-policy', label: 'Cookie Policy' },
      { slug: 'acceptable-use', label: 'Acceptable Use Policy' },
      { slug: 'anti-spam', label: 'Anti-Spam Policy' },
      { slug: 'community-guidelines', label: 'Community Guidelines' },
      { slug: 'accessibility', label: 'Accessibility Statement' },
    ],
  },
  {
    title: 'Transaction Rules',
    links: [
      { slug: 'booking-terms', label: 'Booking Terms & Conditions' },
      { slug: 'flight-policy', label: 'Flight Booking Policy' },
      { slug: 'hotel-policy', label: 'Hotel Booking Policy' },
      { slug: 'visa-terms', label: 'Visa Service Terms' },
      { slug: 'payment-policy', label: 'Payment Policy' },
      { slug: 'pricing-policy', label: 'Pricing Policy' },
      { slug: 'refund-policy', label: 'Refund Policy' },
      { slug: 'cancellation-policy', label: 'Cancellation Policy' },
      { slug: 'compensation-policy', label: 'Compensation Policy' },
      { slug: 'promotional-terms', label: 'Promotional Terms' },
    ],
  },
  {
    title: 'Legal & Compliance',
    links: [
      { slug: 'data-protection', label: 'Personal Data Protection Policy' },
      { slug: 'gdpr', label: 'GDPR Compliance' },
      { slug: 'data-retention', label: 'Data Retention Policy' },
      { slug: 'account-security', label: 'Account Security Policy' },
      { slug: 'anti-fraud', label: 'Anti-Fraud Policy' },
      { slug: 'liability', label: 'Limitation of Liability' },
      { slug: 'force-majeure', label: 'Force Majeure' },
      { slug: 'dispute-resolution', label: 'Dispute Resolution' },
      { slug: 'intellectual-property', label: 'Intellectual Property Policy' },
      { slug: 'third-party', label: 'Third-Party Services Policy' },
    ],
  },
]

// ── Legal page model ─────────────────────────────────────────────────────────
export interface LegalSection {
  heading: string
  body: string[] // paragraphs
  bullets?: string[]
  highlight?: string // important callout box
}
export interface LegalPage {
  title: string
  summary: string
  updated: string
  version: string
  sections: LegalSection[]
  faqs?: { q: string; a: string }[]
}

const UPDATED = 'July 1, 2026'

// Shared, genuinely-worded clauses reused across documents (as real companies do).
const contactSection: LegalSection = {
  heading: 'Contact & Questions',
  body: [
    `If any part of this document is unclear, or you wish to exercise a right described here, our team is glad to help. We aim to acknowledge every enquiry within two business days.`,
    `Write to ${SITE.privacyEmail} for data matters or ${SITE.supportEmail} for everything else. You may also call our hotline at ${SITE.hotline} or write to ${SITE.legalName}, ${SITE.address}.`,
  ],
}
const updatesSection: LegalSection = {
  heading: 'Changes to This Policy',
  body: [
    `We review this document periodically and may revise it to reflect changes in our services, technology, or the law. When we make a material change we will update the version number and effective date shown at the top of the page, and — where the change materially affects your rights — notify you by email or an in-product notice before it takes effect.`,
    `Your continued use of our services after the effective date constitutes acceptance of the revised document. Earlier versions are retained and available on request for your records.`,
  ],
}

// A helper that composes a genuine, tailored legal page from a short spec.
// Every policy therefore renders with real, policy-specific prose plus the
// standard structural sections every professional legal document carries.
function makePolicy(spec: {
  title: string
  summary: string
  intro: string
  scope: string
  core: LegalSection[]
  highlight?: string
  faqs?: { q: string; a: string }[]
}): LegalPage {
  return {
    title: spec.title,
    summary: spec.summary,
    updated: UPDATED,
    version: '3.2',
    sections: [
      {
        heading: 'Introduction',
        body: [spec.intro],
        highlight: spec.highlight,
      },
      { heading: 'Scope & Application', body: [spec.scope] },
      ...spec.core,
      updatesSection,
      contactSection,
    ],
    faqs: spec.faqs,
  }
}

export const POLICIES: Record<string, LegalPage> = {
  'privacy-policy': makePolicy({
    title: 'Privacy Policy',
    summary: 'How we collect, use, protect, and share your personal information.',
    intro: `${SITE.legalName} ("we", "us") respects your privacy and is committed to protecting the personal data you entrust to us when you browse our website, book travel, or apply for visa assistance. This Privacy Policy explains what we collect, why we collect it, how long we keep it, and the choices and rights available to you.`,
    scope: `This policy applies to all personal data processed through our websites, mobile apps, call centre, and offices, whether you are a traveller, a prospective customer, a partner contact, or a website visitor. It does not apply to third-party services that operate under their own privacy notices.`,
    highlight: `We never sell your personal data. We share it only with the airlines, hotels, insurers, and government authorities strictly necessary to deliver the service you requested, and with vetted processors bound by contract.`,
    core: [
      {
        heading: 'Information We Collect',
        body: ['We collect information in three ways: what you give us, what we observe as you use our services, and what we receive from trusted partners.'],
        bullets: [
          'Identity & contact data: name, date of birth, nationality, passport details, email, phone, and postal address.',
          'Booking data: itineraries, traveller preferences, loyalty numbers, and special-assistance requests.',
          'Payment data: processed by PCI-DSS compliant providers; we store only truncated card references, never full card numbers.',
          'Technical data: IP address, device and browser type, and interaction logs collected via cookies (see our Cookie Policy).',
        ],
      },
      {
        heading: 'How We Use Your Information',
        body: ['We process personal data only where we have a lawful basis to do so — to perform our contract with you, to comply with legal obligations (such as immigration and anti-money-laundering rules), for our legitimate business interests, or with your consent.'],
        bullets: [
          'To arrange, confirm, and service your bookings and visa applications.',
          'To provide customer support and respond to your enquiries.',
          'To detect and prevent fraud and to keep our platform secure.',
          'To send service messages and, where permitted, relevant marketing you can opt out of at any time.',
        ],
      },
      {
        heading: 'Your Rights',
        body: ['Subject to applicable law, you may request access to your data, correction of inaccuracies, deletion, restriction or objection to certain processing, and portability. You may also withdraw consent at any time without affecting prior lawful processing.'],
      },
      {
        heading: 'Data Retention & Security',
        body: ['We keep personal data only as long as necessary for the purposes described here or as required by law, then securely delete or anonymise it. We protect data with encryption in transit and at rest, access controls, and regular security testing.'],
      },
    ],
    faqs: [
      { q: 'Do you sell my data to advertisers?', a: 'No. We never sell personal data. Marketing is limited to our own relevant offers, which you can opt out of at any time.' },
      { q: 'How do I request a copy of my data?', a: `Email ${SITE.privacyEmail} from your registered address. We verify identity and respond within 30 days.` },
    ],
  }),
  'terms-of-service': makePolicy({
    title: 'Terms of Service',
    summary: 'The agreement governing your use of our platform and services.',
    intro: `These Terms of Service form a binding agreement between you and ${SITE.legalName} governing your access to and use of our website, apps, and travel services. By creating an account, making a booking, or otherwise using our services, you agree to these terms.`,
    scope: `These terms apply to all users of our platform. Specific products — flights, hotels, tours, and visa assistance — are also governed by their dedicated policies, which form part of this agreement. Where a product-specific term conflicts with these general terms, the product-specific term prevails for that product.`,
    highlight: `We act as an intermediary between you and travel suppliers. Your travel contract for flights, accommodation, and activities is generally with the relevant supplier, subject to their conditions of carriage or service.`,
    core: [
      {
        heading: 'Eligibility & Accounts',
        body: ['You must be at least 18 years old and able to form a binding contract to use our services. You are responsible for the accuracy of the information you provide and for keeping your account credentials confidential.'],
      },
      {
        heading: 'Bookings & Pricing',
        body: ['All bookings are subject to availability and confirmation. Prices are shown inclusive of applicable taxes unless stated otherwise and may change until a booking is confirmed. Obvious pricing errors do not bind us, and we will offer you the corrected price or a full refund.'],
      },
      {
        heading: 'Your Responsibilities',
        body: ['You are responsible for holding valid travel documents, meeting entry and health requirements, arriving on time, and complying with supplier rules. Visa assistance improves your application but never guarantees approval, which rests solely with the relevant authority.'],
      },
      {
        heading: 'Prohibited Conduct',
        body: ['You agree not to misuse the platform, including by scraping, attempting unauthorised access, submitting fraudulent bookings, or infringing intellectual property. We may suspend or terminate accounts that breach these terms.'],
      },
    ],
    faqs: [
      { q: 'Is my contract with you or the airline?', a: 'For flights and most accommodation, your travel contract is with the supplier; we facilitate and service the booking on your behalf.' },
    ],
  }),
  'refund-policy': makePolicy({
    title: 'Refund Policy',
    summary: 'When and how refunds are issued, and how long they take.',
    intro: `This Refund Policy explains the circumstances in which you may be entitled to a refund, how refunds are calculated, and the timeframes involved. Refund eligibility depends on the type of product and the supplier's own conditions.`,
    scope: `This policy applies to bookings made through ${SITE.name}. It works together with our Cancellation Policy and each product's booking policy.`,
    highlight: `Refunds are always issued to the original payment method. Supplier and payment-processing fees, where non-recoverable, may be deducted and are clearly itemised.`,
    core: [
      {
        heading: 'Refund Eligibility',
        body: ['Eligibility depends on the fare or rate rules at the time of booking. Refundable products can be cancelled for a full or partial refund within the stated window; non-refundable products are only refunded where the supplier permits or where a service failure occurred on our side.'],
        bullets: [
          'Flexible fares/rates: refundable per the stated conditions.',
          'Non-refundable fares/rates: taxes and recoverable fees may still be returned.',
          'Service failure by us: full refund of our service fee.',
        ],
      },
      {
        heading: 'Processing Times',
        body: ['Once approved, refunds are initiated within 7 business days. The time for funds to appear depends on your bank or card issuer, typically 5–15 business days for cards and up to 30 days for certain airline refunds.'],
      },
    ],
    faqs: [
      { q: 'Can I get cash instead of a refund to my card?', a: 'No. For security and anti-fraud reasons, refunds return to the original payment method.' },
    ],
  }),
  'cookie-policy': makePolicy({
    title: 'Cookie Policy',
    summary: 'How we use cookies and similar technologies, and how to control them.',
    intro: `This Cookie Policy explains how ${SITE.name} uses cookies and similar technologies to recognise you, remember your preferences, and understand how our services are used.`,
    scope: `This policy applies to our websites and apps and should be read alongside our Privacy Policy.`,
    highlight: `You can accept or reject non-essential cookies at any time through our consent banner or your browser settings. Essential cookies cannot be switched off as they are required for the site to function.`,
    core: [
      {
        heading: 'Types of Cookies We Use',
        body: ['We group cookies by purpose so you can make an informed choice.'],
        bullets: [
          'Strictly necessary: security, load balancing, and session management.',
          'Preference: language, currency, and display settings.',
          'Analytics: aggregated, privacy-respecting usage statistics.',
          'Marketing: measure campaign performance (only with consent).',
        ],
      },
      {
        heading: 'Managing Cookies',
        body: ['You can withdraw or change consent via the "Cookie settings" link in our footer. Blocking some cookies may affect how the site works.'],
      },
    ],
  }),
  'cancellation-policy': makePolicy({
    title: 'Cancellation Policy',
    summary: 'How to cancel, applicable fees, and supplier-specific rules.',
    intro: `This Cancellation Policy sets out how you can cancel a booking, the deadlines that apply, and the fees that may be charged. Because airlines, hotels, and tour operators each set their own rules, the precise terms are always shown at the point of booking.`,
    scope: `This policy applies to all cancellable bookings made through ${SITE.name} and complements our Refund Policy.`,
    highlight: `Always check the cancellation window shown on your confirmation. Cancelling within a free-cancellation window incurs no supplier charge, though our service fee may be non-refundable.`,
    core: [
      {
        heading: 'How to Cancel',
        body: ['Cancel from your account under "My Trips", or contact our support team. We recommend cancelling in writing so you have a timestamped record.'],
      },
      {
        heading: 'Cancellation Fees',
        body: ['Fees vary by product and how close to departure you cancel. The applicable fee schedule is disclosed before you confirm and repeated on your confirmation email.'],
      },
    ],
  }),
}

// Register the remaining policies with genuine, tailored content so every
// footer link resolves to a complete, professionally-written page.
const REMAINING: { slug: string; title: string; summary: string; intro: string; scope: string; core: LegalSection[]; highlight?: string }[] = [
  { slug: 'data-protection', title: 'Personal Data Protection Policy', summary: 'Our organisational commitment to safeguarding personal data.', intro: 'This policy describes the principles and controls we apply across our organisation to protect personal data throughout its lifecycle, from collection to secure deletion.', scope: 'It applies to all staff, contractors, and processors handling personal data on our behalf.', core: [{ heading: 'Data Protection Principles', body: ['We process personal data lawfully, fairly, and transparently; collect it for specified purposes; minimise what we hold; keep it accurate; retain it no longer than necessary; and secure it appropriately.'] }, { heading: 'Accountability', body: ['We appoint a Data Protection Officer, maintain records of processing, conduct impact assessments for high-risk activities, and train staff regularly.'] }] },
  { slug: 'booking-terms', title: 'Booking Terms & Conditions', summary: 'The conditions that apply when you make a booking.', intro: 'These conditions govern every booking you make through our platform and sit alongside the specific flight, hotel, and visa policies.', scope: 'They apply to all confirmed and pending bookings.', core: [{ heading: 'Confirmation', body: ['A booking is confirmed only when you receive a written confirmation and reference number. Until then, prices and availability may change.'] }, { heading: 'Changes', body: ['Amendment fees depend on supplier rules and are disclosed before you confirm any change.'] }] },
  { slug: 'flight-policy', title: 'Flight Booking Policy', summary: 'Rules specific to booking and changing flights.', intro: 'This policy explains fare rules, baggage, check-in, and schedule-change handling for flights booked through us.', scope: 'It applies to all air tickets issued via our platform.', core: [{ heading: 'Fare Rules & Baggage', body: ['Each fare carries its own rules for changes, refunds, and baggage, shown before purchase. Airlines, not us, set and enforce these rules.'] }, { heading: 'Schedule Changes', body: ['If an airline changes your schedule, we will notify you and help you accept the new times, rebook, or claim a refund per the airline policy.'] }], highlight: 'Reconfirm your flight times 24–72 hours before departure; airline schedules can change after ticketing.' },
  { slug: 'hotel-policy', title: 'Hotel Booking Policy', summary: 'Rules specific to accommodation bookings.', intro: 'This policy covers rate types, check-in/out, occupancy, and property-imposed charges for accommodation booked through us.', scope: 'It applies to all hotel and lodging reservations.', core: [{ heading: 'Rates & Occupancy', body: ['Rates are per room per night for the stated occupancy. City taxes and resort fees may be payable at the property and are flagged at booking where known.'] }, { heading: 'Check-in Requirements', body: ['Guests must present valid ID and, sometimes, the payment card used. Early check-in and late check-out are subject to availability.'] }] },
  { slug: 'visa-terms', title: 'Visa Service Terms', summary: 'The terms of our visa assistance service.', intro: 'We provide guidance, document review, and submission support to improve the quality of your visa application. We are not a government body and cannot influence decisions.', scope: 'These terms apply to all visa assistance engagements.', core: [{ heading: 'No Guarantee of Approval', body: ['Visa decisions rest solely with the issuing authority. Our fee covers our professional service and is payable regardless of the outcome.'] }, { heading: 'Your Obligations', body: ['You must provide accurate, complete, and genuine documents. Misrepresentation can lead to refusal or bans for which we bear no liability.'] }], highlight: 'Our service fee is separate from government/embassy fees and is non-refundable once work has begun, even if the visa is refused.' },
  { slug: 'payment-policy', title: 'Payment Policy', summary: 'Accepted methods, currencies, and payment security.', intro: 'This policy describes how and when payments are taken, the methods we accept, and how we keep payments secure.', scope: 'It applies to all payments made to us.', core: [{ heading: 'Accepted Methods', body: ['We accept major cards and selected local methods. Payments are processed by PCI-DSS certified providers; we do not store full card numbers.'] }, { heading: 'Currency & Charges', body: ['Prices display in your selected currency for convenience; your issuer determines the final converted amount and any foreign-transaction fees.'] }] },
  { slug: 'account-security', title: 'Account Security Policy', summary: 'How we and you keep your account safe.', intro: 'This policy explains the safeguards we provide and the steps you should take to protect your account.', scope: 'It applies to all registered accounts.', core: [{ heading: 'Our Safeguards', body: ['We offer strong password rules, optional two-factor authentication, login alerts, and continuous monitoring for suspicious activity.'] }, { heading: 'Your Responsibilities', body: ['Keep credentials confidential, use a unique password, and report any suspected compromise immediately.'] }] },
  { slug: 'anti-fraud', title: 'Anti-Fraud Policy', summary: 'Our zero-tolerance approach to fraud.', intro: 'We operate robust controls to detect and prevent fraudulent transactions and account activity, protecting both customers and suppliers.', scope: 'It applies to all transactions and accounts.', core: [{ heading: 'Detection & Prevention', body: ['We use risk scoring, verification checks, and manual review. Suspicious bookings may be held pending verification.'] }, { heading: 'Consequences', body: ['Confirmed fraud results in cancellation, account termination, and referral to authorities where appropriate.'] }] },
  { slug: 'website-terms', title: 'Website Terms of Use', summary: 'Rules for using this website.', intro: 'By using this website you agree to these terms, which govern acceptable use, content, and availability.', scope: 'They apply to all visitors.', core: [{ heading: 'Acceptable Use', body: ['Do not misuse the site, interfere with its operation, or attempt unauthorised access.'] }, { heading: 'Availability', body: ['We aim for high availability but do not guarantee uninterrupted access and may suspend the site for maintenance.'] }] },
  { slug: 'promotional-terms', title: 'Promotional Terms', summary: 'General conditions for promotions and offers.', intro: 'These terms apply to promotions, discount codes, and campaigns we run, in addition to any promotion-specific rules published at the time.', scope: 'They apply to all promotional offers.', core: [{ heading: 'Eligibility', body: ['Offers may be limited by region, product, dates, and quantity, and cannot be combined unless stated.'] }, { heading: 'Withdrawal', body: ['We may amend or withdraw a promotion for good reason, honouring bookings already confirmed under it.'] }] },
  { slug: 'pricing-policy', title: 'Pricing Policy', summary: 'How prices are set and displayed.', intro: 'This policy explains how we display prices, taxes, and fees so you can see the full cost before you pay.', scope: 'It applies to all prices shown on our platform.', core: [{ heading: 'Transparency', body: ['We show the total price including mandatory taxes and our service fee before checkout. Optional extras are itemised separately.'] }, { heading: 'Price Changes', body: ['Prices can change until a booking is confirmed due to live supplier pricing and currency movement.'] }] },
  { slug: 'complaint-resolution', title: 'Complaint Resolution Policy', summary: 'How to raise a complaint and what to expect.', intro: 'We take complaints seriously and aim to resolve them fairly and promptly.', scope: 'It applies to all customer complaints.', core: [{ heading: 'How to Complain', body: ['Contact support with your booking reference and details. We acknowledge within 2 business days and aim to resolve within 28 days.'] }, { heading: 'Escalation', body: ['If you are unsatisfied, you may escalate to our Customer Care Lead and, ultimately, to the relevant ombudsman or ADR scheme.'] }] },
  { slug: 'compensation-policy', title: 'Compensation Policy', summary: 'When compensation may apply and how it is assessed.', intro: 'This policy describes when we may offer compensation for service failures within our control.', scope: 'It applies to failures attributable to us, not to suppliers or force-majeure events.', core: [{ heading: 'Assessment', body: ['We assess each case on its facts, considering the impact and our role. Remedies range from fee refunds to goodwill credits.'] }] },
  { slug: 'business-terms', title: 'Business Customer Terms', summary: 'Terms for corporate and business accounts.', intro: 'These terms govern travel arranged for business customers, including invoicing, travel policy controls, and reporting.', scope: 'They apply to registered business accounts.', core: [{ heading: 'Invoicing & Credit', body: ['Approved accounts may qualify for consolidated invoicing and agreed payment terms subject to credit checks.'] }] },
  { slug: 'partner-terms', title: 'Travel Agency Partner Terms', summary: 'Terms for agency and affiliate partners.', intro: 'These terms govern the relationship with travel agencies and affiliates who resell or refer our services.', scope: 'They apply to approved partners.', core: [{ heading: 'Commission & Conduct', body: ['Partners earn agreed commission and must represent our services accurately and lawfully.'] }] },
  { slug: 'customer-rights', title: 'Customer Rights & Responsibilities', summary: 'What you can expect from us, and what we expect from you.', intro: 'This charter sets out the balance of rights and responsibilities that makes travel run smoothly.', scope: 'It applies to all customers.', core: [{ heading: 'Your Rights', body: ['Clear pricing, accurate information, secure payment, responsive support, and fair handling of issues.'] }, { heading: 'Your Responsibilities', body: ['Provide accurate details, hold valid documents, and treat staff and suppliers with respect.'] }] },
  { slug: 'company-rights', title: 'Company Rights & Responsibilities', summary: 'Our commitments and the rights we reserve.', intro: 'This document describes our commitments to you and the limited rights we reserve to run a safe, fair service.', scope: 'It applies to our provision of services.', core: [{ heading: 'Our Commitments', body: ['We commit to accuracy, security, and fair dealing.'] }, { heading: 'Reserved Rights', body: ['We may refuse or cancel bookings that are fraudulent, unlawful, or breach our terms.'] }] },
  { slug: 'liability', title: 'Limitation of Liability', summary: 'The limits of our legal liability.', intro: 'This clause explains the extent of, and limits to, our liability to you, subject to your non-excludable statutory rights.', scope: 'It applies to all our services.', core: [{ heading: 'Our Role', body: ['As an intermediary, we are not liable for supplier acts or omissions beyond our reasonable control.'] }, { heading: 'Caps', body: ['Where liability is not excluded by law, it is limited to the value of the affected booking, save for death or personal injury caused by our negligence.'] }] },
  { slug: 'force-majeure', title: 'Force Majeure', summary: 'Events beyond reasonable control.', intro: 'Neither party is liable for failure to perform caused by events beyond reasonable control.', scope: 'It applies to all obligations under our terms.', core: [{ heading: 'Covered Events', body: ['These include natural disasters, war, civil unrest, epidemics, government action, and major infrastructure failure.'] }, { heading: 'Effect', body: ['Affected obligations are suspended; we will help you rebook or claim supplier refunds where possible.'] }] },
  { slug: 'third-party', title: 'Third-Party Services Policy', summary: 'How third-party services are handled.', intro: 'Our services rely on airlines, hotels, insurers, and technology providers, each operating under their own terms.', scope: 'It applies wherever third-party services are used.', core: [{ heading: 'Independent Providers', body: ['We select reputable providers but are not responsible for their independent conduct beyond our reasonable control.'] }] },
  { slug: 'copyright', title: 'Copyright Policy', summary: 'Ownership and permitted use of content.', intro: 'All content on our platform is protected by copyright and related rights.', scope: 'It applies to all site content.', core: [{ heading: 'Permitted Use', body: ['You may view and print content for personal, non-commercial use. Other use requires written permission.'] }, { heading: 'Takedown', body: ['We respond promptly to valid infringement notices.'] }] },
  { slug: 'intellectual-property', title: 'Intellectual Property Policy', summary: 'Trademarks, brand, and licensing.', intro: 'Our name, logo, and platform are protected intellectual property.', scope: 'It applies to all uses of our IP.', core: [{ heading: 'Trademarks', body: ['You may not use our marks without permission or in a way that implies endorsement.'] }] },
  { slug: 'anti-spam', title: 'Anti-Spam Policy', summary: 'Our commitment to permission-based communication.', intro: 'We send commercial messages only with a lawful basis and always provide an easy opt-out.', scope: 'It applies to all our communications.', core: [{ heading: 'Consent & Opt-out', body: ['You control marketing preferences in your account, and every marketing email includes an unsubscribe link.'] }] },
  { slug: 'dispute-resolution', title: 'Dispute Resolution', summary: 'How disputes are resolved.', intro: 'We prefer to resolve disputes amicably and quickly through direct discussion.', scope: 'It applies to disputes arising from our services.', core: [{ heading: 'Process', body: ['Raise the matter with support; if unresolved, we offer mediation before any formal proceedings. Governing law and venue are as stated in our Terms of Service.'] }] },
  { slug: 'service-termination', title: 'Service Termination Policy', summary: 'How accounts and services may end.', intro: 'This policy explains how you or we may end an account or service.', scope: 'It applies to all accounts.', core: [{ heading: 'By You', body: ['You may close your account at any time; existing bookings remain governed by their terms.'] }, { heading: 'By Us', body: ['We may suspend or terminate for breach, fraud, or legal reasons, with notice where practicable.'] }] },
  { slug: 'policy-updates', title: 'Policy Updates & Effective Date', summary: 'How and when our policies change.', intro: 'We maintain a clear record of policy versions and effective dates so you always know which terms apply.', scope: 'It applies to all our published policies.', core: [{ heading: 'Notification', body: ['Material changes are announced in advance by email or in-product notice. Version history is available on request.'] }] },
  { slug: 'accessibility', title: 'Accessibility Statement', summary: 'Our commitment to an inclusive experience.', intro: 'We are committed to making our platform usable by everyone, and we work towards WCAG 2.1 AA conformance.', scope: 'It applies to our websites and apps.', core: [{ heading: 'What We Do', body: ['We use semantic markup, keyboard navigation, sufficient contrast, and descriptive labels, and we test with assistive technologies.'] }, { heading: 'Feedback', body: [`If you encounter a barrier, contact ${SITE.supportEmail} and we will help and prioritise a fix.`] }] },
  { slug: 'code-of-conduct', title: 'Code of Conduct', summary: 'The standards we hold ourselves to.', intro: 'Our Code of Conduct sets the ethical standards expected of our staff and partners.', scope: 'It applies to everyone acting on our behalf.', core: [{ heading: 'Principles', body: ['We act with integrity, respect human rights, reject bribery and corruption, and protect customer data.'] }] },
  { slug: 'community-guidelines', title: 'Community Guidelines', summary: 'Rules for reviews and community content.', intro: 'These guidelines keep reviews and community contributions helpful, honest, and respectful.', scope: 'It applies to all user-generated content.', core: [{ heading: 'Be Genuine & Respectful', body: ['Share first-hand, honest experiences. No hate speech, harassment, or misleading content.'] }] },
  { slug: 'acceptable-use', title: 'Acceptable Use Policy', summary: 'Permitted and prohibited uses of our platform.', intro: 'This policy defines acceptable use to keep the platform safe and reliable for everyone.', scope: 'It applies to all users and integrations.', core: [{ heading: 'Prohibited Activities', body: ['No scraping, automated abuse, security circumvention, unlawful content, or interference with other users.'] }] },
  { slug: 'security-disclosure', title: 'Security Disclosure Policy', summary: 'How to report a security vulnerability.', intro: 'We welcome responsible disclosure of security issues and will not pursue good-faith researchers.', scope: 'It applies to our digital services.', core: [{ heading: 'Reporting', body: [`Email security@asiagrandtour.example with details and steps to reproduce. Please allow us reasonable time to remediate before public disclosure.`] }] },
  { slug: 'data-retention', title: 'Data Retention Policy', summary: 'How long we keep different categories of data.', intro: 'This policy sets retention periods aligned to legal, tax, and operational needs, after which data is deleted or anonymised.', scope: 'It applies to all personal and business data we hold.', core: [{ heading: 'Retention Schedule', body: ['Booking and financial records are typically kept for up to 7 years for tax and audit; marketing data until you opt out; support logs for up to 3 years.'] }] },
  { slug: 'gdpr', title: 'GDPR Compliance', summary: 'How we meet EU/UK data-protection law.', intro: 'For individuals in the EU/EEA and UK, we process personal data in accordance with the GDPR and UK GDPR.', scope: 'It applies to processing subject to those regulations.', core: [{ heading: 'Legal Bases & Rights', body: ['We rely on contract, legal obligation, legitimate interests, or consent, and we honour access, rectification, erasure, restriction, portability, and objection rights.'] }, { heading: 'International Transfers', body: ['Transfers outside the EEA/UK use appropriate safeguards such as Standard Contractual Clauses.'] }] },
  { slug: 'travel-disclaimer', title: 'International Travel Disclaimer', summary: 'Important limits on travel information we provide.', intro: 'Travel information such as entry rules and advisories is provided for general guidance and can change without notice.', scope: 'It applies to all destination and advisory content.', core: [{ heading: 'Verify Before You Travel', body: ['Always confirm entry, visa, and health requirements with official sources and your government travel advisory before booking and before departure.'] }], highlight: 'Entry requirements can change at short notice. You are responsible for meeting the requirements of every country on your itinerary, including transit points.' },
  { slug: 'health-disclaimer', title: 'Medical & Health Disclaimer', summary: 'Health information is not medical advice.', intro: 'Any health-related information we provide is general and not a substitute for professional medical advice.', scope: 'It applies to all health and vaccination content.', core: [{ heading: 'Consult a Professional', body: ['Consult a qualified healthcare provider or travel clinic regarding vaccinations, medication, and fitness to travel, especially for pre-existing conditions.'] }], highlight: 'We strongly recommend comprehensive travel insurance covering medical care and repatriation for every international trip.' },
]

for (const r of REMAINING) {
  POLICIES[r.slug] = makePolicy(r)
}

// ── About page ───────────────────────────────────────────────────────────────
export const ABOUT = {
  updated: UPDATED,
  intro: `Founded in ${SITE.founded} in Singapore, ${SITE.legalName} began with a simple conviction: that travel across Asia deserves the same craft, honesty, and care as the journeys themselves. What started as a small visa-assistance desk has grown into a full-service travel platform serving hundreds of thousands of travellers each year across flights, hotels, curated tours, and visa services — while keeping the attentive, human touch of our earliest days.`,
  sections: [
    { heading: 'Our Mission', body: 'To make considered, culturally-rich travel across Asia accessible, transparent, and effortless — removing the friction of paperwork, logistics, and uncertainty so travellers can focus on the experience.' },
    { heading: 'Our Vision', body: 'To become Asia’s most trusted travel companion: a platform where every itinerary is thoughtfully composed, every price is honest, and every traveller is treated as a guest rather than a transaction.' },
    { heading: 'Business Philosophy', body: 'We believe long-term trust beats short-term margin. We would rather lose a sale than mislead a customer, and we design our fees, policies, and communications to be legible at a glance. Good travel is repeat travel.' },
    { heading: 'Company History', body: `From a single Singapore office in ${SITE.founded}, we opened regional hubs across Southeast Asia, launched our online platform in 2015, introduced same-day visa document review in 2019, and now operate a 24-hour multilingual support centre serving travellers in eleven languages.` },
    { heading: 'Why Choose Us', body: 'Deep regional expertise, transparent all-in pricing, a genuine 24/7 support team, and a visa service with one of the industry’s highest first-attempt approval rates. We are specialists in Asia, not generalists everywhere.' },
    { heading: 'Service Commitments', body: 'Clear pricing before checkout, acknowledgement of every enquiry within two business days, refunds always to the original payment method, and honest advice even when it means recommending you wait or book elsewhere.' },
    { heading: 'Sustainability Initiatives', body: 'We publish carbon estimates on flight results, favour suppliers with credible environmental practices, fund reforestation in the Mekong region, and have removed single-use plastics from our own operations.' },
    { heading: 'Corporate Social Responsibility', body: 'Through the Grand Tour Foundation we fund tourism-skills training for young people in rural communities, support heritage-site preservation, and match staff volunteering hours with charitable donations.' },
  ],
  values: [
    { title: 'Honesty', body: 'Transparent pricing and straight answers, always.' },
    { title: 'Craft', body: 'Itineraries composed with care, not assembled by algorithm alone.' },
    { title: 'Respect', body: 'For our travellers, our partners, and the places we visit.' },
    { title: 'Reliability', body: 'A real team, awake around the clock, when plans change.' },
  ],
  team: [
    { name: 'Mei-Lin Tan', role: 'Founder & CEO', bio: 'Former destination guide who started the company to fix the visa paperwork she once dreaded.' },
    { name: 'Rahul Menon', role: 'Chief Operating Officer', bio: 'Twenty years in airline and OTA operations across the Asia-Pacific.' },
    { name: 'Sofia Reyes', role: 'Head of Customer Care', bio: 'Built our 24/7 multilingual support centre from a team of three.' },
    { name: 'Kenji Watanabe', role: 'Head of Product', bio: 'Leads the platform team, obsessed with clear pricing and fast search.' },
  ],
  awards: [
    'World Travel Excellence Award — Best Regional Travel Platform (2024)',
    'Asia Service Quality Gold Standard (2023, 2025)',
    'Great Place to Work™ Certified (2022–2026)',
    'Sustainable Tourism Commendation, Mekong Tourism Forum (2025)',
  ],
  partners: ['Star & Oneworld member airlines', 'Leading regional hotel groups', 'Licensed local tour operators in 13 countries', 'Globally recognised travel-insurance underwriters'],
  testimonials: [
    { quote: 'They caught a passport-validity issue that would have ended my trip at the gate. That is the whole ballgame.', author: 'Priya S., Singapore' },
    { quote: 'The visa help was worth every cent — approved on the first try, and someone actually answered the phone at 2am.', author: 'Daniel O., Manila' },
    { quote: 'Prices were exactly what I saw at checkout. No surprises. I have booked four trips with them since.', author: 'Hana K., Osaka' },
  ],
}

// ── Visa statistics (dashboard data — illustrative/reference only) ─────────────
export const STATS = {
  updated: UPDATED,
  headline: [
    { label: 'Applications assisted (2025)', value: '128,400' },
    { label: 'Average approval rate', value: '96.3%' },
    { label: 'Average processing time', value: '9 days' },
    { label: 'Destinations covered', value: '47' },
  ],
  byCountry: [
    { country: 'Japan', rate: 98, days: 6, apps: 21400 },
    { country: 'South Korea', rate: 97, days: 7, apps: 15200 },
    { country: 'Singapore', rate: 99, days: 3, apps: 9800 },
    { country: 'Australia', rate: 94, days: 12, apps: 13100 },
    { country: 'Schengen (Europe)', rate: 92, days: 15, apps: 18700 },
    { country: 'United States', rate: 88, days: 21, apps: 16900 },
    { country: 'Canada', rate: 91, days: 18, apps: 8600 },
    { country: 'United Kingdom', rate: 93, days: 14, apps: 7400 },
  ],
  monthly: [82, 78, 90, 95, 110, 128, 140, 135, 120, 105, 98, 130], // relative volume index
  byType: [
    { type: 'Tourist', share: 58 },
    { type: 'Business', share: 22 },
    { type: 'Student', share: 11 },
    { type: 'Transit', share: 6 },
    { type: 'Other', share: 3 },
  ],
  disclaimer: 'All statistics on this page are aggregated, rounded, and provided for reference and illustration only. They reflect historical applications assisted by us and are not a prediction or guarantee of any individual outcome. Visa decisions rest solely with the relevant government authority.',
}

// ── Travel magazine (20 articles) ──────────────────────────────────────────────
export interface Article {
  slug: string
  title: string
  subtitle: string
  summary: string
  author: string
  date: string
  minutes: number
  category: string
  tags: string[]
  image: string
  body: string[]
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop&auto=format`

const A = (
  slug: string,
  title: string,
  subtitle: string,
  category: string,
  author: string,
  date: string,
  minutes: number,
  tags: string[],
  imageId: string,
  summary: string,
  body: string[],
): Article => ({ slug, title, subtitle, summary, author, date, minutes, category, tags, image: img(imageId), body })

// Each article carries a genuine, multi-paragraph body.
const std = (place: string, extra: string[]): string[] => [
  `${place} rewards travellers who slow down. Beyond the landmark photographs lies a rhythm of daily life — markets opening at dawn, tea served without being asked, streets that change character between morning and midnight — and it is this rhythm, more than any single sight, that stays with you long after the flight home.`,
  ...extra,
  `Practicalities matter as much as inspiration. Check entry and visa requirements well ahead of departure, buy travel insurance that covers medical care and cancellation, and build a little slack into your itinerary — the best moments on any trip are rarely the ones you planned. Above all, travel with curiosity and respect for the people who call these places home.`,
]

export const ARTICLES: Article[] = [
  A('japan-travel-guide', 'A First-Timer’s Guide to Japan', 'From neon Tokyo to the quiet temples of Kyoto', 'Destinations', 'Kenji Watanabe', 'July 12, 2026', 9, ['Japan', 'Culture', 'City'], '1493976040374-85c8e12f0c0e', 'Everything a first-time visitor needs to move confidently through Japan — trains, etiquette, and the art of doing less.', std('Japan', ['Master the rail system early: a prepaid IC card opens most turnstiles, and the shinkansen turns a country into a series of easy day-trips. In Tokyo, alternate a headline district with a quiet one — pair Shibuya’s scramble with the hush of a backstreet shrine.', 'Kyoto asks for a gentler pace. Visit the famous temples at opening time, then spend the afternoon simply walking the Philosopher’s Path or losing an hour in a tea house. Etiquette is easy once you relax into it: be quiet on trains, remove your shoes when asked, and never tip.'])),
  A('south-korea', 'Seoul and Beyond', 'A country of contrasts, from palaces to pop culture', 'Destinations', 'Sofia Reyes', 'July 9, 2026', 8, ['South Korea', 'City', 'Food'], '1538485399081-7191377e8241', 'Palaces at dawn, night markets after dark, and the mountain temples most visitors miss.', std('South Korea', ['Begin in Seoul, where five-hundred-year-old palaces sit a subway stop from glass towers. Rent a hanbok to enter Gyeongbokgung for free, then eat your way through a night market as the neon comes on.', 'Then leave the capital. The temple-stay programmes near Gyeongju offer a night of monastic quiet, while Busan trades intensity for sea air and the best seafood on the peninsula.'])),
  A('europe', 'Slow Travel Through Europe', 'Why the train is the destination', 'Destinations', 'Mei-Lin Tan', 'July 5, 2026', 10, ['Europe', 'Rail', 'Slow travel'], '1503917988258-f87a78e3c995', 'Skip the checklist and let Europe’s rail network set the pace of your trip.', std('Europe', ['A single rail pass can carry you from Amsterdam’s canals to the Alps to the Adriatic without a single check-in queue. Book a window seat, watch the landscape rearrange itself, and arrive in a city centre rather than a distant airport.', 'Choose depth over breadth. Three cities in two weeks will teach you more than eight cities in the same time — and you will actually remember them.'])),
  A('united-states', 'The Great American Road Trip', 'Highways, national parks, and diner coffee', 'Destinations', 'Rahul Menon', 'June 30, 2026', 11, ['USA', 'Road trip', 'Nature'], '1469854523086-cc02fe5d8800', 'How to plan a cross-country drive that balances big landscapes with small towns.', std('the United States', ['The classic routes — Pacific Coast Highway, the desert Southwest loop, the Blue Ridge Parkway — each tell a different American story. Rent a comfortable car, download offline maps, and never pass an empty tank in remote country.', 'National parks reward early starts; arrive at sunrise to beat both crowds and heat. Between the headline parks, the small towns and roadside diners are where the trip becomes a story.'])),
  A('australia', 'Australia’s East Coast', 'Reef, rainforest, and easy city living', 'Destinations', 'Sofia Reyes', 'June 26, 2026', 9, ['Australia', 'Beach', 'Nature'], '1523482580672-f109ba8cb9be', 'From Sydney to the Great Barrier Reef, a route that mixes cities, coast, and coral.', std('Australia', ['Start in Sydney, walk the Bondi-to-Coogee coast path, then move north as the weather warms. Distances are long — consider a short domestic flight to save a full day of driving.', 'The Great Barrier Reef is best experienced with an operator committed to its protection; choose eco-certified tours and keep a respectful distance from the coral.'])),
  A('singapore', '48 Hours in Singapore', 'A garden city that runs like clockwork', 'Destinations', 'Kenji Watanabe', 'June 22, 2026', 6, ['Singapore', 'City', 'Food'], '1525625293386-3f8f99389edd', 'A tightly-planned two days through hawker centres, gardens, and skyline bars.', std('Singapore', ['Eat where locals queue: the hawker centres serve some of the world’s best food at some of its lowest prices. Chicken rice, laksa, and chilli crab are non-negotiable.', 'Balance the food with green space — the Gardens by the Bay and the Botanic Gardens — and end with a rooftop view as the humidity finally lifts after dark.'])),
  A('thailand', 'Thailand, North to South', 'Temples, street food, and island time', 'Destinations', 'Mei-Lin Tan', 'June 18, 2026', 9, ['Thailand', 'Beach', 'Food'], '1528181304800-259b08848526', 'A route that pairs Chiang Mai’s temples with the slow rhythm of the southern islands.', std('Thailand', ['Chiang Mai in the north is Thailand at its most gracious — temples, cooking classes, and cool-season mornings. Give it more days than the guidebooks suggest.', 'Then head south, but skip the busiest islands in favour of their quieter neighbours, where the beaches are just as fine and the pace far kinder.'])),
  A('maldives', 'The Maldives Without the Myths', 'Beyond the honeymoon brochure', 'Destinations', 'Sofia Reyes', 'June 14, 2026', 7, ['Maldives', 'Beach', 'Luxury'], '1514282401047-d79a71a590e8', 'How to choose an island, when to go, and how to travel responsibly in a fragile paradise.', std('the Maldives', ['Choosing an island is the whole decision: house-reef quality, distance from the airport, and whether you want a resort atoll or a local island with guesthouses all shape the trip.', 'The Maldives is on the front line of climate change; support resorts with genuine conservation programmes and reef-safe practices.'])),
  A('bali', 'Bali Beyond the Beaches', 'Rice terraces, temples, and craft villages', 'Destinations', 'Rahul Menon', 'June 10, 2026', 8, ['Bali', 'Culture', 'Nature'], '1537996194471-e657df975ab4', 'Trade the crowded south for Bali’s green heart of temples, terraces, and artisans.', std('Bali', ['Base yourself around Ubud to reach the rice terraces, water temples, and craft villages where silversmiths and woodcarvers still work by hand.', 'Rise before dawn at least once — the terraces in first light, before the tour buses, are the Bali the postcards promise.'])),
  A('switzerland', 'Switzerland by Rail', 'The most beautiful train rides in the world', 'Destinations', 'Kenji Watanabe', 'June 6, 2026', 9, ['Switzerland', 'Rail', 'Mountains'], '1530122037265-a5f1f91d3b99', 'Panoramic routes, alpine villages, and the logistics of a Swiss rail holiday.', std('Switzerland', ['The Glacier Express and Bernina line are justly famous, but even ordinary Swiss trains climb through scenery that would be a national park anywhere else.', 'A Swiss Travel Pass simplifies everything — trains, boats, and many mountain lifts on one ticket. Reserve panoramic routes in advance.'])),
  A('iceland', 'The Ring Road', 'Waterfalls, glaciers, and the northern lights', 'Destinations', 'Mei-Lin Tan', 'June 2, 2026', 10, ['Iceland', 'Nature', 'Road trip'], '1504893524553-b855bce32c67', 'A week-long loop around Iceland’s most dramatic landscapes, season by season.', std('Iceland', ['Iceland’s Ring Road circles the island in about a week, threading waterfalls, black-sand beaches, and glacier lagoons. Winter brings the aurora but demands respect for the weather.', 'Check road and weather conditions daily, never step off marked paths near geothermal areas, and give the landscape the caution it deserves.'])),
  A('canada', 'The Canadian Rockies', 'Turquoise lakes and endless mountains', 'Destinations', 'Sofia Reyes', 'May 28, 2026', 9, ['Canada', 'Nature', 'Mountains'], '1609825488888-3a766db05542', 'When to visit Banff and Jasper, and how to see them without the summer crush.', std('Canada', ['Banff and Jasper are the headliners, but the Icefields Parkway between them may be the most scenic drive on the continent. Go in the shoulder season for colour without the crowds.', 'Wildlife is genuinely wild here — keep your distance, store food properly, and carry bear spray on backcountry trails.'])),
  A('italy', 'Italy for the Senses', 'Food, art, and the slow south', 'Destinations', 'Rahul Menon', 'May 24, 2026', 10, ['Italy', 'Food', 'Culture'], '1529260830199-42c24126f198', 'A journey from Renaissance cities to the sun-slowed villages of the south.', std('Italy', ['The famous cities earn their fame, but Italy’s soul is in its regions — eat where the menu is short and in the local dialect, and let long lunches set the pace.', 'Head south past Rome for a gentler, cheaper, and often warmer Italy, where the coastline and the cooking are every bit as good.'])),
  A('france', 'France, City and Countryside', 'Paris, Provence, and everything between', 'Destinations', 'Mei-Lin Tan', 'May 20, 2026', 9, ['France', 'Culture', 'Food'], '1502602898657-3e91760cbb34', 'Balance a few Paris days with the lavender fields and markets of the south.', std('France', ['Give Paris its due — but by neighbourhood, not by monument. A morning market, a long café sit, and one great museum beat a checklist of sights.', 'Then take the fast train south to Provence, where village markets, vineyards, and lavender fields run to a slower clock.'])),
  A('vietnam', 'Vietnam from Top to Tail', 'Street food, karst bays, and motorbike mornings', 'Destinations', 'Kenji Watanabe', 'May 16, 2026', 9, ['Vietnam', 'Food', 'Nature'], '1528127269322-539801943592', 'A north-to-south route through Hanoi, Ha Long Bay, Hoi An, and the Mekong Delta.', std('Vietnam', ['Start in Hanoi’s tangle of old streets, cruise the karst islands of Ha Long or the quieter Lan Ha Bay, then work south to lantern-lit Hoi An.', 'Eat on the street without hesitation — a plastic stool and a bowl of pho is the truest meal in the country.'])),
  A('indonesia', 'Beyond Bali: Indonesia’s Islands', 'Volcanoes, dragons, and empty beaches', 'Destinations', 'Sofia Reyes', 'May 12, 2026', 10, ['Indonesia', 'Nature', 'Adventure'], '1596422846543-75c6fc197f07', 'Java’s volcanoes, Komodo’s dragons, and the reefs of an archipelago of 17,000 islands.', std('Indonesia', ['Climb to a sunrise over Java’s volcanoes, sail to see Komodo dragons in the wild, or dive reefs that rank among the richest on earth.', 'Domestic flights and ferries knit the archipelago together; leave generous connection times and expect the schedule to be a suggestion.'])),
  A('dubai', 'Dubai in Two Speeds', 'Futuristic skyline, ancient desert', 'Destinations', 'Rahul Menon', 'May 8, 2026', 7, ['Dubai', 'City', 'Luxury'], '1512453979798-5ea266f8880c', 'How to pair Dubai’s record-breaking architecture with the quiet of the desert.', std('Dubai', ['The city dazzles — the tallest tower, the biggest mall, the fastest everything — but time it right: mornings and evenings outdoors, middays in the air-conditioned interior.', 'Then leave the skyline behind for a desert night, where the dunes and the silence are the oldest attraction of all.'])),
  A('china', 'China’s Classic Route', 'Beijing, Xi’an, and the Yangtze', 'Destinations', 'Mei-Lin Tan', 'May 4, 2026', 11, ['China', 'Culture', 'History'], '1508804185872-d7badad00f7d', 'The Great Wall, the Terracotta Army, and a river that carries three thousand years of history.', std('China', ['The classic first trip links Beijing’s Great Wall and Forbidden City with Xi’an’s Terracotta Army and a cruise on the Yangtze — three thousand years in a fortnight.', 'High-speed rail makes the distances manageable; a translation app and a payment app installed before you arrive make daily life far easier.'])),
  A('taiwan', 'Taiwan’s Small-Island Charm', 'Night markets, mountains, and hot springs', 'Destinations', 'Kenji Watanabe', 'April 30, 2026', 8, ['Taiwan', 'Food', 'Nature'], '1470004914212-05527e49370b', 'Why Taiwan may be the friendliest, most underrated destination in Asia.', std('Taiwan', ['Taipei’s night markets are the obvious joy, but the island’s interior — marble gorges, tea-covered hills, and hot springs — is where it truly surprises.', 'The whole island is walkable, rail-connected, and famously friendly; a few words of thanks in Mandarin go a long way.'])),
  A('new-zealand', 'New Zealand’s Two Islands', 'Fiords, glaciers, and geothermal wonders', 'Destinations', 'Sofia Reyes', 'April 26, 2026', 10, ['New Zealand', 'Nature', 'Adventure'], '1507699622108-4be3abd695ad', 'How to split your time between the North and South Islands without rushing.', std('New Zealand', ['The South Island holds the postcard scenery — fiords, glaciers, and alpine lakes — while the North offers geothermal valleys, Maori culture, and gentler roads.', 'Distances look short on the map but bend through mountains; drive in daylight, and always leave room for the unplanned detour.'])),
]

// ── News ───────────────────────────────────────────────────────────────────────
export interface NewsItem {
  title: string
  category: string
  date: string
  body: string
}
export const NEWS_CATEGORIES = ['Latest News', 'Promotions', 'Visa Updates', 'Immigration Policies', 'Travel Alerts', 'Company Announcements', 'New Destinations', 'Seasonal Campaigns', 'Industry Insights']
export const NEWS: NewsItem[] = [
  { title: 'Japan extends visa-free entry pilot for select ASEAN passports', category: 'Visa Updates', date: 'July 24, 2026', body: 'Eligible travellers can now stay up to 30 days without a prior visa under an extended pilot. Our visa desk has updated its guidance and can confirm your eligibility before you book.' },
  { title: 'Monsoon travel advisory issued for parts of Southeast Asia', category: 'Travel Alerts', date: 'July 21, 2026', body: 'Heavier-than-usual rainfall is forecast across several regions. We recommend flexible fares this season and are waiving our own change fees on affected bookings.' },
  { title: 'Summer Escape sale: up to 25% off curated tours', category: 'Promotions', date: 'July 18, 2026', body: 'For a limited time, selected small-group tours across Japan, Vietnam, and Thailand are discounted. Promotional terms apply; see the offer page for details.' },
  { title: 'New destination: guided journeys through Bhutan', category: 'New Destinations', date: 'July 15, 2026', body: 'We have added licensed, all-inclusive itineraries to Bhutan, including the mandatory Sustainable Development Fee and local guide, arranged end to end.' },
  { title: 'Schengen introduces new digital entry system', category: 'Immigration Policies', date: 'July 11, 2026', body: 'A new pre-travel authorisation now applies to some visa-exempt visitors. Our team can prepare and check your application to avoid boarding-gate surprises.' },
  { title: 'We are hiring across our regional support hubs', category: 'Company Announcements', date: 'July 7, 2026', body: 'As demand grows, we are expanding our 24/7 multilingual care team in Singapore, Manila, and Bangkok. See careers for open roles.' },
  { title: 'Industry report: travellers prioritise flexibility over price', category: 'Industry Insights', date: 'July 3, 2026', body: 'Our annual survey finds free cancellation and responsive support now outrank headline price for most travellers — a shift we have built our policies around.' },
  { title: 'Autumn in Japan: early-bird foliage packages open', category: 'Seasonal Campaigns', date: 'June 29, 2026', body: 'Book now for the autumn-colour season in Kyoto and the Japanese Alps. Early-bird rates and preferred ryokan availability are limited.' },
]

// ── Sitemap ────────────────────────────────────────────────────────────────────
export const SITEMAP: { group: string; links: NavItem[] }[] = [
  { group: 'Explore', links: [{ slug: 'home', label: 'Home' }, { slug: 'destinations', label: 'Destinations' }, { slug: 'tours', label: 'Tours' }, { slug: 'flights', label: 'Flights' }, { slug: 'hotels', label: 'Hotels' }] },
  { group: 'Services', links: [{ slug: 'visa-terms', label: 'Visa Services' }, { slug: 'visa-statistics', label: 'Visa Statistics' }, { slug: 'help', label: 'Support' }, { slug: 'help', label: 'FAQs' }] },
  { group: 'Editorial', links: [{ slug: 'magazine', label: 'Travel Magazine (Blog)' }, { slug: 'news', label: 'News' }] },
  { group: 'Company', links: [{ slug: 'about', label: 'About' }, { slug: 'help', label: 'Contact' }] },
  { group: 'Legal', links: [{ slug: 'terms-of-service', label: 'Terms of Service' }, { slug: 'privacy-policy', label: 'Privacy Policy' }, { slug: 'cookie-policy', label: 'Cookie Policy' }, { slug: 'policy-updates', label: 'Policy Updates' }] },
]

// ── Help center ─────────────────────────────────────────────────────────────────
export const HELP = {
  channels: [
    { title: 'Live Chat', desc: 'Instant answers from our team, 24/7.', detail: 'Average response under 2 minutes.' },
    { title: 'Email Support', desc: `Write to ${SITE.supportEmail}.`, detail: 'Replies within 2 business days.' },
    { title: 'Hotline', desc: `Call ${SITE.hotline}.`, detail: 'Staffed around the clock in 11 languages.' },
    { title: 'Ticket System', desc: 'Track complex requests to resolution.', detail: 'Full history in your account.' },
  ],
  guides: [
    { title: 'Booking Guide', body: 'Search, compare, and confirm in a few steps. Review the full price and policy before you pay, then find every booking under "My Trips".' },
    { title: 'Payment Guide', body: 'We accept major cards and selected local methods via secure, PCI-DSS certified processors. Prices display in your chosen currency for convenience.' },
    { title: 'Refund Guide', body: 'Request refunds from "My Trips". Approved refunds return to your original payment method, typically within 5–15 business days.' },
    { title: 'Visa Application Guide', body: 'Upload your documents, let our specialists review them, and submit with confidence. We flag issues before they cost you a refusal.' },
    { title: 'Travel Insurance Guide', body: 'Choose cover for medical care, cancellation, and baggage. We strongly recommend insurance for every international trip.' },
    { title: 'Report a Problem', body: 'Use the "Report a Problem" form with your booking reference. Urgent, in-trip issues are prioritised by our 24/7 team.' },
  ],
  faqs: [
    { q: 'How do I change or cancel a booking?', a: 'Open "My Trips", select the booking, and choose Change or Cancel. Applicable fees are shown before you confirm, per the supplier’s rules and our Cancellation Policy.' },
    { q: 'When will I receive my refund?', a: 'Once approved, refunds are initiated within 7 business days and appear in 5–15 business days depending on your bank.' },
    { q: 'Do you guarantee my visa will be approved?', a: 'No. We improve the quality of your application, but the decision rests solely with the issuing authority. Our fee covers our professional service.' },
    { q: 'Is my payment secure?', a: 'Yes. Payments are handled by PCI-DSS certified processors and we never store full card numbers.' },
    { q: 'How do I contact a human quickly?', a: 'Live chat and our hotline are staffed 24/7. Have your booking reference ready for the fastest help.' },
  ],
}
