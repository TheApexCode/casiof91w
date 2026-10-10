import React from 'react';
import { WatchMode } from '../types';

interface GuideProps {
  currentMode: WatchMode;
  onSelectMode: (mode: WatchMode) => void;
  onTriggerCasioEasterEgg: () => void;
  onTriggerTestMode: () => void;
  onClose: () => void;
}

export const WatchControlsGuide: React.FC<GuideProps> = ({
  currentMode,
  onSelectMode,
  onTriggerCasioEasterEgg,
  onTriggerTestMode,
  onClose,
}) => {
  return (
    <div
      id="f91w-guide-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1a1c22] border border-neutral-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl text-neutral-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-widest text-lg">CASIO</span>
              <span className="bg-[#b91c1c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">F-91W</span>
              <span className="text-xs text-neutral-400 font-mono">MODULE 593</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Official Operation & Functionality Manual</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close Guide"
          >
            ✕
          </button>
        </div>

        {/* The 3 Buttons Map */}
        <div className="my-4 p-3 bg-[#111317] rounded-xl border border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Button Configuration
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
              <div className="font-bold text-emerald-400">Button A (Top Left)</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">LIGHT / LAP / RESET</div>
              <div className="text-[10px] text-neutral-500 mt-1">Hold or press to activate backlight. In Stopwatch: Split/Reset. In Setting: shifts field.</div>
            </div>
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
              <div className="font-bold text-blue-400">Button B (Bottom Left)</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">MODE SELECTION</div>
              <div className="text-[10px] text-neutral-500 mt-1">Cycles: Timekeeping ➔ Alarm (AL) ➔ Stopwatch (ST) ➔ Time Setting.</div>
            </div>
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
              <div className="font-bold text-amber-400">Button C (Bottom Right)</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">12/24H / ALARM / START-STOP</div>
              <div className="text-[10px] text-neutral-500 mt-1">Toggle 12/24H. In Alarm: toggle chime/alarm. In Stopwatch: Start/Stop. Hold 3s for CASIo egg!</div>
            </div>
          </div>
        </div>

        {/* Operating Instructions */}
        <div className="space-y-3 text-xs">
          {/* 1. Timekeeping & 12/24H */}
          <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
            <div className="font-bold text-white flex items-center justify-between">
              <span>1. Normal Timekeeping & 12/24H Toggle</span>
              <span className="text-[10px] text-neutral-400">Mode: Normal</span>
            </div>
            <p className="text-neutral-400 mt-1">
              Press <strong className="text-amber-400">Button C</strong> in normal time mode to toggle between 12-Hour format (with PM indicator) and 24-Hour format (with 24H symbol).
            </p>
          </div>

          {/* 2. Daily Alarm & Hourly Chime */}
          <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
            <div className="font-bold text-white flex items-center justify-between">
              <span>2. Daily Alarm & Hourly Chime Operation</span>
              <button
                type="button"
                onClick={() => onSelectMode('ALARM')}
                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-blue-300 px-2 py-0.5 rounded cursor-pointer"
              >
                Go to Alarm Mode
              </button>
            </div>
            <ul className="text-neutral-400 mt-1 space-y-1 list-disc pl-4">
              <li>Press <strong className="text-blue-400">Button B</strong> once to enter Alarm Mode (<code className="text-neutral-200">AL</code>).</li>
              <li>Press <strong className="text-amber-400">Button C</strong> to cycle states: <em>Alarm ON</em> ➔ <em>Chime ON</em> ➔ <em>Both ON</em> ➔ <em>Both OFF</em>.</li>
              <li>Press <strong className="text-emerald-400">Button A</strong> to enter setting mode (Hours flash). Advance with Button C. Press A again to set Minutes. Press B to exit.</li>
              <li>When the alarm rings, press any button to silence it.</li>
            </ul>
          </div>

          {/* 3. Stopwatch / Chronograph */}
          <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
            <div className="font-bold text-white flex items-center justify-between">
              <span>3. Stopwatch / Chronograph (1/100 sec)</span>
              <button
                type="button"
                onClick={() => onSelectMode('STOPWATCH')}
                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-blue-300 px-2 py-0.5 rounded cursor-pointer"
              >
                Go to Stopwatch Mode
              </button>
            </div>
            <ul className="text-neutral-400 mt-1 space-y-1 list-disc pl-4">
              <li>Press <strong className="text-blue-400">Button B</strong> twice to enter Stopwatch Mode (<code className="text-neutral-200">ST</code>).</li>
              <li><strong>Elapsed Time:</strong> Press C (Start) ➔ Press C (Stop) ➔ Press A (Reset).</li>
              <li><strong>Split Time:</strong> Press C (Start) ➔ Press A (Split, <code className="text-neutral-200">SPL</code> flashes) ➔ Press A (Release split) ➔ Press C (Stop) ➔ Press A (Reset).</li>
              <li>Continues measuring in background if you navigate to other modes!</li>
            </ul>
          </div>

          {/* 4. Famous Easter Eggs & Diagnostic Tests */}
          <div className="p-3 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/20 rounded-lg border border-amber-900/40">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>★ Secret Easter Eggs (Authentic F-91W!)</span>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-amber-900/30">
                <div>
                  <span className="font-semibold text-white">The Famous &ldquo;CASIo&rdquo; Authenticity Screen:</span>
                  <p className="text-[11px] text-neutral-400">
                    Hold <strong className="text-amber-400">Button C</strong> for 3 seconds in Normal Time mode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onTriggerCasioEasterEgg}
                  className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                >
                  Test &ldquo;CASIo&rdquo;
                </button>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-neutral-800">
                <div>
                  <span className="font-semibold text-white">LCD All-Segments Diagnostic Test:</span>
                  <p className="text-[11px] text-neutral-400">
                    Press Buttons A + B + C together to light up all 88:88:88 LCD bars.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onTriggerTestMode}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                >
                  Test Segments
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-white text-neutral-900 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Got it, Return to Watch
          </button>
        </div>
      </div>
    </div>
  );
};
