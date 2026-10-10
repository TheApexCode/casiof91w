import React from 'react';
import { SevenSegmentDigit } from './SevenSegmentDigit';
import { WatchState } from '../types';

interface LcdScreenProps {
  watchState: WatchState;
  currentDisplayTime: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    dayOfWeek: number; // 0=SU, 1=MO, 2=TU, 3=WE, 4=TH, 5=FR, 6=SA
    date: number;
    month: number;
  };
  isBlinkingField?: (field: string) => boolean;
  scale?: 'normal' | 'widget' | 'compact';
}

const DAYS_OF_WEEK = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const LcdScreen: React.FC<LcdScreenProps> = ({
  watchState,
  currentDisplayTime,
  scale = 'normal',
}) => {
  const {
    mode,
    is24Hour,
    lightOn,
    lightLocked,
    backlightColor,
    alarm,
    stopwatch,
    timeSettingField,
  } = watchState;

  const isBacklit = lightOn || lightLocked;

  // Format hours for 12/24H
  const rawHours = currentDisplayTime.hours;
  const isPM = rawHours >= 12;
  const displayHours = is24Hour
    ? rawHours
    : rawHours % 12 === 0
    ? 12
    : rawHours % 12;

  const hoursStr = String(displayHours).padStart(is24Hour ? 2 : 2, ' ');
  const minutesStr = String(currentDisplayTime.minutes).padStart(2, '0');
  const secondsStr = String(currentDisplayTime.seconds).padStart(2, '0');
  const dateStr = String(currentDisplayTime.date).padStart(2, ' ');

  // Stopwatch time calculation
  let swMinutes = 0;
  let swSeconds = 0;
  let swHundredths = 0;

  const activeElapsed = stopwatch.splitActive && stopwatch.splitMs !== null
    ? stopwatch.splitMs
    : stopwatch.running
    ? stopwatch.elapsedMs + (Date.now() - stopwatch.startTime)
    : stopwatch.elapsedMs;

  const totalHundredths = Math.floor(activeElapsed / 10) % 600000;
  swHundredths = totalHundredths % 100;
  const totalSecs = Math.floor(totalHundredths / 100);
  swSeconds = totalSecs % 60;
  swMinutes = Math.floor(totalSecs / 60) % 60;

  const swMinStr = String(swMinutes).padStart(2, '0');
  const swSecStr = String(swSeconds).padStart(2, '0');
  const swHundStr = String(swHundredths).padStart(2, '0');

  // Alarm display
  const alarmRawHours = alarm.hour;
  const alarmIsPM = alarmRawHours >= 12;
  const alarmDisplayHours = is24Hour
    ? alarmRawHours
    : alarmRawHours % 12 === 0
    ? 12
    : alarmRawHours % 12;
  const alarmHoursStr = String(alarmDisplayHours).padStart(is24Hour ? 2 : 2, ' ');
  const alarmMinutesStr = String(alarm.minute).padStart(2, '0');

  // Backlight gradient & shadow definitions
  const getBacklightGradient = () => {
    if (backlightColor === 'authentic-green') {
      // Classic F-91W side-mounted green LED: bright green hotspot on left, fading to right
      return 'radial-gradient(ellipse at 8% 50%, rgba(132, 235, 120, 0.95) 0%, rgba(98, 204, 88, 0.65) 28%, rgba(76, 175, 80, 0.35) 60%, rgba(169, 184, 157, 0.2) 100%)';
    } else if (backlightColor === 'teal-illuminator') {
      // Modern Casio Illuminator electro-luminescent cyan/teal
      return 'radial-gradient(circle at 50% 50%, rgba(80, 240, 230, 0.92) 0%, rgba(40, 200, 210, 0.82) 100%)';
    } else {
      // Warm amber
      return 'radial-gradient(ellipse at 15% 50%, rgba(255, 185, 70, 0.9) 0%, rgba(240, 150, 40, 0.7) 60%, rgba(169, 184, 157, 0.2) 100%)';
    }
  };

  const getBacklightBoxShadow = () => {
    if (backlightColor === 'authentic-green') {
      return 'inset 4px 0 14px rgba(76, 217, 100, 0.8), 0 0 18px rgba(76, 217, 100, 0.4)';
    } else if (backlightColor === 'teal-illuminator') {
      return 'inset 0 0 12px rgba(80, 240, 230, 0.8), 0 0 20px rgba(60, 220, 230, 0.5)';
    } else {
      return 'inset 4px 0 14px rgba(255, 170, 50, 0.7), 0 0 16px rgba(255, 170, 50, 0.35)';
    }
  };

  const digitSize = scale === 'compact' ? 'md' : scale === 'widget' ? 'lg' : 'lg';
  const secDigitSize = scale === 'compact' ? 'sm' : 'md';

  return (
    <div
      id="f91w-lcd-screen"
      className="relative w-full aspect-[2.1/1] rounded-[6px] overflow-hidden border border-black/40 shadow-inner select-none transition-all duration-150 bg-[#a8ba9e]"
    >
      {/* Backlight Glow Overlay - separated to avoid shorthand/non-shorthand style conflict during rerender */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-0"
        style={{
          opacity: isBacklit ? 1 : 0,
          backgroundImage: getBacklightGradient(),
          boxShadow: isBacklit ? getBacklightBoxShadow() : 'none',
        }}
      />
      {/* Subtle polarization & glass texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)',
        }}
      />

      {/* Glass glare highlight */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none transform -rotate-12" />

      {/* Screen Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-2 sm:p-2.5 font-mono">
        {/* ================= TOP ROW ================= */}
        <div className="flex items-center justify-between h-[28%] text-[#141a14] px-1">
          {/* Day of Week or Mode Indicator */}
          <div className="flex items-center gap-1">
            {mode === 'NORMAL_TIME' || mode === 'TIME_SETTING' ? (
              <div className="flex items-center gap-[3px] text-[10px] sm:text-[11px] font-bold tracking-tight">
                {DAYS_OF_WEEK.map((day, idx) => {
                  const isActive = currentDisplayTime.dayOfWeek === idx;
                  const isBlinking =
                    mode === 'TIME_SETTING' &&
                    timeSettingField === 'DAY_OF_WEEK';

                  return (
                    <div
                      key={day}
                      className={`relative px-[2px] leading-none ${
                        isActive
                          ? `font-black text-[#111612] ${
                              isBlinking ? 'animate-pulse' : ''
                            }`
                          : 'text-[#141a14]/15'
                      }`}
                    >
                      {day}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#111612]" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : mode === 'ALARM' ? (
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-xs sm:text-sm font-black tracking-wider text-[#111612] bg-[#111612]/10 px-1 rounded">
                  AL
                </span>
                <span className="text-[10px] text-[#141a14]/80">ALARM</span>
              </div>
            ) : mode === 'STOPWATCH' ? (
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-xs sm:text-sm font-black tracking-wider text-[#111612] bg-[#111612]/10 px-1 rounded">
                  ST
                </span>
                {stopwatch.splitActive && (
                  <span className="text-[10px] sm:text-xs font-black tracking-wide text-[#111612] animate-pulse">
                    SPL
                  </span>
                )}
              </div>
            ) : mode === 'CASIO_EASTER_EGG' ? (
              <div className="text-[10px] font-bold text-[#141a14]/30">CASIO COMPUTER CO.</div>
            ) : (
              /* All segments diagnostic test */
              <div className="flex items-center gap-[3px] text-[10px] sm:text-[11px] font-bold">
                {DAYS_OF_WEEK.map((day) => (
                  <span key={day} className="text-[#111612] font-black">
                    {day}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Top: Date & Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 text-right">
            {/* Alarm Sound Wave Indicator ((·)) */}
            <div
              className={`flex items-center text-[10px] sm:text-[11px] font-black ${
                alarm.alarmEnabled || mode === 'ALL_SEGMENTS_TEST'
                  ? 'text-[#111612]'
                  : 'text-[#141a14]/10'
              }`}
              title="Daily Alarm"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>

            {/* Hourly Chime Bell Indicator */}
            <div
              className={`flex items-center text-[10px] sm:text-[11px] font-black ${
                alarm.chimeEnabled || mode === 'ALL_SEGMENTS_TEST'
                  ? 'text-[#111612]'
                  : 'text-[#141a14]/10'
              }`}
              title="Hourly Time Signal"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 fill-current"
                aria-hidden="true"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </div>

            {/* Date Display */}
            {mode === 'NORMAL_TIME' || mode === 'TIME_SETTING' ? (
              <div
                className={`flex items-baseline gap-0.5 text-right font-black ${
                  mode === 'TIME_SETTING' && timeSettingField === 'DATE'
                    ? 'animate-pulse'
                    : ''
                }`}
              >
                <SevenSegmentDigit
                  char={dateStr[0]}
                  size="sm"
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'DATE'}
                />
                <SevenSegmentDigit
                  char={dateStr[1]}
                  size="sm"
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'DATE'}
                />
              </div>
            ) : mode === 'ALL_SEGMENTS_TEST' ? (
              <div className="flex items-baseline gap-0.5 text-right">
                <SevenSegmentDigit char="8" size="sm" />
                <SevenSegmentDigit char="8" size="sm" />
              </div>
            ) : null}
          </div>
        </div>

        {/* ================= MAIN ROW ================= */}
        <div className="flex items-end justify-between px-1 h-[68%]">
          {/* Left indicators: 24H & PM */}
          <div className="flex flex-col justify-end gap-0.5 pb-1 sm:pb-1.5 w-7 sm:w-9">
            {/* 24H indicator */}
            <span
              className={`text-[9px] sm:text-[10px] font-black leading-none tracking-tighter ${
                is24Hour || mode === 'ALL_SEGMENTS_TEST'
                  ? 'text-[#111612]'
                  : 'text-[#141a14]/10'
              }`}
            >
              24H
            </span>
            {/* PM / AM indicator */}
            <span
              className={`text-[9px] sm:text-[10px] font-black leading-none ${
                !is24Hour && (mode === 'ALARM' ? alarmIsPM : isPM)
                  ? 'text-[#111612]'
                  : mode === 'ALL_SEGMENTS_TEST'
                  ? 'text-[#111612]'
                  : 'text-[#141a14]/10'
              }`}
            >
              PM
            </span>
          </div>

          {/* Center / Right: Digits */}
          {mode === 'NORMAL_TIME' || mode === 'TIME_SETTING' ? (
            <div className="flex items-end gap-1 sm:gap-2">
              {/* Hours */}
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit
                  char={hoursStr[0]}
                  size={digitSize}
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'HOURS'}
                />
                <SevenSegmentDigit
                  char={hoursStr[1]}
                  size={digitSize}
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'HOURS'}
                />
              </div>

              {/* Colon Separator */}
              <div className="flex flex-col justify-center items-center gap-2 pb-3 sm:pb-4 px-0.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
              </div>

              {/* Minutes */}
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit
                  char={minutesStr[0]}
                  size={digitSize}
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'MINUTES'}
                />
                <SevenSegmentDigit
                  char={minutesStr[1]}
                  size={digitSize}
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'MINUTES'}
                />
              </div>

              {/* Seconds (Offset/Medium size on right) */}
              <div className="flex items-end gap-0.5 pb-0.5 ml-1">
                <SevenSegmentDigit
                  char={secondsStr[0]}
                  size={secDigitSize}
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'SECONDS'}
                />
                <SevenSegmentDigit
                  char={secondsStr[1]}
                  size={secDigitSize}
                  isBlinking={mode === 'TIME_SETTING' && timeSettingField === 'SECONDS'}
                />
              </div>
            </div>
          ) : mode === 'ALARM' ? (
            /* Alarm Mode: AL [Hour] : [Minute] */
            <div className="flex items-end gap-1.5 sm:gap-2">
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit
                  char={alarmHoursStr[0]}
                  size={digitSize}
                  isBlinking={alarm.isSetting && alarm.settingField === 'HOUR'}
                />
                <SevenSegmentDigit
                  char={alarmHoursStr[1]}
                  size={digitSize}
                  isBlinking={alarm.isSetting && alarm.settingField === 'HOUR'}
                />
              </div>

              <div className="flex flex-col justify-center items-center gap-2 pb-3 sm:pb-4 px-0.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
              </div>

              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit
                  char={alarmMinutesStr[0]}
                  size={digitSize}
                  isBlinking={alarm.isSetting && alarm.settingField === 'MINUTE'}
                />
                <SevenSegmentDigit
                  char={alarmMinutesStr[1]}
                  size={digitSize}
                  isBlinking={alarm.isSetting && alarm.settingField === 'MINUTE'}
                />
              </div>

              {/* In Alarm mode, seconds area shows empty or 00 ghost */}
              <div className="flex items-end gap-0.5 pb-0.5 ml-1 opacity-20">
                <SevenSegmentDigit char=" " size={secDigitSize} />
                <SevenSegmentDigit char=" " size={secDigitSize} />
              </div>
            </div>
          ) : mode === 'STOPWATCH' ? (
            /* Stopwatch Mode: MM : SS 1/100 */
            <div className="flex items-end gap-1 sm:gap-2">
              {/* Minutes */}
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit char={swMinStr[0]} size={digitSize} />
                <SevenSegmentDigit char={swMinStr[1]} size={digitSize} />
              </div>

              {/* Colon Separator */}
              <div className="flex flex-col justify-center items-center gap-2 pb-3 sm:pb-4 px-0.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
              </div>

              {/* Seconds */}
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit char={swSecStr[0]} size={digitSize} />
                <SevenSegmentDigit char={swSecStr[1]} size={digitSize} />
              </div>

              {/* 1/100 Seconds (Rapidly changing) */}
              <div className="flex items-end gap-0.5 pb-0.5 ml-1">
                <SevenSegmentDigit char={swHundStr[0]} size={secDigitSize} />
                <SevenSegmentDigit char={swHundStr[1]} size={secDigitSize} />
              </div>
            </div>
          ) : mode === 'CASIO_EASTER_EGG' ? (
            /* The Famous Anti-Counterfeit Easter Egg: "CASIo" */
            <div className="flex items-end justify-center w-full pb-1 gap-1.5">
              <SevenSegmentDigit char="C" size={digitSize} />
              <SevenSegmentDigit char="A" size={digitSize} />
              <SevenSegmentDigit char="S" size={digitSize} />
              <SevenSegmentDigit char="I" size={digitSize} />
              <SevenSegmentDigit char="o" size={digitSize} />
            </div>
          ) : (
            /* All-segments diagnostic test: 88:88:88 */
            <div className="flex items-end gap-1.5 sm:gap-2">
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit char="8" size={digitSize} />
                <SevenSegmentDigit char="8" size={digitSize} />
              </div>
              <div className="flex flex-col justify-center items-center gap-2 pb-3 sm:pb-4 px-0.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#111612] rounded-full" />
              </div>
              <div className="flex items-center gap-0.5">
                <SevenSegmentDigit char="8" size={digitSize} />
                <SevenSegmentDigit char="8" size={digitSize} />
              </div>
              <div className="flex items-end gap-0.5 pb-0.5 ml-1">
                <SevenSegmentDigit char="8" size={secDigitSize} />
                <SevenSegmentDigit char="8" size={secDigitSize} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
