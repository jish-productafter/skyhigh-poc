"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  activeLevel: string | null;
  activeSection: string | null;
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeLevel,
  activeSection,
  onBack,
}) => {
  return (
    <div className="w-full flex justify-center pt-6 pb-4">
      <div className="max-w-6xl w-full px-4">
        <div className="bg-gray-200 rounded-2xl px-6 py-3 border-2 border-slate-700 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-xl font-black text-slate-700 uppercase tracking-wide">
              GOETHE EXAM TRAINER
            </h1>
          </div>
        </div>
        {(activeLevel || activeSection) && (
          <div className="flex justify-end mt-4 relative z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBack();
              }}
              className="px-4 py-2 bg-gray-200/80 backdrop-blur-sm text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300/80 transition flex items-center border border-gray-300 relative z-20"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {activeSection
                ? "Back to Sections"
                : activeLevel === "Basic"
                ? "Back to Selection"
                : "Change Level"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
