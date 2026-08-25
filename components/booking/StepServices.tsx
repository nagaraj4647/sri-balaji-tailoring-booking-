'use client';

import React from 'react';
import { TAILORING_SERVICES } from '@/lib/constants';
import { ServiceItem } from '@/lib/types';
import { Check, Sparkles, Shirt, Wand2, Compass, Scissors } from 'lucide-react';

interface StepServicesProps {
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  onNext: () => void;
}

export const StepServices: React.FC<StepServicesProps> = ({
  selectedService,
  onSelectService,
  onNext,
}) => {
  const getIcon = (iconName: ServiceItem['iconName']) => {
    switch (iconName) {
      case 'blouse':
        return <Shirt className="w-5 h-5" />;
      case 'embroidery':
        return <Sparkles className="w-5 h-5" />;
      case 'design':
        return <Wand2 className="w-5 h-5" />;
      case 'consultation':
        return <Compass className="w-5 h-5" />;
      default:
        return <Scissors className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <span className="inline-block text-[11px] font-semibold tracking-widest text-gold-600 uppercase mb-1">
          Step 1 of 4
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
          Select Your Tailoring Service
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose the service you wish to book an appointment for.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
        {TAILORING_SERVICES.map((item) => {
          const isSelected = selectedService === item.name;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectService(item.name);
              }}
              className={`relative w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-4 shadow-sm ${
                isSelected
                  ? 'bg-maroon-900 text-cream-50 border-gold-400 ring-2 ring-gold-400/40 shadow-luxury scale-[1.01]'
                  : 'bg-white text-gray-800 border-cream-300 hover:border-gold-500/60 hover:bg-cream-50/80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-gold-500 text-maroon-950'
                      : 'bg-cream-100 text-maroon-800'
                  }`}
                >
                  {getIcon(item.iconName)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`font-serif text-lg font-bold ${
                        isSelected ? 'text-cream-50' : 'text-maroon-900'
                      }`}
                    >
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-gold-400 text-maroon-950'
                            : 'bg-maroon-100 text-maroon-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isSelected ? 'text-cream-200' : 'text-gray-600'
                    }`}
                  >
                    {item.description}
                  </p>
                  <div
                    className={`text-[11px] mt-2 font-medium ${
                      isSelected ? 'text-gold-300' : 'text-maroon-700'
                    }`}
                  >
                    ⏱ {item.estimatedTime}
                  </div>
                </div>
              </div>

              {/* Selection Checkmark Indicator */}
              <div className="mt-1">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-gold-400 border-gold-400 text-maroon-950'
                      : 'border-cream-300 bg-cream-50 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!selectedService}
          onClick={onNext}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-base tracking-wide flex items-center justify-center gap-2 shadow-luxury transition-all duration-200 ${
            selectedService
              ? 'maroon-gradient-bg text-cream-50 hover:brightness-110 active:scale-[0.99] border border-gold-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
          }`}
        >
          <span>Continue to Date Selection</span>
          <span className="text-gold-400 font-bold">→</span>
        </button>
      </div>
    </div>
  );
};
