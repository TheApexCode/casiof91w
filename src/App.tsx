import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WatchState, WatchMode, TimeSettingField } from './types';
import { AndroidWidgetView } from './components/AndroidWidgetView';
import { WatchControlsGuide } from './components/WatchControlsGuide';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  playButtonBeep,
  playModeBeep,
  playHourlyChime,
  startAlarmLoop,
  stopAlarmLoop,
  triggerHaptic,
} from './utils/audio';
import { Bell, Volume2, X, Download, Smartphone } from 'lucide-react';

const INITIAL_WATCH_STATE: WatchState = {
  mode: 'NORMAL_TIME',
  is24Hour: true,
  lightOn: false,
  lightLocked: false,
  soundEnabled: true,
  hapticsEnabled: true,
  backlightColor: 'authentic-green',
  caseColorway: 'classic-black',
  viewLayout: 'android-phone',
  customTimeOffsetMs: 0,
  useDeviceTime: true,
  timeSettingField: 'SECONDS',
  alarm: {
    hour: 7,
    minute: 0,
    alarmEnabled: false,
    chimeEnabled: false,
    isSetting: false,
    settingField: 'HOUR',
    isRinging: false,
  },
  stopwatch: {
    running: false,
    startTime: 0,
    elapsedMs: 0,
    splitMs: null,
    splitActive: false,
    laps: [],
  },
};

