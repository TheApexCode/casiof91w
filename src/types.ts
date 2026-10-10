export type WatchMode =
  | 'NORMAL_TIME'
  | 'ALARM'
  | 'STOPWATCH'
  | 'TIME_SETTING'
  | 'CASIO_EASTER_EGG'
  | 'ALL_SEGMENTS_TEST';

export type TimeSettingField =
  | 'SECONDS'
  | 'HOURS'
  | 'MINUTES'
  | 'YEAR'
  | 'MONTH'
  | 'DATE'
  | 'DAY_OF_WEEK';

export type BacklightColor = 'authentic-green' | 'teal-illuminator' | 'amber';

export type CaseColorway =
  | 'classic-black'
  | 'vintage-gold'
  | 'army-green'
  | 'silver-steel';

export type ViewLayout = 'watch' | 'android-phone' | 'minimal-widget';

export interface AlarmState {
  hour: number;
  minute: number;
  alarmEnabled: boolean;
  chimeEnabled: boolean;
  isSetting: boolean;
  settingField: 'HOUR' | 'MINUTE';
  isRinging: boolean;
}

export interface StopwatchState {
  running: boolean;
  startTime: number;
  elapsedMs: number;
  splitMs: number | null;
  splitActive: boolean;
  laps: number[];
}

export interface WatchState {
  mode: WatchMode;
  is24Hour: boolean;
  lightOn: boolean;
  lightLocked: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  backlightColor: BacklightColor;
  caseColorway: CaseColorway;
  viewLayout: ViewLayout;
  
  // Custom time adjustment (if user adjusted manual time)
  customTimeOffsetMs: number;
  useDeviceTime: boolean;
  
  // Time setting active field
  timeSettingField: TimeSettingField;
  
  // Alarm
  alarm: AlarmState;
  
  // Stopwatch
  stopwatch: StopwatchState;
}
