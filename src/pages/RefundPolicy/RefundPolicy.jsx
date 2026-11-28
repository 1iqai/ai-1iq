import { DraftPage, PageHero } from "../../components/Draft/DraftPage";

/**
 * Refunds and cancellation (/refund-policy). Required before sign up opens: Stripe expects a published
 * policy, the app stores expect one, and the sign up terms box links to it (VITE_REFUND_URL in the app).
 *
 * Every rule here matches what the billing code actually does, which is the point of writing it down.
 * The one place the code does not act on its own is the 3D setup fee: turning the add on off inside seven
 * days raises a notice telling the owner to contact 1iQ, and a person decides. Section 5 says that plainly
 * rather than promising an automatic refund the system would not make.
 */

const refundData = [
  {
    title: "1. What this covers",
    content: [
      "This policy explains when 1iQ refunds money and how to cancel. It applies to everything bought from 1iQ LLC through app.1iq.ai: the monthly charge for a project, the 3D space model and its setup, and a single schedule analysis.",
      "Where Customer has signed an order form with 1iQ, that document controls where it differs from this policy. Nothing here takes away a right you have under the law of your country or state.",
    ],
  },
  {
    title: "2. How billing works",
    content: [
      "1iQ is billed monthly in advance. There is no annual commitment, no minimum term and no fee to start or to stop.",
      "You are charged for each project that is running, at the price set by that project's budget. Add a project and it starts billing. Mark a project complete and it stops billing at once, while staying readable along with its reports and history. Nothing you have put into 1iQ is deleted because a project stopped billing.",
    ],
  },
  {
    title: "3. Cancelling",
    content: [
      "The Account Owner can cancel at any time from the billing page, which opens the payment portal. No call, no notice period and no form to fill in.",
      "Cancelling stops the next charge. The month you have already paid for runs to the end of its period and your team keeps full use of 1iQ until then. We do not charge a part month on the way out and we do not refund a part month either.",
      "If you only want to stop paying for one project rather than leave, mark that project complete. It stops billing immediately and everyone keeps access to it.",
    ],
  },
  {
    title: "4. Monthly fees",
    content: [
      "Monthly fees are not refunded for a period that has already started, including a period you did not use much. This is the normal rule for a monthly service you can cancel at any time, and it is why there is no commitment longer than a month.",
      "We do refund in full, without argument, where 1iQ charged you in error: a duplicate charge, a charge after you cancelled, a charge for a project that was already complete, or a price that does not match the one you were shown. Write to admin@1iq.ai and we will put it right.",
    ],
  },
  {
    title: "5. The 3D space model",
    content: [
      "The monthly fee for the 3D space model follows the same rule as any other monthly fee. Turn the add on off and it stops at the end of the period you have paid for. Your model is kept rather than deleted, and turning it back on later does not charge a second setup fee.",
      "The setup fee is a single charge for building the model from your plan set, and our team starts that work when it is paid. If you turn the add on off within seven days of the setup charge, 1iQ does not refund it automatically. The app tells you to contact us, and a person looks at it: if we have not started building your model we refund the setup in full, and if we have started we refund what is left after the work already done.",
      "A revised plan set is charged at 25 percent of the setup and follows the same rule.",
    ],
  },
  {
    title: "6. A single schedule analysis",
    content: [
      "The quick scorecard is free and needs no account.",
      "A full schedule analysis is bought one at a time and the work is delivered as soon as it runs, so it is not refunded once you have the result. If it fails to produce a result, you are not charged, and if you are charged anyway we refund it in full.",
      "If a project goes live on 1iQ within 30 days of a paid analysis, that amount comes off your first invoice. You do not have to ask for this and it is not a refund: it is a credit applied automatically.",
    ],
  },
  {
    title: "7. Founding prices",
    content: [
      "The first 50 companies to start a subscription keep founding prices for as long as they stay with 1iQ. A founding place is taken when a subscription starts, not when an account is created.",
      "If you cancel before any invoice is paid, the place goes back and someone else can take it. If you cancel after paying and come back later, the place is gone and list prices apply, so the founding price holds while you stay rather than forever.",
    ],
  },
  {
    title: "8. If a payment fails",
    content: [
      "We email the Account Owner and the card is retried. For fourteen days everything keeps working exactly as before.",
      "After fourteen days the web app becomes read only for that company: you can still view everything, run reports and export. The field app keeps recording work the whole time, so your crews are never blocked and the job record stays complete. Nothing is ever deleted for an unpaid bill.",
      "Paying restores everything at once. We do not charge a fee to reinstate an account.",
    ],
  },
  {
    title: "9. If 1iQ is at fault",
    content: [
      "If 1iQ is unavailable for a long period through our own fault, write to us and we will credit the affected part of your month. We would rather you asked than quietly left.",
    ],
  },
  {
    title: "10. How to ask",
    content: [
      "Email admin@1iq.ai from the address on the account, with the company name and what you would like refunded. We answer within three business days and pay approved refunds back to the original card, usually within five to ten business days depending on your bank.",
      "1iQ LLC, 312 W. 2nd St, #1931, Casper, WY 82601.",
    ],
  },
];

const RefundPolicy = () => (
  <DraftPage>
    <PageHero narrow sheet="Sheet L3 · Refunds and cancellation" note="1iQ LLC" kicker="Legal" title="Refunds and cancellation." lead="Last updated: November 25, 2026" />
    <section className="d-sec paper">
      <div className="wrap">
        <div className="p-legal">
          {refundData.map((item) => {
            const [, no, name] = /^(\d+)\.\s*(.*)$/.exec(item.title) || [null, "", item.title];
            return (
              <div key={item.title}>
                <h2><i>{no.padStart(2, "0")}</i><span>{name}</span></h2>
                <div>{(item.content || []).map((para, i) => <p key={i}>{para}</p>)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  </DraftPage>
);

export default RefundPolicy;
