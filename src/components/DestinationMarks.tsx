import * as React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

type P = { size?: number; color: string };

const BASE = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const NearbyMark = ({ size = 30, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M21.4 2.6 10.9 21 9.6 13.4 2.2 11.1z" stroke={color} strokeWidth={1.7} {...BASE} />
    <Line x1={21.4} y1={2.6} x2={9.6} y2={13.4} stroke={color} strokeWidth={1.7} {...BASE} />
  </Svg>
);

export const LakeMark = ({ size = 30, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M2.6 12.4 7.4 8.2l4.8 4.2" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M3.8 12.2v5.2h7.2v-5.2" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M6.4 17.4v-3.1h2.2v3.1" stroke={color} strokeWidth={1.5} {...BASE} />
    <Path d="M16.4 6.6 13.9 11h5z" stroke={color} strokeWidth={1.6} {...BASE} />
    <Path d="M16.4 9.6 13.2 15h6.4z" stroke={color} strokeWidth={1.6} {...BASE} />
    <Line x1={16.4} y1={15} x2={16.4} y2={17.4} stroke={color} strokeWidth={1.5} {...BASE} />
    <Path d="M2.6 19.3c1.4-1.3 2.8-1.3 4.2 0s2.8 1.3 4.2 0 2.8-1.3 4.2 0 2.8 1.3 4.2 0" stroke={color} strokeWidth={1.6} {...BASE} />
    <Path d="M2.6 21.4c1.4-1.3 2.8-1.3 4.2 0s2.8 1.3 4.2 0" stroke={color} strokeWidth={1.6} {...BASE} />
  </Svg>
);

export const MountainMark = ({ size = 30, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M2.4 18.2h19.2" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M3.4 12.6 8.2 8.6l4.8 4" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M4.7 12.4v5.8h7v-5.8" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M7 18.2v-3.4h2.4v3.4" stroke={color} strokeWidth={1.5} {...BASE} />
    <Path d="M10.8 8.2 14.9 4.4l4.6 6" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M18.4 10.8 15.4 15.4h6z" stroke={color} strokeWidth={1.6} {...BASE} />
    <Line x1={18.4} y1={15.4} x2={18.4} y2={18.2} stroke={color} strokeWidth={1.5} {...BASE} />
  </Svg>
);

export const CityMark = ({ size = 30, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M5.4 17.6 13.2 5.4" stroke={color} strokeWidth={1.7} {...BASE} />
    <Path d="M10.2 17.6 18 5.4" stroke={color} strokeWidth={1.7} {...BASE} />
    <Line x1={6.8} y1={15.4} x2={15.6} y2={15.4} stroke={color} strokeWidth={1.5} {...BASE} />
    <Line x1={8} y1={13.6} x2={16.8} y2={13.6} stroke={color} strokeWidth={1.5} {...BASE} />
    <Line x1={9.2} y1={11.8} x2={18} y2={11.8} stroke={color} strokeWidth={1.5} {...BASE} />
    <Line x1={10.4} y1={10} x2={19.2} y2={10} stroke={color} strokeWidth={1.5} {...BASE} />
    <Line x1={13.2} y1={5.4} x2={13.2} y2={2.8} stroke={color} strokeWidth={1.6} {...BASE} />
    <Path d="M13.2 2.8h4.2l-1.6 1.5 1.6 1.5h-4.2z" stroke={color} strokeWidth={1.5} {...BASE} />
    <Path d="M4.6 19.6c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0 2.8-1.2 4.2 0" stroke={color} strokeWidth={1.6} {...BASE} />
    <Path d="M4.6 21.5c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0" stroke={color} strokeWidth={1.6} {...BASE} />
  </Svg>
);

export type DestinationGlyph = 'nearby' | 'lake' | 'mountain' | 'city';

const MARKS: Record<DestinationGlyph, React.ComponentType<P>> = {
  nearby: NearbyMark, lake: LakeMark, mountain: MountainMark, city: CityMark,
};

export const DestinationMark = ({ glyph, size = 30, color }: { glyph: DestinationGlyph } & P) => {
  const Mark = MARKS[glyph];
  return <Mark size={size} color={color} />;
};
