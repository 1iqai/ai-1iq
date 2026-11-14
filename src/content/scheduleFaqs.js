// Questions and answers on the two scheduling pages. They show on the page and are also given to search
// engines and AI assistants as structured data (src/seo.js), so each answer has to stand on its own.

export const REVIEW_FAQ = [
  ["What is a construction schedule review?",
    "A construction schedule review tests whether a contractor's schedule can be trusted before it becomes the baseline. It checks that every activity is tied to the work before and after it, that the critical path runs unbroken to the finish, and that the finish date comes from the logic and not from a date typed in by hand."],
  ["Why should a developer or owner review the schedule before signing?",
    "Once the contract is signed, the schedule becomes the record every delay, claim and payment is measured against. A schedule with gaps in its logic can hide a slip for weeks. Reviewing it first lets you agree the fixes while both sides still want the deal to close."],
  ["What is the DCMA 14 point schedule assessment?",
    "It is a set of 14 quality checks first published by the United States Defense Contract Management Agency. It looks at things like missing logic, leads, lags, hard constraints, high float, negative float and overlong durations. It is widely used on large projects as a common yardstick for schedule quality."],
  ["Which schedule files can 1iQ read?",
    "Primavera P6 files (.xer and .xml), Microsoft Project XML files, and Excel or CSV sheets."],
  ["Does 1iQ judge the contractor's durations?",
    "No. The contractor owns the plan and its durations. 1iQ checks that the schedule can be tracked truthfully: the links, the order of work and the path to the finish. Durations, float and lags are shown but are not held against the schedule."],
  ["What does the free scorecard show, and what does the full review add?",
    "The scorecard shows a score out of 100, how many quality checks passed, and the three biggest problems by name. The full review inside 1iQ lists every finding with the activities involved, adds site conditions such as weather and public holidays, prepares a corrected copy, and brings the agreed schedule in to be tracked against what really happens on site."],
  ["Is my schedule kept after it is scored?",
    "No. The file is read to work out the score and is not saved. Your work email is kept so the 1iQ team can follow up."],
];

export const PRECON_FAQ = [
  ["What is preconstruction scheduling?",
    "Preconstruction scheduling is building the project schedule before work starts: the activities, how long each takes, the order they depend on, and the finish date that results. It is the schedule a contractor submits with a bid and the one that becomes the baseline once the job is awarded."],
  ["How does a strong schedule help win a bid?",
    "Owners compare bids on price, on finish date and on how believable that date is. A schedule where every activity is linked and the critical path holds together shows the date is the result of a plan. It also draws fewer questions in review, which keeps your bid moving."],
  ["What do owners look for in a bid schedule?",
    "A complete chain of logic from start to finish, a critical path that makes sense, no dates forced by hand, time for procurement and inspections, and a finish that matches the logic. Many use the DCMA 14 point assessment as the checklist."],
  ["Will 1iQ change my durations or my plan?",
    "No. The plan is yours. 1iQ checks the links and the order of work so the schedule can be tracked honestly. Durations, float and lags are your call and are not held against the schedule."],
  ["How does an agreed baseline protect the contractor later?",
    "When the schedule both sides agreed is recorded as the baseline, later changes are measured against it. A delay caused by a late decision or a change shows up with its date and its cause, so the conversation is about facts instead of memory."],
  ["Which schedule files can I upload?",
    "Primavera P6 files (.xer and .xml), Microsoft Project XML files, and Excel or CSV sheets, up to 10 MB."],
  ["Is my schedule kept after it is scored?",
    "No. The file is read to work out the score and is not saved. Your work email is kept so the 1iQ team can follow up."],
];
