import React from "react";

interface Tool {
  name: string;
  logo: string;
}

const tools: Tool[] = [
  {
    name: "GitHub",
    logo: "https://cdn.simpleicons.org/github",
  },
  {
    name: "Supabase",
    logo: "https://cdn.simpleicons.org/supabase",
  },
  {
    name: "Google AI",
    logo: "https://cdn.simpleicons.org/google",
  },
  {
    name: "Gemini",
    logo: "https://cdn.simpleicons.org/googlegemini",
  },
  {
    name: "ChatGPT",
    logo: "https://cdn.simpleicons.org/openai",
  },
  {
    name: "Claude",
    logo: "https://cdn.simpleicons.org/anthropic",
  },
  {
    name: "Midjourney",
    logo: "https://cdn.simpleicons.org/midjourney",
  },
  {
    name: "Notion",
    logo: "https://cdn.simpleicons.org/notion",
  },
  {
    name: "Semrush",
    logo: "https://cdn.simpleicons.org/semrush",
  },
  {
    name: "Meta AI",
    logo: "https://cdn.simpleicons.org/meta",
  },
  {
    name: "Canva",
    logo: "https://cdn.simpleicons.org/canva",
  },
  {
    name: "Google Analytics",
    logo: "https://cdn.simpleicons.org/googleanalytics",
  },
  {
    name: "Shopify",
    logo: "https://cdn.simpleicons.org/shopify",
  },
  {
    name: "Google Search Console",
    logo: "https://cdn.simpleicons.org/googlesearchconsole",
  },
  {
    name: "WordPress",
    logo: "https://cdn.simpleicons.org/wordpress",
  },
];

export const AITools: React.FC = () => {
  return (
    <section
      id="ai-tools"
      className="py-12 lg:py-16 bg-[#F8FAFC] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-9">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-100 mb-3">
            AI & Marketing Tools
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
            Industry-Standard AI & Marketing Tools
          </h2>

          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Hands-on training with the tools used by modern agencies,
            marketers and growth teams.
          </p>
        </div>

        {/* 15 Tools */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group bg-white rounded-xl border border-slate-200
              min-h-[112px] sm:min-h-[120px]
              px-3 py-4
              flex flex-col items-center justify-center
              text-center
              shadow-sm
              transition-all duration-200
              hover:-translate-y-1
              hover:shadow-md
              hover:border-orange-200"
            >
              {/* Logo */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14
                rounded-xl bg-white
                border border-slate-100
                flex items-center justify-center
                mb-2.5
                p-2
                group-hover:scale-105
                transition-transform duration-200"
              >
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Tool Name */}
              <h3 className="text-xs sm:text-sm font-bold text-[#072B57] leading-tight">
                {tool.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
