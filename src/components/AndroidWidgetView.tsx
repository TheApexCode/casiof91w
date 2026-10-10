import React, { useState } from 'react';
import { CasioF91W } from './CasioF91W';
import { WatchState } from '../types';
import {
  Wifi,
  Battery,
  Search,
  Mic,
  Camera,
  MessageSquare,
  Phone,
  Globe,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Smartphone,
  Watch,
  Maximize2,
  Layers,
  Palette,
  Sun,
  Flame,
  Download,
} from 'lucide-react';

interface AndroidWidgetViewProps {
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
  onToggleSound: () => void;
  onToggleLightLock: () => void;
  onSetBacklightColor: (color: WatchState['backlightColor']) => void;
  onSetCaseColorway: (color: WatchState['caseColorway']) => void;
  onSetViewLayout: (layout: WatchState['viewLayout']) => void;
  onOpenGuide: () => void;
  onOpenInstall?: () => void;
  onTriggerCasioEasterEgg: () => void;
  onTriggerTestMode: () => void;
}

const WALLPAPERS = [
  {
    id: 'cyber-dark',
    name: 'Pixel Obsidian',
    bg: 'radial-gradient(circle at 50% 20%, #2b323c 0%, #171a21 50%, #0d0f14 100%)',
  },
  {
    id: 'sunset-dune',
    name: 'Desert Dusk',
    bg: 'linear-gradient(135deg, #1b263b 0%, #415a77 40%, #778da9 70%, #e0a96d 100%)',
  },
  {
    id: 'emerald-aurora',
    name: 'Northern Aurora',
    bg: 'radial-gradient(ellipse at 70% 30%, #1b4332 0%, #081c15 60%, #050e0a 100%)',
  },
  {
    id: 'vapor-retro',
    name: 'Retro 1989',
    bg: 'linear-gradient(180deg, #13091f 0%, #2c1654 45%, #602568 85%, #88397a 100%)',
  },
];

