import React from 'react';
import { MapPin, X, Navigation, ShieldCheck } from 'lucide-react';

interface LocationPromptModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

export const LocationPromptModal: React.FC<LocationPromptModalProps> = ({
  isOpen,
  onAllow,
  onDismiss
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="location-permission-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        id="location-permission-dialog"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-prompt-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Close Button */}
        <button
          id="location-prompt-close-btn"
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Dismiss location request"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Icon Badge */}
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
            <MapPin className="w-6 h-6" />
          </div>

          {/* Heading & Text */}
          <h2
            id="location-prompt-title"
            className="text-lg font-bold text-slate-900 mb-2 tracking-tight"
          >
            Allow Location Access?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Aditya Campus AI can use your approximate campus location to provide accurate walking directions to classrooms, hostels, sports arenas, and bus transit points at Surampalem.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Used strictly on your device for on-campus navigation assistance.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              id="location-prompt-dismiss-btn"
              type="button"
              onClick={onDismiss}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Not Now
            </button>
            <button
              id="location-prompt-allow-btn"
              type="button"
              onClick={onAllow}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-sm transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Allow Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
