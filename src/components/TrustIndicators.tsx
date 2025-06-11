
const TrustIndicators = () => {
  const companies = [
    "Shopify", "Klarna", "Riot Games", "Vanta", "Bumble", "Canva"
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-slate-500 mb-8 text-lg">
          Trusted by data teams at
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-slate-100 px-6 py-3 rounded-lg">
                <span className="text-slate-600 font-medium">{company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