export const AndroidWidgetView: React.FC<AndroidWidgetViewProps> = ({
  watchState,
  currentDisplayTime,
  onButtonPress,
  onButtonRelease,
  onButtonHoldStart,
  onButtonHoldEnd,
  onToggleSound,
  onToggleLightLock,
  onSetBacklightColor,
  onSetCaseColorway,
  onSetViewLayout,
  onOpenGuide,
  onOpenInstall,
  onTriggerCasioEasterEgg,
  onTriggerTestMode,
}) => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(WALLPAPERS[0].id);
  const [widgetStyle, setWidgetStyle] = useState<'case' | 'material'>('case');
  const [showColorMenu, setShowColorMenu] = useState(false);

  const activeWall = WALLPAPERS.find((w) => w.id === selectedWallpaper) || WALLPAPERS[0];

  const formattedHours = String(currentDisplayTime.hours).padStart(2, '0');
  const formattedMinutes = String(currentDisplayTime.minutes).padStart(2, '0');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Quick Control Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 mb-4 p-2.5 bg-[#17191e] border border-neutral-800 rounded-xl text-xs text-neutral-300 shadow-md">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => onSetViewLayout('android-phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              watchState.viewLayout === 'android-phone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="View as Android Mobile Homescreen Widget"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android Phone Widget</span>
            <span className="sm:hidden">Android</span>
          </button>

          <button
            type="button"
            onClick={() => onSetViewLayout('watch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              watchState.viewLayout === 'watch'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="View as Classic Full Wrist Watch"
          >
            <Watch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Watch (Strap)</span>
            <span className="sm:hidden">Watch</span>
          </button>

          <button
            type="button"
            onClick={() => onSetViewLayout('minimal-widget')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              watchState.viewLayout === 'minimal-widget'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Clean Standalone Widget"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Standalone Widget</span>
            <span className="sm:hidden">Widget</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              watchState.soundEnabled
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title={watchState.soundEnabled ? 'Piezo Sound: ON' : 'Piezo Sound: MUTED'}
          >
            {watchState.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{watchState.soundEnabled ? 'Piezo ON' : 'Muted'}</span>
          </button>

          {/* Micro-light Lock */}
          <button
            type="button"
            onClick={onToggleLightLock}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              watchState.lightLocked
                ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Toggle Continuous Backlight (or click/hold Button A)"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{watchState.lightLocked ? 'Light: LOCKED' : 'Light: Tap/Hold'}</span>
          </button>

          {/* Backlight Glow Style */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorMenu(!showColorMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs font-medium cursor-pointer text-neutral-300"
              title="Change Case Color & Backlight LED"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme</span>
            </button>

            {/* Dropdown Menu */}
            {showColorMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-[#1a1c22] border border-neutral-700 rounded-xl p-3 shadow-2xl z-50 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="font-semibold text-neutral-200 mb-1.5">Case Edition</div>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSetCaseColorway('classic-black');
                      setShowColorMenu(false);
                    }}
                    className={`p-1.5 rounded border text-left cursor-pointer ${
                      watchState.caseColorway === 'classic-black'
                        ? 'border-blue-500 bg-blue-950/40 text-white font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Classic Black
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetCaseColorway('vintage-gold');
                      setShowColorMenu(false);
                    }}
                    className={`p-1.5 rounded border text-left cursor-pointer ${
                      watchState.caseColorway === 'vintage-gold'
                        ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Vintage Gold
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetCaseColorway('army-green');
                      setShowColorMenu(false);
                    }}
                    className={`p-1.5 rounded border text-left cursor-pointer ${
                      watchState.caseColorway === 'army-green'
                        ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Military Olive
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetCaseColorway('silver-steel');
                      setShowColorMenu(false);
                    }}
                    className={`p-1.5 rounded border text-left cursor-pointer ${
                      watchState.caseColorway === 'silver-steel'
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Silver Chrome
                  </button>
                </div>

                <div className="font-semibold text-neutral-200 mb-1.5">LED Backlight</div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSetBacklightColor('authentic-green');
                      setShowColorMenu(false);
                    }}
                    className={`w-full p-1.5 rounded border text-left flex items-center justify-between cursor-pointer ${
                      watchState.backlightColor === 'authentic-green'
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <span>Faint Green Side LED (Original)</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetBacklightColor('teal-illuminator');
                      setShowColorMenu(false);
                    }}
                    className={`w-full p-1.5 rounded border text-left flex items-center justify-between cursor-pointer ${
                      watchState.backlightColor === 'teal-illuminator'
                        ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <span>Teal / Cyan Illuminator</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetBacklightColor('amber');
                      setShowColorMenu(false);
                    }}
                    className={`w-full p-1.5 rounded border text-left flex items-center justify-between cursor-pointer ${
                      watchState.backlightColor === 'amber'
                        ? 'border-amber-500 bg-amber-950/30 text-amber-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <span>Vintage Amber</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guide / Manual Button */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs font-medium cursor-pointer text-neutral-300"
            title="Open Casio F-91W Operating Manual & Easter Eggs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Manual</span>
          </button>

          {/* Install on Phone PWA Button */}
          {onOpenInstall && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 border border-blue-500/50 hover:border-blue-400 rounded-lg text-xs font-semibold cursor-pointer text-blue-300 hover:text-white shadow-sm transition"
              title="Install Casio F-91W App on your Android / iOS phone"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Install on Phone</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Display Area */}
      {watchState.viewLayout === 'android-phone' ? (
        /* ================= ANDROID MOBILE PHONE VIEWPORT ================= */
        <div className="relative flex flex-col items-center w-full">
          {/* Android Smartphone Chassis */}
          <div
            id="android-phone-frame"
            className="relative w-full max-w-[390px] h-[780px] rounded-[44px] border-[10px] border-[#202228] shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_0_4px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage: activeWall.bg,
            }}
          >
            {/* Front Camera Hole Punch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border border-neutral-800 z-40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#152538]" />
            </div>

            {/* Android Status Bar */}
            <div className="relative z-30 w-full pt-3 px-6 flex items-center justify-between text-white text-[12px] font-medium tracking-tight">
              <span>{`${formattedHours}:${formattedMinutes}`}</span>
              <div className="flex items-center gap-1.5 text-white/90">
                <span className="text-[10px] font-bold">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">94%</span>
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Android Home Screen Content */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-start pt-6 px-4">
              {/* Android Widget Header / Tag */}
              <div className="w-full flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    Casio F-91W Widget • 4×2
                  </span>
                  {onOpenInstall && (
                    <button
                      type="button"
                      onClick={onOpenInstall}
                      className="flex items-center gap-1 text-[10px] font-semibold text-blue-300 hover:text-white bg-blue-600/30 hover:bg-blue-600/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-blue-400/30 transition shadow-sm cursor-pointer"
                      title="Install to your actual phone home screen"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>Install App</span>
                    </button>
                  )}
                </div>
                {/* Wallpaper toggle pill */}
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-white/70">
                  <Layers className="w-3 h-3" />
                  <select
                    value={selectedWallpaper}
                    onChange={(e) => setSelectedWallpaper(e.target.value)}
                    className="bg-transparent text-white text-[10px] focus:outline-none cursor-pointer"
                  >
                    {WALLPAPERS.map((wall) => (
                      <option key={wall.id} value={wall.id} className="bg-neutral-900 text-white">
                        {wall.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* THE CASIO F-91W WIDGET ON HOMESCREEN */}
              <div
                id="casio-f91w-android-widget"
                className="w-full p-2 rounded-[28px] bg-black/25 backdrop-blur-md border border-white/15 shadow-[0_12px_28px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center my-auto transition-transform"
              >
                <CasioF91W
                  watchState={watchState}
                  currentDisplayTime={currentDisplayTime}
                  onButtonPress={onButtonPress}
                  onButtonRelease={onButtonRelease}
                  onButtonHoldStart={onButtonHoldStart}
                  onButtonHoldEnd={onButtonHoldEnd}
                  onToggleLightLock={onToggleLightLock}
                  showStrap={false}
                  scale="normal"
                />

                {/* Widget quick helper hints */}
                <div className="w-full flex items-center justify-between px-3 mt-2 text-[9px] text-white/50">
                  <span>◄ A: Light</span>
                  <span>◄ B: Mode ({watchState.mode.replace('_', ' ')})</span>
                  <span>C: Start/Stop ►</span>
                </div>
              </div>

              {/* Android Google Search Widget */}
              <div className="w-full mt-6 bg-white/20 hover:bg-white/25 backdrop-blur-lg border border-white/20 rounded-full px-4 py-3 flex items-center justify-between shadow-lg text-white">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-white/80" />
                  <span className="text-xs text-white/80 font-normal">Search or type URL</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Mic className="w-4 h-4" />
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Android Bottom App Dock */}
            <div className="relative z-20 w-full pb-6 px-6">
              <div className="w-full py-3 px-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 flex items-center justify-around shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
              </div>

              {/* Android Gesture Bar */}
              <div className="w-32 h-1 bg-white/70 rounded-full mx-auto mt-4" />
            </div>
          </div>
        </div>
      ) : watchState.viewLayout === 'watch' ? (
        /* ================= FULL WRIST WATCH WITH STRAP ================= */
        <div className="w-full flex flex-col items-center py-4">
          <div className="relative flex flex-col items-center">
            <CasioF91W
              watchState={watchState}
              currentDisplayTime={currentDisplayTime}
              onButtonPress={onButtonPress}
              onButtonRelease={onButtonRelease}
              onButtonHoldStart={onButtonHoldStart}
              onButtonHoldEnd={onButtonHoldEnd}
              onToggleLightLock={onToggleLightLock}
              showStrap={true}
              scale="normal"
            />
          </div>
        </div>
      ) : (
        /* ================= CLEAN STANDALONE WIDGET ================= */
        <div className="w-full flex flex-col items-center justify-center py-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-[#16181d] border border-neutral-800 shadow-2xl flex flex-col items-center">
            <CasioF91W
              watchState={watchState}
              currentDisplayTime={currentDisplayTime}
              onButtonPress={onButtonPress}
              onButtonRelease={onButtonRelease}
              onButtonHoldStart={onButtonHoldStart}
              onButtonHoldEnd={onButtonHoldEnd}
              onToggleLightLock={onToggleLightLock}
              showStrap={false}
              scale="normal"
            />
          </div>
        </div>
      )}

      {/* Quick Action Bar under Watch */}
      <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-2 mt-4 px-2">
        <button
          type="button"
          onClick={() => onButtonPress('B')}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 cursor-pointer transition-colors"
        >
          Cycle Mode (B)
        </button>

        <button
          type="button"
          onClick={() => onButtonPress('C')}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 cursor-pointer transition-colors"
        >
          Toggle 12/24H or Start/Stop (C)
        </button>

        <button
          type="button"
          onClick={onTriggerCasioEasterEgg}
          className="px-3 py-1.5 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 text-xs font-medium rounded-lg border border-amber-800/60 cursor-pointer transition-colors flex items-center gap-1.5"
          title="Hold Button C for 3 seconds or click here to test authentic CASIo screen!"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>&ldquo;CASIo&rdquo; Easter Egg</span>
        </button>

        <button
          type="button"
          onClick={onTriggerTestMode}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 cursor-pointer transition-colors"
          title="Test all LCD segments (A + B + C)"
        >
          Diagnostic All Segments
        </button>
      </div>
    </div>
  );
};
