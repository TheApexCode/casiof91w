import React from 'react';
import { Download, Smartphone, CheckCircle, ExternalLink, X, PlusCircle, Share2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="pwa-install-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="pwa-install-modal-card"
        className="relative w-full max-w-md bg-[#181a20] border border-neutral-700/80 rounded-2xl p-6 shadow-2xl text-neutral-100 overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-pwa-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-black border border-neutral-700 p-1.5 shadow-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src="/pwa-192x192.png"
              alt="Casio F-91W Icon"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Install Casio F-91W</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                PWA Widget
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Classic digital watch widget on your phone screen
            </p>
          </div>
        </div>

        {/* Status: Already Installed */}
        {isInstalled ? (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-200">Already Installed on this Device!</p>
              <p className="text-emerald-400/80 mt-0.5">
                The Casio F-91W is installed in standalone mode. You can launch it directly from your home screen or app drawer.
              </p>
            </div>
          </div>
        ) : isInstallable ? (
          /* One-Click Native Prompt Button */
          <div className="mb-5 space-y-2">
            <button
              id="pwa-native-install-btn"
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Install to Phone Home Screen
            </button>
            <p className="text-[11px] text-center text-neutral-400">
              Installs as an authentic, full-screen standalone mobile app
            </p>
          </div>
        ) : null}

        {/* Step-by-Step Android / Mobile Instructions */}
        <div className="space-y-3 text-xs">
          <div className="font-semibold text-neutral-300 flex items-center gap-1.5 pb-1 border-b border-neutral-800">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>How to install on your Android phone:</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-neutral-200 font-medium">Open in Chrome or Samsung Internet</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Open this watch app link in your phone's browser.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-neutral-200 font-medium">Tap the Browser Menu (⋮) or Share</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Tap the three dots icon <span className="font-mono text-white bg-neutral-800 px-1 py-0.5 rounded">⋮</span> in Chrome, or the menu icon at the bottom.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-neutral-200 font-medium">Select &quot;Install app&quot; or &quot;Add to Home screen&quot;</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>. The Casio F-91W icon will be pinned directly onto your phone home screen!
                </p>
              </div>
            </div>
          </div>

          {/* iOS alternative tip */}
          <div className="pt-2 border-t border-neutral-800/80">
            <details className="group cursor-pointer">
              <summary className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center justify-between list-none">
                <span className="flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                  Installing on iPhone (iOS Safari)?
                </span>
                <span className="text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-[11px] text-neutral-400 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800 leading-relaxed">
                In Safari, tap the <strong>Share</strong> icon (box with upward arrow) at the bottom ➔ scroll down and tap <strong>Add to Home Screen</strong> ➔ tap <strong>Add</strong>.
              </p>
            </details>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-300 bg-neutral-900/40 p-2 rounded-lg border border-neutral-800/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Full Offline Support</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-300 bg-neutral-900/40 p-2 rounded-lg border border-neutral-800/60">
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>No Browser Bars</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            id="dismiss-pwa-modal-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
