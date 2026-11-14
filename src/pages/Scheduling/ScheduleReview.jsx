import GuidePage from "./GuidePage";
import { REVIEW_FAQ } from "../../content/scheduleFaqs";

// For developers and owners: how to test a contractor's schedule before it becomes the baseline.
const GUIDE = {
  code: "S", audience: "Construction schedule review (developers and owners)",
  sheet: "Sheet S1 · Construction schedule review", note: "For developers and owners", kicker: "Construction schedule review",
  title: "Test the construction schedule before you sign it.",
  lead: "The schedule you accept becomes the record every delay, claim and payment is measured against. Here is what to check in it, what to negotiate with the result, and a scorecard you can run on the file today.",
  answerNote: "What a schedule review is", answerQ: "What is a construction schedule review?",
  answer: "A construction schedule review tests whether a schedule can be trusted before it becomes the baseline. It checks that every activity is tied to the work before and after it, that the critical path runs unbroken to the finish, and that the finish date comes from the logic and not from a date typed in by hand.",
  checksName: "What to check", checksNote: "Six things, in order", checksTitle: "Six things to check before the schedule becomes the baseline.",
  checksLead: "None of these question how long the builder says the work will take. They ask whether the schedule will tell you the truth once work starts.",
  checks: [
    ["Every activity is tied in", "Each activity should have work that comes before it and work that follows it. An activity with an open end can slip without moving anything else.", "Ask for the open ends to be closed before you sign."],
    ["The critical path reaches the finish", "The longest chain of dependent work should run unbroken from the start to the completion date. If it stops short, the finish date is not being driven by the work.", "Ask to be walked through the critical path, activity by activity."],
    ["No dates are forced by hand", "Hard constraints pin an activity to a date whatever happens before it. They make a schedule look on time when the logic says otherwise.", "Ask why each forced date is there, and have the ones that are not contractual removed."],
    ["The finish matches the logic", "Recalculate the schedule and compare the finish with the one in the file. A gap means the date you were shown is not the date the plan produces.", "Negotiate from the date the logic gives."],
    ["Procurement and inspections are in", "Long lead items and inspections decide when work can really start and close. A schedule without them is a best case.", "Ask for long lead items and inspections to appear as their own activities."],
    ["Float is believable", "Float is the room an activity has before it delays the finish. Very high float usually means missing links. Negative float means the plan already misses its date.", "Agree up front who owns the float."],
  ],
  scoreTitle: "Score the schedule in about a minute.",
  scoreLead: "Upload the file the contractor sent you. 1iQ recalculates it and runs the quality checks. You get a short scorecard to take into the conversation.",
  useName: "What to negotiate", useNote: "Before the contract closes", useTitle: "What to do with the result.",
  use: [
    ["Before you sign", "Agree the fixes", "Share the problems and ask for a corrected schedule. It is a reasonable request while both sides still want the deal to close, and a builder with a sound plan will welcome it."],
    ["In the contract", "Record the baseline", "Name the agreed schedule as the baseline in the contract, with its completion date. Every later change is then measured against one record both sides accepted."],
    ["For the life of the job", "Agree how progress is reported", "Settle how often the schedule is updated and what counts as evidence of a delay. Disputes are shorter when the record was agreed before anything went wrong."],
  ],
  afterTitle: "A reviewed schedule is only useful if someone keeps checking it against the site.",
  after: [
    "Inside 1iQ the agreed schedule becomes the baseline, and it stays fixed. Next to it sit two more dates: the working schedule, which moves only with approval, and the forecast, which is worked out from what has really happened on site.",
    "When something slips, you see it the moment it happens, along with what it does to the finish and what it costs to carry. Nothing moves a planned date without a project manager approving it.",
    "The full review also lists every finding with the activities involved, checks the plan against local weather and public holidays, and prepares a corrected copy you can send back.",
  ],
  other: ["/preconstruction-scheduling", "For contractors: preconstruction scheduling"],
  faq: REVIEW_FAQ,
  closeTitle: "See the full review on your own schedule.",
  closeText: "Bring a schedule to a private briefing. We will run the full review with you and show how it is tracked once work starts.",
};

const ScheduleReview = () => <GuidePage g={GUIDE} />;
export default ScheduleReview;
