import React, { useState } from 'react';
import { LcdScreen } from './LcdScreen';
import { WatchState } from '../types';

interface CasioF91WProps {
  watchState: WatchState;
  currentDisplayTime: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    dayOfWeek: number;
    date: number;
    month: number;
  };
  onButtonPress: (button: 'A' | 'B' | 'C') => void;
  onButtonRelease?: (button: 'A' | 'B' | 'C') => void;
  onButtonHoldStart?: (button: 'A' | 'B' | 'C') => void;
  onButtonHoldEnd?: (button: 'A' | 'B' | 'C') => void;
  onToggleLightLock?: () => void;
  onTriggerTestMode?: () => void;
  showStrap?: boolean;
  scale?: 'normal' | 'widget' | 'compact';
}

export const CasioF91W: React.FC<CasioF91WProps> = ({
  watchState,
  currentDisplayTime,
  onButtonPress,
  onButtonRelease,
  onButtonHoldStart,
  onButtonHoldEnd,
  onToggleLightLock,
  showStrap = true,
  scale = 'normal',
}) => {
  const [pressedBtn, setPressedBtn] = useState<'A' | 'B' | 'C' | null>(null);

  const handlePointerDown = (btn: 'A' | 'B' | 'C') => {
    setPressedBtn(btn);
    onButtonPress(btn);
    if (onButtonHoldStart) {
      onButtonHoldStart(btn);
    }
  };

  const handlePointerUp = (btn: 'A' | 'B' | 'C') => {
    if (pressedBtn === btn) {
      setPressedBtn(null);
    }
    if (onButtonRelease) {
      onButtonRelease(btn);
    }
    if (onButtonHoldEnd) {
      onButtonHoldEnd(btn);
    }
  };

  // Case color variants
  const getCaseTheme = () => {
    switch (watchState.caseColorway) {
      case 'vintage-gold':
        return {
          caseBg: 'bg-gradient-to-b from-[#e2c179] via-[#cb9e47] to-[#9e7628]',
          caseBorder: 'border-[#7a5818]',
          bezelBg: 'bg-[#15130f]',
          textGold: 'text-[#f0cf85]',
          lineColor: 'border-[#cb9e47]',
        };
      case 'army-green':
        return {
          caseBg: 'bg-gradient-to-b from-[#3d4b3b] via-[#313c2f] to-[#242c22]',
          caseBorder: 'border-[#1b221a]',
          bezelBg: 'bg-[#161a16]',
          textGold: 'text-[#e5b352]',
          lineColor: 'border-[#2d6898]',
        };
      case 'silver-steel':
        return {
          caseBg: 'bg-gradient-to-b from-[#e0e3e6] via-[#bcc2c7] to-[#8d959c]',
          caseBorder: 'border-[#626a71]',
          bezelBg: 'bg-[#141618]',
          textGold: 'text-[#dfb256]',
          lineColor: 'border-[#2968a3]',
        };
      case 'classic-black':
      default:
        return {
          caseBg: 'bg-gradient-to-b from-[#22252a] via-[#1a1c20] to-[#121316]',
          caseBorder: 'border-[#0a0b0d]',
          bezelBg: 'bg-[#101216]',
          textGold: 'text-[#e6ad35]',
          lineColor: 'border-[#2060b0]',
        };
    }
  };

  const theme = getCaseTheme();

  return (
    <div className="relative flex flex-col items-center justify-center select-none max-w-full">
      {/* Top Strap (shown in full watch view) */}
      {showStrap && (
        <div className="relative w-44 sm:w-52 h-20 sm:h-24 -mb-3 flex flex-col items-center overflow-hidden z-0">
          <div className="w-full h-full bg-[#17191d] border-x border-[#0e1013] shadow-inner relative flex flex-col justify-end">
            {/* Strap ribbing texture */}
            <div className="w-full h-2.5 bg-[#121316] border-y border-white/5 my-0.5" />
            <div className="w-full h-2.5 bg-[#121316] border-y border-white/5 my-0.5" />
            <div className="w-full h-3 bg-[#121316] border-y border-white/5 my-0.5" />
            <div className="w-full h-3.5 bg-[#131518] border-y border-white/5 my-0.5" />
            {/* Lug pins */}
            <div className="w-full h-3 bg-gradient-to-b from-[#101214] to-[#1e2025]" />
          </div>
        </div>
      )}

      {/* Main Watch Case Unit */}
      <div className="relative z-10 flex items-center justify-center">
        {/* ================= BUTTON A: LIGHT (Top Left) ================= */}
        <div className="absolute -left-3.5 sm:-left-4 top-[24%] z-20">
          <button
            id="f91w-button-a"
            type="button"
            aria-label="Light Button (Button A)"
            onPointerDown={() => handlePointerDown('A')}
            onPointerUp={() => handlePointerUp('A')}
            onPointerLeave={() => handlePointerUp('A')}
            onContextMenu={(e) => {
              e.preventDefault();
              if (onToggleLightLock) onToggleLightLock();
            }}
            className={`w-4 sm:w-5 h-7 sm:h-8 rounded-l-md bg-gradient-to-r from-[#888e96] via-[#cfd4da] to-[#60656c] border border-black/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),-2px_2px_4px_rgba(0,0,0,0.6)] cursor-pointer active:translate-x-1.5 transition-transform duration-75 flex items-center justify-center ${
              pressedBtn === 'A' ? 'translate-x-1.5' : ''
            }`}
            title="Button A: LIGHT / LAP / RESET (Right click to lock backlight)"
          >
            <div className="w-[1.5px] h-4 bg-black/40 rounded-full" />
          </button>
        </div>

        {/* ================= BUTTON B: MODE (Bottom Left) ================= */}
        <div className="absolute -left-3.5 sm:-left-4 bottom-[24%] z-20">
          <button
            id="f91w-button-b"
            type="button"
            aria-label="Mode Button (Button B)"
            onPointerDown={() => handlePointerDown('B')}
            onPointerUp={() => handlePointerUp('B')}
            onPointerLeave={() => handlePointerUp('B')}
            className={`w-4 sm:w-5 h-7 sm:h-8 rounded-l-md bg-gradient-to-r from-[#888e96] via-[#cfd4da] to-[#60656c] border border-black/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),-2px_2px_4px_rgba(0,0,0,0.6)] cursor-pointer active:translate-x-1.5 transition-transform duration-75 flex items-center justify-center ${
              pressedBtn === 'B' ? 'translate-x-1.5' : ''
            }`}
            title="Button B: MODE (Time -> Alarm -> Stopwatch -> Setting)"
          >
            <div className="w-[1.5px] h-4 bg-black/40 rounded-full" />
          </button>
        </div>

        {/* ================= BUTTON C: ALARM/START-STOP (Bottom Right) ================= */}
        <div className="absolute -right-3.5 sm:-right-4 bottom-[24%] z-20">
          <button
            id="f91w-button-c"
            type="button"
            aria-label="Alarm/Start-Stop Button (Button C)"
            onPointerDown={() => handlePointerDown('C')}
            onPointerUp={() => handlePointerUp('C')}
            onPointerLeave={() => handlePointerUp('C')}
            className={`w-4 sm:w-5 h-7 sm:h-8 rounded-r-md bg-gradient-to-l from-[#888e96] via-[#cfd4da] to-[#60656c] border border-black/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),2px_2px_4px_rgba(0,0,0,0.6)] cursor-pointer active:-translate-x-1.5 transition-transform duration-75 flex items-center justify-center ${
              pressedBtn === 'C' ? '-translate-x-1.5' : ''
            }`}
            title="Button C: 12/24H / ALARM ON-OFF / START-STOP (Hold for CASIo easter egg!)"
          >
            <div className="w-[1.5px] h-4 bg-black/40 rounded-full" />
          </button>
        </div>

        {/* ================= OCTAGONAL RESIN BEZEL & CASE ================= */}
        <div
          id="f91w-case"
          className={`relative w-[310px] sm:w-[350px] p-4 sm:p-5 rounded-[28px] border-2 shadow-[0_18px_38px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.18)] ${theme.caseBg} ${theme.caseBorder}`}
          style={{
            clipPath:
              'polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)',
          }}
        >
          {/* Authentic Corner Chamfer Screws */}
          <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-[#3a3f47] border border-black/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-[0.5px] bg-black/80" />
          </div>
          <div className="absolute top-2 right-6 w-2 h-2 rounded-full bg-[#3a3f47] border border-black/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-[0.5px] bg-black/80" />
          </div>
          <div className="absolute bottom-2 left-6 w-2 h-2 rounded-full bg-[#3a3f47] border border-black/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-[0.5px] bg-black/80" />
          </div>
          <div className="absolute bottom-2 right-6 w-2 h-2 rounded-full bg-[#3a3f47] border border-black/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-[0.5px] bg-black/80" />
          </div>

          {/* INNER FACEPLATE (Silkscreen graphics) */}
          <div
            id="f91w-faceplate"
            className={`relative rounded-[16px] p-3 sm:p-3.5 border border-black/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] ${theme.bezelBg}`}
          >
            {/* Outer Blue Pinstripe Frame */}
            <div className="relative border-[1.5px] border-[#2262b8] rounded-[10px] p-1.5 sm:p-2">
              {/* Inner Gold Frame */}
              <div className="relative border border-[#d6a538] rounded-[6px] p-1 bg-black/20">
                {/* ================= HEADER GRAPHICS ================= */}
                <div className="flex items-center justify-between px-1 mb-1.5">
                  {/* Brand & Model */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-white font-sans font-black text-sm sm:text-base tracking-widest leading-none drop-shadow-sm">
                      CASIO
                    </span>
                    <span className="text-white/90 font-mono font-bold text-xs sm:text-[13px] tracking-tight leading-none">
                      F-91W
                    </span>
                  </div>

                  {/* Gold Alarm Chronograph */}
                  <div className="text-right">
                    <span
                      className={`text-[8.5px] sm:text-[9.5px] font-sans font-bold tracking-tight uppercase leading-none ${theme.textGold}`}
                    >
                      ALARM CHRONOGRAPH
                    </span>
                  </div>
                </div>

                {/* Sub-header text: WATER RESIST RED BADGE */}
                <div className="flex items-center justify-between px-1 mb-1">
                  <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-sans font-bold text-white/70">
                    <span className="text-white font-mono">◄</span>
                    <span className="text-white tracking-wider">LIGHT</span>
                  </div>

                  {/* Red WATER RESIST pill */}
                  <div className="bg-[#b91c1c] border border-white/60 px-1.5 py-[1px] rounded-[3px] shadow-sm">
                    <span className="text-white font-sans font-black text-[7.5px] sm:text-[8.5px] tracking-tight uppercase leading-none block">
                      WATER RESIST
                    </span>
                  </div>
                </div>

                {/* ================= LCD SCREEN UNIT ================= */}
                <div className="my-1">
                  <LcdScreen
                    watchState={watchState}
                    currentDisplayTime={currentDisplayTime}
                    scale={scale}
                  />
                </div>

                {/* ================= FOOTER GRAPHICS & LABELS ================= */}
                <div className="flex items-center justify-between px-1 mt-1.5 text-[8px] sm:text-[9px] font-sans font-bold text-white">
                  {/* Bottom-Left: MODE label with arrow */}
                  <div className="flex items-center gap-1 text-white/80">
                    <span className="text-white font-mono">◄</span>
                    <span className="tracking-wider">MODE</span>
                  </div>

                  {/* Center: WATER RESIST 30M */}
                  <div className="text-center text-[7px] sm:text-[8px] text-[#3b82f6] font-mono tracking-tighter">
                    WATER RESIST
                  </div>

                  {/* Bottom-Right: ALARM ON-OFF / 24HR label with arrow */}
                  <div className="flex items-center gap-1 text-right text-white/80">
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-[7px] sm:text-[8px] text-white">
                        ALARM ON·OFF
                      </span>
                      <span className={`text-[7px] sm:text-[8px] ${theme.textGold}`}>
                        24HR / START·STOP
                      </span>
                    </div>
                    <span className="text-white font-mono">►</span>
                  </div>
                </div>

                {/* Bottom microscopic authentic "JAPAN U" print */}
                <div className="text-center mt-1">
                  <span className="text-[6.5px] text-white/30 font-mono tracking-widest uppercase">
                    JAPAN U
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strap (shown in full watch view) */}
      {showStrap && (
        <div className="relative w-44 sm:w-52 h-24 sm:h-28 -mt-3 flex flex-col items-center overflow-hidden z-0">
          <div className="w-full h-full bg-[#17191d] border-x border-[#0e1013] shadow-inner relative flex flex-col justify-start">
            {/* Lug pins */}
            <div className="w-full h-3 bg-gradient-to-b from-[#1e2025] to-[#101214]" />
            {/* Strap ribbing texture */}
            <div className="w-full h-3.5 bg-[#131518] border-y border-white/5 my-0.5" />
            <div className="w-full h-3 bg-[#121316] border-y border-white/5 my-0.5" />
            <div className="w-full h-2.5 bg-[#121316] border-y border-white/5 my-0.5" />
            {/* Strap holes */}
            <div className="w-full flex justify-center gap-3 mt-3">
              <div className="w-2.5 h-1.5 bg-[#0a0b0d] rounded-sm border border-white/5" />
              <div className="w-2.5 h-1.5 bg-[#0a0b0d] rounded-sm border border-white/5" />
            </div>
            <div className="w-full flex justify-center gap-3 mt-2.5">
              <div className="w-2.5 h-1.5 bg-[#0a0b0d] rounded-sm border border-white/5" />
              <div className="w-2.5 h-1.5 bg-[#0a0b0d] rounded-sm border border-white/5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