export default function App() {
  const [watchState, setWatchState] = useState<WatchState>(() => {
    try {
      const saved = localStorage.getItem('casio_f91w_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_WATCH_STATE,
          is24Hour: parsed.is24Hour ?? true,
          soundEnabled: parsed.soundEnabled ?? true,
          backlightColor: parsed.backlightColor ?? 'authentic-green',
          caseColorway: parsed.caseColorway ?? 'classic-black',
          viewLayout: parsed.viewLayout ?? 'android-phone',
          alarm: {
            ...INITIAL_WATCH_STATE.alarm,
            hour: parsed.alarmHour ?? 7,
            minute: parsed.alarmMinute ?? 0,
            alarmEnabled: parsed.alarmEnabled ?? false,
            chimeEnabled: parsed.chimeEnabled ?? false,
          },
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_WATCH_STATE;
  });

  const [showGuide, setShowGuide] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [activeAlarmBanner, setActiveAlarmBanner] = useState(false);

  // Reference for hold detection on Button C (CASIo easter egg)
  const buttonCHoldTimerRef = useRef<number | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);
  const lastChimeHourRef = useRef<number | null>(null);

  // Time state
  const [displayTime, setDisplayTime] = useState(() => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
      dayOfWeek: now.getDay(),
      date: now.getDate(),
      month: now.getMonth() + 1,
    };
  });

  // Save persistent preferences
  useEffect(() => {
    try {
      const payload = {
        is24Hour: watchState.is24Hour,
        soundEnabled: watchState.soundEnabled,
        backlightColor: watchState.backlightColor,
        caseColorway: watchState.caseColorway,
        viewLayout: watchState.viewLayout,
        alarmHour: watchState.alarm.hour,
        alarmMinute: watchState.alarm.minute,
        alarmEnabled: watchState.alarm.alarmEnabled,
        chimeEnabled: watchState.alarm.chimeEnabled,
      };
      localStorage.setItem('casio_f91w_state_v1', JSON.stringify(payload));
    } catch {
      // Ignore localStorage exceptions
    }
  }, [
    watchState.is24Hour,
    watchState.soundEnabled,
    watchState.backlightColor,
    watchState.caseColorway,
    watchState.viewLayout,
    watchState.alarm.hour,
    watchState.alarm.minute,
    watchState.alarm.alarmEnabled,
    watchState.alarm.chimeEnabled,
  ]);

  // Main Clock & Stopwatch Tick Loop (every 20ms)
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date(Date.now() + watchState.customTimeOffsetMs);
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();
      const dayOfWeek = now.getDay();
      const date = now.getDate();
      const month = now.getMonth() + 1;

      setDisplayTime({
        hours,
        minutes,
        seconds,
        milliseconds: ms,
        dayOfWeek,
        date,
        month,
      });

      // Hourly Chime Check (:00:00)
      if (
        watchState.alarm.chimeEnabled &&
        minutes === 0 &&
        seconds === 0 &&
        lastChimeHourRef.current !== hours
      ) {
        lastChimeHourRef.current = hours;
        if (watchState.soundEnabled) {
          playHourlyChime();
        }
        if (watchState.hapticsEnabled) {
          triggerHaptic(50);
        }
      }

      // Daily Alarm Trigger Check
      if (
        watchState.alarm.alarmEnabled &&
        !watchState.alarm.isRinging &&
        hours === watchState.alarm.hour &&
        minutes === watchState.alarm.minute &&
        seconds === 0
      ) {
        triggerAlarm();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [
    watchState.customTimeOffsetMs,
    watchState.alarm.alarmEnabled,
    watchState.alarm.chimeEnabled,
    watchState.alarm.hour,
    watchState.alarm.minute,
    watchState.alarm.isRinging,
    watchState.soundEnabled,
    watchState.hapticsEnabled,
  ]);

  // Alarm ringing helper
  const triggerAlarm = useCallback(() => {
    setWatchState((prev) => ({
      ...prev,
      alarm: { ...prev.alarm, isRinging: true },
    }));
    setActiveAlarmBanner(true);

    if (watchState.soundEnabled) {
      startAlarmLoop();
    }
    if (watchState.hapticsEnabled) {
      triggerHaptic(100);
    }

    // Auto dismiss alarm after 20 seconds (authentic Casio behavior)
    if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
    alarmTimeoutRef.current = window.setTimeout(() => {
      dismissAlarm();
    }, 20000);
  }, [watchState.soundEnabled, watchState.hapticsEnabled]);

  const dismissAlarm = useCallback(() => {
    stopAlarmLoop();
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    setActiveAlarmBanner(false);
    setWatchState((prev) => ({
      ...prev,
      alarm: { ...prev.alarm, isRinging: false },
    }));
  }, []);

  // BUTTON A: LIGHT / LAP / RESET / FIELD-SHIFT
  const handleButtonAPress = () => {
    // If alarm is ringing, dismiss it
    if (watchState.alarm.isRinging) {
      dismissAlarm();
      return;
    }

    if (watchState.hapticsEnabled) triggerHaptic(15);

    if (watchState.mode === 'NORMAL_TIME') {
      // Turn on backlight
      setWatchState((prev) => ({ ...prev, lightOn: true }));
    } else if (watchState.mode === 'ALARM') {
      // Toggle or switch alarm setting field (HOUR <-> MINUTE)
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => ({
        ...prev,
        alarm: {
          ...prev.alarm,
          isSetting: true,
          settingField: prev.alarm.settingField === 'HOUR' ? 'MINUTE' : 'HOUR',
        },
      }));
    } else if (watchState.mode === 'STOPWATCH') {
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => {
        const sw = prev.stopwatch;
        if (sw.running) {
          // Split time (freeze display while stopwatch keeps running)
          if (!sw.splitActive) {
            const currentElapsed = sw.elapsedMs + (Date.now() - sw.startTime);
            return {
              ...prev,
              stopwatch: {
                ...sw,
                splitActive: true,
                splitMs: currentElapsed,
                laps: [...sw.laps, currentElapsed],
              },
            };
          } else {
            // Release split
            return {
              ...prev,
              stopwatch: {
                ...sw,
                splitActive: false,
                splitMs: null,
              },
            };
          }
        } else {
          // Reset stopwatch to 0
          return {
            ...prev,
            stopwatch: {
              ...sw,
              elapsedMs: 0,
              splitMs: null,
              splitActive: false,
              laps: [],
            },
          };
        }
      });
    } else if (watchState.mode === 'TIME_SETTING') {
      // Cycle setting fields: SECONDS -> HOURS -> MINUTES -> DATE -> DAY_OF_WEEK -> SECONDS
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => {
        const fields: TimeSettingField[] = [
          'SECONDS',
          'HOURS',
          'MINUTES',
          'DATE',
          'DAY_OF_WEEK',
        ];
        const currentIdx = fields.indexOf(prev.timeSettingField);
        const nextField = fields[(currentIdx + 1) % fields.length];
        return {
          ...prev,
          timeSettingField: nextField,
        };
      });
    } else {
      // Return to normal
      setWatchState((prev) => ({ ...prev, mode: 'NORMAL_TIME' }));
    }
  };

  const handleButtonARelease = () => {
    if (watchState.mode === 'NORMAL_TIME') {
      if (!watchState.lightLocked) {
        setWatchState((prev) => ({ ...prev, lightOn: false }));
      }
    }
  };

  // BUTTON B: MODE SELECTION
  const handleButtonBPress = () => {
    if (watchState.alarm.isRinging) {
      dismissAlarm();
      return;
    }

    if (watchState.hapticsEnabled) triggerHaptic(20);

    setWatchState((prev) => {
      let nextMode: WatchMode = 'NORMAL_TIME';

      if (prev.mode === 'NORMAL_TIME') {
        nextMode = 'ALARM';
      } else if (prev.mode === 'ALARM') {
        nextMode = 'STOPWATCH';
      } else if (prev.mode === 'STOPWATCH') {
        nextMode = 'TIME_SETTING';
      } else {
        // TIME_SETTING, CASIO_EASTER_EGG, or ALL_SEGMENTS_TEST
        nextMode = 'NORMAL_TIME';
      }

      // Authentic Casio beep: higher pitch when returning to normal timekeeping mode!
      if (prev.soundEnabled) {
        playModeBeep(nextMode === 'NORMAL_TIME');
      }

      return {
        ...prev,
        mode: nextMode,
        // Reset setting flags when exiting alarm
        alarm: { ...prev.alarm, isSetting: false },
        timeSettingField: 'SECONDS',
      };
    });
  };

  // BUTTON C: 12/24H / ALARM-CHIME TOGGLE / START-STOP / ADVANCE
  const handleButtonCPress = () => {
    if (watchState.alarm.isRinging) {
      dismissAlarm();
      return;
    }

    if (watchState.hapticsEnabled) triggerHaptic(15);

    if (watchState.mode === 'NORMAL_TIME') {
      // Toggle 12/24 Hour format
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => ({
        ...prev,
        is24Hour: !prev.is24Hour,
      }));
    } else if (watchState.mode === 'ALARM') {
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => {
        if (prev.alarm.isSetting) {
          // Increment setting field (+1)
          if (prev.alarm.settingField === 'HOUR') {
            return {
              ...prev,
              alarm: {
                ...prev.alarm,
                hour: (prev.alarm.hour + 1) % 24,
              },
            };
          } else {
            return {
              ...prev,
              alarm: {
                ...prev.alarm,
                minute: (prev.alarm.minute + 1) % 60,
              },
            };
          }
        } else {
          // Cycle alarm & chime states:
          // Both OFF -> Alarm ON -> Chime ON -> Both ON -> Both OFF
          const { alarmEnabled, chimeEnabled } = prev.alarm;
          let nextAlarm = false;
          let nextChime = false;

          if (!alarmEnabled && !chimeEnabled) {
            nextAlarm = true; // Alarm ON
          } else if (alarmEnabled && !chimeEnabled) {
            nextAlarm = false;
            nextChime = true; // Chime ON
          } else if (!alarmEnabled && chimeEnabled) {
            nextAlarm = true;
            nextChime = true; // Both ON
          } else {
            nextAlarm = false;
            nextChime = false; // Both OFF
          }

          return {
            ...prev,
            alarm: {
              ...prev.alarm,
              alarmEnabled: nextAlarm,
              chimeEnabled: nextChime,
            },
          };
        }
      });
    } else if (watchState.mode === 'STOPWATCH') {
      // START / STOP toggle
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => {
        const sw = prev.stopwatch;
        if (!sw.running) {
          return {
            ...prev,
            stopwatch: {
              ...sw,
              running: true,
              startTime: Date.now(),
            },
          };
        } else {
          const currentElapsed =
            sw.elapsedMs + (Date.now() - sw.startTime);
          return {
            ...prev,
            stopwatch: {
              ...sw,
              running: false,
              elapsedMs: currentElapsed,
            },
          };
        }
      });
    } else if (watchState.mode === 'TIME_SETTING') {
      // Advance field (+1) or zero seconds
      if (watchState.soundEnabled) playButtonBeep();
      setWatchState((prev) => {
        let offsetChange = 0;
        const now = new Date(Date.now() + prev.customTimeOffsetMs);

        switch (prev.timeSettingField) {
          case 'SECONDS': {
            // Zero seconds: if seconds >= 30, add a minute
            const currSec = now.getSeconds();
            const currMs = now.getMilliseconds();
            offsetChange = -(currSec * 1000 + currMs);
            if (currSec >= 30) {
              offsetChange += 60000;
            }
            break;
          }
          case 'HOURS':
            offsetChange = 3600000; // +1 hour
            break;
          case 'MINUTES':
            offsetChange = 60000; // +1 minute
            break;
          case 'DATE':
            offsetChange = 86400000; // +1 day
            break;
          case 'DAY_OF_WEEK':
            offsetChange = 86400000; // shift day
            break;
          default:
            break;
        }

        return {
          ...prev,
          customTimeOffsetMs: prev.customTimeOffsetMs + offsetChange,
        };
      });
    } else {
      // Return to normal
      setWatchState((prev) => ({ ...prev, mode: 'NORMAL_TIME' }));
    }
  };

  // Button C hold detector for CASIo easter egg
  const handleButtonCHoldStart = () => {
    if (watchState.mode === 'NORMAL_TIME') {
      if (buttonCHoldTimerRef.current) clearTimeout(buttonCHoldTimerRef.current);
      buttonCHoldTimerRef.current = window.setTimeout(() => {
        if (watchState.soundEnabled) playButtonBeep();
        if (watchState.hapticsEnabled) triggerHaptic(30);
        setWatchState((prev) => ({ ...prev, mode: 'CASIO_EASTER_EGG' }));
      }, 2500); // 2.5s - 3s authentic hold
    }
  };

  const handleButtonCHoldEnd = () => {
    if (buttonCHoldTimerRef.current) {
      clearTimeout(buttonCHoldTimerRef.current);
      buttonCHoldTimerRef.current = null;
    }
    if (watchState.mode === 'CASIO_EASTER_EGG') {
      // Release returns to normal time
      setWatchState((prev) => ({ ...prev, mode: 'NORMAL_TIME' }));
    }
  };

  // Keyboard controls for rapid testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user typing in input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'a' || e.key === 'A' || e.key === 'l' || e.key === 'L') {
        handleButtonAPress();
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'm' || e.key === 'M') {
        handleButtonBPress();
      } else if (e.key === 'c' || e.key === 'C' || e.key === ' ' || e.key === 's' || e.key === 'S') {
        handleButtonCPress();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'l' || e.key === 'L') {
        handleButtonARelease();
      } else if (e.key === 'c' || e.key === 'C' || e.key === ' ' || e.key === 's' || e.key === 'S') {
        handleButtonCHoldEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [watchState]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-6 bg-[#0e1014] text-neutral-100">
      {/* Top Banner / Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 border-b border-neutral-800/80 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg sm:text-xl tracking-wider text-white">CASIO</h1>
            <span className="bg-[#b91c1c] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              F-91W
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-neutral-400 font-mono">
            Digital Watch Widget for Android
          </span>
        </div>

        {/* Actions & Mode Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[11px] hidden sm:inline">Active Mode:</span>
            <span className="px-2 py-0.5 rounded bg-neutral-800 text-blue-400 font-mono font-bold text-xs border border-neutral-700">
              {watchState.mode.replace('_', ' ')}
            </span>
          </div>

          <button
            type="button"
            id="app-header-install-btn"
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-blue-500/20 cursor-pointer transition active:scale-95"
            title="Install Casio F-91W Watch Widget app to your phone"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install on Phone</span>
            <span className="sm:hidden">Install</span>
          </button>
        </div>
      </header>

      {/* Alarm Notification Toast (When alarm rings) */}
      {activeAlarmBanner && (
        <div className="w-full max-w-md my-2 p-3.5 bg-red-950/90 border-2 border-red-600 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce z-50 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">CASIO F-91W ALARM!</div>
              <div className="text-xs text-red-200">
                Alarm is ringing ({String(watchState.alarm.hour).padStart(2, '0')}:
                {String(watchState.alarm.minute).padStart(2, '0')})
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissAlarm}
            className="px-3 py-1.5 bg-white text-red-900 font-bold text-xs rounded-xl hover:bg-neutral-200 cursor-pointer shadow"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Watch / Android Widget Interactive Display */}
      <section className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center">
        <AndroidWidgetView
          watchState={watchState}
          currentDisplayTime={displayTime}
          onButtonPress={(btn) => {
            if (btn === 'A') handleButtonAPress();
            else if (btn === 'B') handleButtonBPress();
            else if (btn === 'C') handleButtonCPress();
          }}
          onButtonRelease={(btn) => {
            if (btn === 'A') handleButtonARelease();
            else if (btn === 'C') handleButtonCHoldEnd();
          }}
          onButtonHoldStart={(btn) => {
            if (btn === 'C') handleButtonCHoldStart();
          }}
          onButtonHoldEnd={(btn) => {
            if (btn === 'C') handleButtonCHoldEnd();
          }}
          onToggleSound={() =>
            setWatchState((prev) => ({
              ...prev,
              soundEnabled: !prev.soundEnabled,
            }))
          }
          onToggleLightLock={() =>
            setWatchState((prev) => ({
              ...prev,
              lightLocked: !prev.lightLocked,
            }))
          }
          onSetBacklightColor={(color) =>
            setWatchState((prev) => ({ ...prev, backlightColor: color }))
          }
          onSetCaseColorway={(color) =>
            setWatchState((prev) => ({ ...prev, caseColorway: color }))
          }
          onSetViewLayout={(layout) =>
            setWatchState((prev) => ({ ...prev, viewLayout: layout }))
          }
          onOpenGuide={() => setShowGuide(true)}
          onOpenInstall={() => setShowInstallModal(true)}
          onTriggerCasioEasterEgg={() =>
            setWatchState((prev) => ({
              ...prev,
              mode: prev.mode === 'CASIO_EASTER_EGG' ? 'NORMAL_TIME' : 'CASIO_EASTER_EGG',
            }))
          }
          onTriggerTestMode={() =>
            setWatchState((prev) => ({
              ...prev,
              mode: prev.mode === 'ALL_SEGMENTS_TEST' ? 'NORMAL_TIME' : 'ALL_SEGMENTS_TEST',
            }))
          }
        />
      </section>

      {/* Keyboard Shortcuts Hint & Footer */}
      <footer className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 pt-3 mt-4 border-t border-neutral-900 text-[11px] text-neutral-500">
        <div className="flex items-center gap-3">
          <span>Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">A/L</kbd> Light</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">B/M</kbd> Mode</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">C/Space</kbd> Start/Stop/24H</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerAlarm}
            className="hover:text-amber-400 cursor-pointer underline text-[10px]"
            title="Test trigger the alarm sound and banner"
          >
            Test Alarm Beep
          </button>
          <span>Casio Module 593 Reproduction</span>
        </div>
      </footer>

      {/* Guide & Manual Modal */}
      {showGuide && (
        <WatchControlsGuide
          currentMode={watchState.mode}
          onSelectMode={(mode) => {
            setWatchState((prev) => ({ ...prev, mode }));
            setShowGuide(false);
          }}
          onTriggerCasioEasterEgg={() => {
            setWatchState((prev) => ({ ...prev, mode: 'CASIO_EASTER_EGG' }));
            setShowGuide(false);
          }}
          onTriggerTestMode={() => {
            setWatchState((prev) => ({ ...prev, mode: 'ALL_SEGMENTS_TEST' }));
            setShowGuide(false);
          }}
          onClose={() => setShowGuide(false)}
        />
      )}

      {/* PWA Phone Install Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </main>
  );
}
