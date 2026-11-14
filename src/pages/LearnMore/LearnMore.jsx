import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DraftPage, PageHero, Sheet } from "../../components/Draft/DraftPage";

const LearnMore = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    let live = true;
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.constructiondive.com%2Ffeeds%2Fnews")
      .then((r) => r.json())
      .then((data) => {
        if (!live || data.status !== "ok") return;
        const items = data.items.map((item) => {
          const text = (item.description || "").replace(/<[^>]*>/g, "");
          return {
            title: item.title,
            date: new Date(item.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            description: text.length > 100 ? text.substring(0, 100) + "..." : text,
            image: item.enclosure?.link || item.thumbnail || "",
            link: item.link,
          };
        });
        // whole rows of three only
        setNews(items.slice(0, items.length - (items.length % 3)));
      })
      .catch((e) => console.error("Error fetching news:", e));
    return () => { live = false; };
  }, []);

  return (
    <DraftPage>
      <PageHero
        sheet="Sheet R1 · Resources"
        note="For engineers and partners"
        kicker="Developer resources"
        title="Build the future."
        lead="We are building the infrastructure layer that turns scattered construction data into intelligent systems people can act on, at scale. Find technical documentation, industry news and ways to integrate here."
      />

      <Sheet no="R2" name="Two ways in" note="Engineers and partners">
        <div className="p-grid p-grid--2">
          <div className="p-cell">
            <span className="k">01 · Program</span>
            <h3>For developers and engineers</h3>
            <p>Building construction tech? Exploring AI applications? Working on data infrastructure at scale?</p>
            <p>Join our developer ecosystem. Get early API access and technical documentation, and work with our engineering team.</p>
            <span className="p-gap" />
            <Link to="/builder-application" className="pill pill--blue">Join the program</Link>
          </div>
          <div className="p-cell">
            <span className="k">02 · Partnerships</span>
            <h3>Technical partnerships</h3>
            <p>Strategic integrations with construction software providers, data platforms and AI infrastructure companies.</p>
            <p>Explore building together, white label solutions and revenue sharing partnerships.</p>
            <span className="p-gap" />
            <Link to="/partnership-inquiry" className="pill pill--white">Explore partnerships</Link>
          </div>
        </div>
      </Sheet>

      <Sheet no="R3" name="Integrate" note="Talk to the technical team" tone="paper">
        <div className="p-head">
          <div className="ruler" />
          <h2 className="h2">Ready to integrate?</h2>
          <p className="d-p">Talk with our technical team about API access, partnership opportunities and implementation roadmaps.</p>
          <div className="ctas">
            <Link to="/schedule" className="pill pill--blue pill--lg">Technical demo</Link>
            <Link to="/builder-application" className="pill pill--white pill--lg">Developer program</Link>
          </div>
        </div>
      </Sheet>

      {news.length > 0 && (
        <Sheet no="R4" name="Construction news" note="From Construction Dive">
          <div className="p-head">
            <div className="ruler" />
            <h2 className="h2">Latest construction news.</h2>
          </div>
          <div className="p-news">
            {news.map((a) => (
              <article key={a.link}>
                {a.image && <div className="p-news__img"><img src={a.image} alt="" loading="lazy" onError={(e) => { e.target.parentNode.style.display = "none"; }} /></div>}
                <div className="p-news__body">
                  <span className="k">Construction Dive · {a.date}</span>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                  <a href={a.link} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              </article>
            ))}
          </div>
        </Sheet>
      )}
    </DraftPage>
  );
};

export default LearnMore;
