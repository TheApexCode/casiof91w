import React from 'react';

export interface SevenSegmentProps {
  char: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isBlinking?: boolean;
  colorScheme?: 'lcd' | 'gold' | 'amber';
  className?: string;
  showGhost?: boolean;
}

// 7 segment definitions: a(top), b(top-right), c(bottom-right), d(bottom), e(bottom-left), f(top-left), g(middle)
const SEGMENT_MAP: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0],
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1], // Casio 6 has top bar
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1], // Casio 9 has bottom bar
  'C': [1, 0, 0, 1, 1, 1, 0], // For CASIo
  'A': [1, 1, 1, 0, 1, 1, 1],
  'S': [1, 0, 1, 1, 0, 1, 1],
  'I': [0, 0, 0, 0, 1, 1, 0], // Vertical bar for 'I' in CASIo
  'o': [0, 0, 1, 1, 1, 0, 1], // Lowercase 'o' in CASIo
  'L': [0, 0, 0, 1, 1, 1, 0], // For AL
  'P': [1, 1, 0, 0, 1, 1, 1],
  'U': [0, 1, 1, 1, 1, 1, 0],
  'E': [1, 0, 0, 1, 1, 1, 1],
  '-': [0, 0, 0, 0, 0, 0, 1],
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '':  [0, 0, 0, 0, 0, 0, 0],
};

export const SevenSegmentDigit: React.FC<SevenSegmentProps> = ({
  char,
  size = 'lg',
  isBlinking = false,
  colorScheme = 'lcd',
  className = '',
  showGhost = true,
}) => {
  const charKey = String(char).toUpperCase();
  // Special check for lowercase 'o' in CASIo
  const effectiveKey = char === 'o' ? 'o' : charKey;
  const activeSegments = SEGMENT_MAP[effectiveKey] || SEGMENT_MAP[' '] || [0, 0, 0, 0, 0, 0, 0];

  const sizeDimensions = {
    sm: { width: 14, height: 24 },
    md: { width: 20, height: 36 },
    lg: { width: 32, height: 58 },
    xl: { width: 44, height: 80 },
  }[size];

  // Active color vs Ghost color
  const activeFill = colorScheme === 'gold' ? '#1c1b18' : '#141a14';
  const ghostFill = colorScheme === 'gold' ? 'rgba(30, 26, 18, 0.08)' : 'rgba(20, 26, 20, 0.07)';

  // Geometric coordinates for classic 7-segment digit:
  // ViewBox: 0 0 50 90 with authentic 5-degree slant
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${
        isBlinking ? 'animate-pulse' : ''
      } ${className}`}
      style={{
        width: sizeDimensions.width,
        height: sizeDimensions.height,
      }}
    >
      <svg
        viewBox="0 0 54 92"
        className="w-full h-full overflow-visible"
        style={{ transform: 'skewX(-4.5deg)' }}
        aria-hidden="true"
      >
        {/* Segment a (Top) */}
        <polygon
          points="8,8 14,2 40,2 46,8 39,14 15,14"
          fill={activeSegments[0] ? activeFill : showGhost ? ghostFill : 'none'}
        />

        {/* Segment b (Top-Right) */}
        <polygon
          points="47,9 53,15 53,41 47,47 41,41 41,15"
          fill={activeSegments[1] ? activeFill : showGhost ? ghostFill : 'none'}
        />

        {/* Segment c (Bottom-Right) */}
        <polygon
          points="47,49 53,55 53,81 47,87 41,81 41,55"
          fill={activeSegments[2] ? activeFill : showGhost ? ghostFill : 'none'}
        />

        {/* Segment d (Bottom) */}
        <polygon
          points="8,88 15,82 39,82 46,88 40,94 14,94"
          fill={activeSegments[3] ? activeFill : showGhost ? ghostFill : 'none'}
        />

        {/* Segment e (Bottom-Left) */}
        <polygon
          points="7,49 13,55 13,81 7,87 1,81 1,55"
          fill={activeSegments[4] ? activeFill : showGhost ? ghostFill : 'none'}
        />

        {/* Segment f (Top-Left) */}
        <polygon
          points="7,9 13,15 13,41 7,47 1,41 1,15"
          fill={activeSegments[5] ? activeFill : showGhost ? ghostFill : 'none'}
        />

        {/* Segment g (Middle) */}
        <polygon
          points="8,48 14,42 40,42 46,48 40,54 14,54"
          fill={activeSegments[6] ? activeFill : showGhost ? ghostFill : 'none'}
        />
      </svg>
    </div>
  );
};
