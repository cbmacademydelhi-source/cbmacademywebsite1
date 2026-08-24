import React from 'react';
import { AI_TOOLS } from '../data/cbmData';
import { Bot, Image as ImageIcon, LineChart, Search, Layers, Cpu, Check } from 'lucide-react';

const aiIconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-6 h-6 text-[#FF6B00]" />,
  Image: <ImageIcon className="w-6 h-6 text-[#FF6B00]" />,
  LineChart: <LineChart className="w-6 h-6 text-[#FF6B00]" />,
  Search: <Search className="w-6 h-6 text-[#FF6B00]" />,
  Layers: <Layers className="w-6 h-6 text-[#FF6B00]" />,
  Cpu: <Cpu className="w-6 h-6 text-[#FF6B00]" />,
};

export const AITools: React.FC = () => {
  return (
    <section id="ai-tools" className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-200">
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

        {/* Minimal White-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_TOOLS.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between cbm-shadow cbm-shadow-hover transition-all duration-200 hover:border-slate-300 group"
            >
              <div>
                {/* Header: Icon, Name & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {aiIconMap[tool.icon] || <Cpu className="w-6 h-6 text-[#FF6B00]" />}
                  </div>
                  <span className="text-[11px] font-bold text-[#072B57] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {tool.badge}
                  </span>
                </div>

                {/* Tool Title & Category */}
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-[#072B57]">
                    {tool.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#FF6B00]">
                    {tool.category}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Capabilities list */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {tool.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Use Case */}
              <div className="mt-5 pt-3 border-t border-slate-100 bg-[#F8FAFC] -mx-6 -mb-6 p-4 rounded-b-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  CBM Practical Application:
                </span>
                <p className="text-xs text-slate-700 font-medium leading-snug">
                  {tool.useCase}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
