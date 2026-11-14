import { Link } from "react-router-dom";
import { DraftPage, PageHero, Sheet } from "../../components/Draft/DraftPage";

const CARDS = [
  { id: "schedule-demo", title: "Technical demo", description: "A close look at how 1iQ's AI is built. Book a technical session with our engineering team.", cta: "Book a demo", href: "/schedule" },
  { id: "partnership-inquiry", title: "Strategic partnership", description: "Explore ways to integrate. Build the future of construction intelligence with us.", cta: "Explore a partnership", href: "/partnership-inquiry" },
  { id: "builder-application", title: "Developer program", description: "Join our early access program. Get SDK access, technical documentation and dedicated support.", cta: "Apply now", href: "/builder-application" },
];

const GetStarted = () => (
  <DraftPage>
    <PageHero narrow sheet="Sheet A1 · Developer access" note="Three paths" kicker="Get started" title="Developer access." lead="Choose how you want to connect to 1iQ's AI infrastructure platform." />
    <Sheet no="A2" name="Choose a path" note="Demo, partnership or program">
      <div className="p-grid p-grid--3">
        {CARDS.map((c, i) => (
          <Link key={c.id} id={c.id} to={c.href} className="p-cell">
            <span className="k">0{i + 1}</span>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <span className="p-go">{c.cta} →</span>
          </Link>
        ))}
      </div>
    </Sheet>
  </DraftPage>
);

export default GetStarted;
