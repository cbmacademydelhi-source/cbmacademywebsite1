import React from 'react';
import { AI_TOOLS } from '../data/cbmData';
import {
  Bot,
  Image as ImageIcon,
  LineChart,
  Search,
  Layers,
  Cpu,
} from 'lucide-react';

const aiIconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-7 h-7 text-[#FF6B00]" />,
  Image: <ImageIcon className="w-7 h-7 text-[#FF6B00]" />,
  LineChart: <LineChart className="w-7 h-7 text-[#FF6B00]" />,
  Search: <Search className="w-7 h-7 text-[#FF6B00]" />,
  Layers: <Layers className="w-7 h-7 text-[#FF6B00]" />,
  Cpu: <Cpu className="w-7 h-7 text-[#FF6B00]" />,
};

export const AITools: React.FC = () => {
  return (
    <section
      id="ai-tools"
      className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-100">
            Enterprise Tool Stack
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
            Industry-Standard AI & Marketing Tools
          </h2>

          <p className="text-slate-600 text-base leading-relaxed">
            Hands-on training with premium tools used by top agencies and growth teams.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {AI_TOOLS.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center cbm-shadow cbm-shadow-hover transition-all duration-200 hover:border-[#FF6B00]/40 hover:-translate-y-1 group min-h-[150px]"
            >

              {/* Tool Logo / Icon */}
              <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {aiIconMap[tool.icon] || (
                  <Cpu className="w-7 h-7 text-[#FF6B00]" />
                )}
              </div>

              {/* Tool Name ONLY */}
              <h3 className="text-lg font-bold text-[#072B57]">
                {tool.name}
              </h3>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};
