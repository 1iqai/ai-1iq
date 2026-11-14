import GuidePage from "./GuidePage";
import { PRECON_FAQ } from "../../content/scheduleFaqs";

// For contractors: a bid schedule that holds up when the owner's team reviews it.
const GUIDE = {
  code: "C", audience: "Preconstruction scheduling (contractors)",
  sheet: "Sheet C1 · Preconstruction scheduling", note: "For contractors", kicker: "Preconstruction scheduling",
  title: "Submit a bid schedule that holds up in review.",
  lead: "Owners compare bids on price, on the finish date and on how believable that date is. Here is what their reviewers look for, and a scorecard to check your schedule before it goes out.",
  answerNote: "What preconstruction scheduling is", answerQ: "What is preconstruction scheduling?",
  answer: "Preconstruction scheduling is building the project schedule before work starts: the activities, how long each takes, the order they depend on, and the finish date that results. It is the schedule you submit with the bid, and the one that becomes the baseline once the job is yours.",
  checksName: "What reviewers look for", checksNote: "Six things, in order", checksTitle: "Six things an owner's reviewer will look for.",
  checksLead: "None of these second guess your durations. They test whether the finish date is the result of the plan.",
  checks: [
    ["Every activity is tied in", "Each activity needs work before it and work after it. Open ends are the first thing a reviewer counts.", "Close them before you submit."],
    ["The critical path reaches the finish", "The longest chain of dependent work should run unbroken to completion, and it should read like the way you would really build the job.", "Be ready to walk through it."],
    ["No dates are forced by hand", "Hard constraints make the schedule look on time whatever the logic says, and reviewers know it.", "Keep only the dates the contract fixes."],
    ["The finish matches the logic", "If the schedule is recalculated and the finish moves, the date on your bid is not the date your plan supports.", "Recalculate before you send it."],
    ["Procurement and inspections are in", "Long lead items and inspections show you have planned for what really drives the dates.", "Give them their own activities."],
    ["Float is believable", "Very high float reads as missing links. Negative float says the plan already misses its date.", "Fix the links instead of hiding the float."],
  ],
  scoreTitle: "Check your schedule before it goes out.",
  scoreLead: "Upload your schedule. 1iQ recalculates it and runs the same quality checks an owner's reviewer would. Fix what it finds, then submit.",
  useName: "Why it matters", useNote: "At bid and after award", useTitle: "What a clean schedule does for you.",
  use: [
    ["At bid", "A date the owner can believe", "When the logic holds, the finish date is the result of a plan. That is easier to defend in an interview than a date with nothing under it."],
    ["In review", "Fewer questions", "Schedules with open ends and forced dates come back with questions. A clean one moves through review and keeps your bid in front."],
    ["After award", "A baseline that protects you", "When the schedule both sides agreed is on record, a delay caused by a late decision or a change shows with its date and its cause."],
  ],
  afterTitle: "After award, the plan stays yours.",
  after: [
    "When a project runs on 1iQ, your schedule comes in as the baseline. Your durations are your call. 1iQ checks the links and the order of work so the schedule can be tracked honestly, and it does not rewrite your plan.",
    "From then on, progress is recorded against the baseline you agreed. Work you have earned stays earned, and nothing moves a planned date without a project manager approving it.",
    "Because every change carries a time and a name, questions about who caused a delay are settled from the record instead of from memory.",
  ],
  other: ["/construction-schedule-review", "For developers: construction schedule review"],
  faq: PRECON_FAQ,
  closeTitle: "See how your schedule is tracked after award.",
  closeText: "Bring a schedule to a private briefing. We will run the full review with you and show what the owner sees once work starts.",
};

const Preconstruction = () => <GuidePage g={GUIDE} />;
export default Preconstruction;
