import { DraftPage, PageHero } from "../../components/Draft/DraftPage";

const termsData = [
    {
        "title": "1. Agreement",
        "content": [
            "These Terms of Use (\"Terms\") govern your use of the 1iQ platform: the web app at app.1iq.ai, the 1iQ mobile apps and this website (the \"Service\"), provided by 1iQ LLC, a Wyoming limited liability company (\"1iQ\", \"we\", \"us\").",
            "By creating an account or using the Service you agree to these Terms. If you use the Service for a company, you confirm that you may accept these Terms for it, and \"Customer\" means that company. If Customer has signed an order form or agreement with 1iQ, that document controls where it differs from these Terms."
        ]
    },
    {
        "title": "2. The Service",
        "content": [
            "1iQ helps developers, owners and contractors run construction projects: schedules and forecasts, the field app, site intelligence, budgets and draws, reports, the 1iQ assistant and connections to other tools such as Procore.",
            "We improve the Service over time and may change features. We will not materially reduce the core features of a paid plan during its term without notice."
        ]
    },
    {
        "title": "3. Accounts",
        "content": [
            "Give accurate information, keep your password and sign in codes private, and tell us right away at admin@1iq.ai if you think your account was used without permission. You are responsible for activity under your account.",
            "Customer's administrators manage Customer's account: they invite and remove people, set roles and decide who sees which projects."
        ]
    },
    {
        "title": "4. Your data",
        "content": [
            "Customer owns the information it and its people put into the Service (\"Customer Data\"). Customer gives 1iQ permission to host, process and display Customer Data only to provide, secure, support and improve the Service. We may use aggregated information that does not identify Customer, its people or its projects to improve the Service.",
            "Customer is responsible for having the right to upload Customer Data and for its accuracy. Our Privacy Policy explains how we handle personal information."
        ]
    },
    {
        "title": "5. AI features, forecasts and estimates",
        "content": [
            "Forecast finish dates, delay cost estimates, weather and hazard alerts, cost escalation, pro forma results, risk ranges and answers from the 1iQ assistant are estimates based on the information available. They can be incomplete or wrong.",
            "They are not engineering, legal, financial, insurance or safety advice. Review them before you rely on them. You remain responsible for your decisions, schedules, contracts, payments and site safety. Changes to project dates suggested by 1iQ take effect only when a person approves them."
        ]
    },
    {
        "title": "6. Acceptable use",
        "content": [
            "Do not: break the law or infringe anyone's rights; try to reach another customer's data; probe, scan or test the Service's security without our written permission; interfere with or overload the Service; copy, scrape or resell the Service without an agreement with us; reverse engineer it except where the law allows; upload malicious code; or use the Service to build a competing product. Follow applicable export and sanctions laws."
        ]
    },
    {
        "title": "7. Other services",
        "content": [
            "If you connect another service, such as Procore, your use of it is governed by its own terms. Connecting it allows 1iQ to read and write the information your settings allow. We are not responsible for other services."
        ]
    },
    {
        "title": "8. Fees",
        "content": [
            "Paid plans are billed as stated in Customer's order form or in the plan chosen at sign up, in advance, plus applicable taxes. Fees are not refundable except as stated in the order form or where the law requires. If payment is late, we may suspend the Service after giving notice.",
            "Free trials and pilots are provided as they are, and may end."
        ]
    },
    {
        "title": "9. Confidentiality",
        "content": [
            "Each party will protect the other's confidential information with reasonable care and use it only for the purposes of these Terms. This does not cover information that is public, already known to the receiving party, or received lawfully from someone else."
        ]
    },
    {
        "title": "10. Our property",
        "content": [
            "1iQ owns the Service, its software and the 1iQ name and logos. These Terms do not transfer any of them to you. If you send us feedback, we may use it without obligation to you."
        ]
    },
    {
        "title": "11. Suspension and ending",
        "content": [
            "Customer may stop using the Service at any time. We may suspend or end access for a serious breach of these Terms, a security risk or nonpayment, with notice where reasonable.",
            "When an account ends, Customer may export its data for 30 days. After that we delete it as our Privacy Policy describes."
        ]
    },
    {
        "title": "12. Disclaimers",
        "content": [
            "We will provide the Service with reasonable skill and care. Apart from that, the Service is provided \"as is\" and \"as available\", and we do not promise that it will be uninterrupted or free of errors, to the extent the law allows."
        ]
    },
    {
        "title": "13. Limits on liability",
        "content": [
            "Neither party is liable for indirect, special or consequential damages, lost profits or revenue, or construction delay costs, liquidated damages or extended general conditions arising from use of the Service, even if told they were possible.",
            "Each party's total liability under these Terms is limited to the fees Customer paid to 1iQ in the 12 months before the claim, or 100 US dollars if Customer paid nothing. These limits do not apply to Customer's payment obligations, a breach of section 6, either party's obligations under section 14, or liability that cannot be limited by law."
        ]
    },
    {
        "title": "14. Claims by others",
        "content": [
            "Customer will defend 1iQ against claims by others arising from Customer Data or Customer's breach of section 6, and pay resulting costs and damages. 1iQ will defend Customer against claims by others that the Service infringes their intellectual property, and pay resulting costs and damages, as long as the claim does not come from Customer Data, a combination with something we did not provide, or a change we did not make."
        ]
    },
    {
        "title": "15. Law and disputes",
        "content": [
            "California law governs these Terms, without regard to its conflict of law rules. Before going to court, each party will try in good faith to resolve a dispute by talking for 30 days after written notice. Disputes will be heard in the state or federal courts in Los Angeles County, California, and both parties accept those courts' jurisdiction."
        ]
    },
    {
        "title": "16. Changes to these Terms",
        "content": [
            "We will post any change on this page with a new date. For significant changes we will give customers 30 days' notice by email or in the Service. Using the Service after a change takes effect means you accept it."
        ]
    },
    {
        "title": "17. General",
        "content": [
            "These Terms, any order form and our Privacy Policy are the whole agreement about the Service. Neither party may transfer these Terms without the other's consent, except in a merger, acquisition or sale of its business. Neither party is responsible for delays caused by events beyond its reasonable control. If a part of these Terms cannot be enforced, the rest stays in effect. Not enforcing a right is not a waiver of it. The parties are independent contractors. Notices to 1iQ go to admin@1iq.ai."
        ]
    },
    {
        "title": "18. Contact us",
        "content": [
            "1iQ LLC, admin@1iq.ai"
        ]
    }
];

const TermsOfUse = () => (
  <DraftPage>
    <PageHero narrow sheet="Sheet L1 · Terms of use" note="1iQ LLC" kicker="Legal" title="Terms of use." lead="Last updated: November 11, 2026" />
    <section className="d-sec paper">
      <div className="wrap">
        <div className="p-legal">
          {termsData.map((item) => {
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

export default TermsOfUse;
