import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { colors, fonts, type, space, radii, shadow } from '../tokens';
import { CloseIcon, SearchIcon, StarIcon } from './Icons';
import { Calendar, DayRange } from './Calendar';
import { CounterRow } from './GuestCounter';
import { DestinationMark } from './DestinationMarks';
import { destinations } from '../data';

export type Guests = { adults: number; children: number; infants: number; pets: number };

type Props = {
  step: 'where' | 'when' | 'who';
  setStep: (s: 'where' | 'when' | 'who') => void;
  category: string;
  setCategory: (c: string) => void;
  destination: string | null;
  pickDestination: (d: string) => void;
  range: DayRange;
  setRange: (r: DayRange) => void;
  guests: Guests;
  guestsTouched: boolean;
  setGuests: (g: Guests) => void;
  onClose: () => void;
  onClear: () => void;
  onSearch: () => void;
};

const SEG = ['Homes', 'Experiences', 'Services'];
const SEG_TRACK: Record<string, number> = { Homes: -0.2, Experiences: -0.255, Services: -0.325 };
const INK = colors.ink;
const INK_SECONDARY = colors.secondary;
const INK_BLACK = '#000000';
const INK_DISABLED = '#C1C1C1';
const PICKER: Record<string, string> = {
  where: 'Location picker, Step 1 of 3',
  when: 'Date Picker, Step 2 of 3',
  who: 'Guest Picker, Step 3 of 3',
};
const ACTIVE_H: Record<string, number> = { where: 428.7, when: 504.7, who: 362.8 };
const INACTIVE_H = 60;
const CARD_GAP = 16;
const FOOTER_H = 79;
const FLEX_CHIPS = [
  { label: 'Exact dates', width: 89.2 },
  { label: '± 1 day', width: 75.7 },
  { label: '± 2 days', width: 83.0 },
  { label: '± 3 days', width: 83.0 },
];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const SearchSheet = (p: Props) => {
  const { width } = useWindowDimensions();
  const wide = width >= 393;
  const [flexIndex, setFlexIndex] = React.useState(0);

  const toggleRange = (d: Date) => {
    const { start, end } = p.range;
    if (!start || (start && end)) p.setRange({ start: d, end: null });
    else if (d > start) p.setRange({ start, end: d });
    else p.setRange({ start: d, end: null });
  };

  const rangeText = () => {
    const f = (dt: Date | null) => (dt ? `${MONTHS[dt.getMonth()].slice(0, 3)} ${dt.getDate()}` : null);
    const a = f(p.range.start);
    const b = f(p.range.end);
    if (a && b) return `${a} – ${b}`;
    if (a) return a;
    return 'Add dates';
  };

  const guestText = () =>
    (p.guestsTouched ? `${p.guests.adults + p.guests.children} ${p.guests.adults + p.guests.children === 1 ? 'guest' : 'guests'}` : 'Add guests');

  const setG = (k: keyof Guests, delta: number) => {
    p.setGuests({ ...p.guests, [k]: Math.max(0, p.guests[k] + delta) });
  };

  const isWhen = p.step === 'when';
  const footerLeft = isWhen ? 'Reset' : 'Clear all';
  const footerRight = isWhen ? 'Next' : 'Search';
  const canClear = p.destination !== null || p.range.start !== null || p.guestsTouched;

  const InactiveRow = ({ title, value, valueColor }: { title: string; value: string; valueColor?: string }) => {
    const digits = (value.match(/\d/g) || []).length;
    return (
      <View style={styles.inactiveRow}>
        <Text style={styles.inactiveTitle}>{title}</Text>
        <Text
          style={[
            styles.inactiveValue,
            valueColor ? { color: valueColor } : null,
            digits ? { letterSpacing: -0.15 - (1.6 * digits) / value.length } : null,
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    );
  };

  const StepCard = ({
    active, label, onPress, height, children,
  }: {
    active: boolean; label: string; onPress: () => void; height: number; children?: React.ReactNode;
  }) => {
    if (!active) {
      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={onPress}
          style={[styles.stepCard, { height }]}
        >
          {children}
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.stepCard, styles.stepCardActive, { height }]}>
        <View accessibilityRole="button" accessibilityLabel={label} style={styles.cardLabel} pointerEvents="none" />
        <View style={styles.stepInner}>{children}</View>
      </View>
    );
  };

  const padTop = p.step === 'where' ? 18.1 : 23;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.scrim} onPress={p.onClose} accessible={false} />
      <View style={styles.panel} aria-modal={true} role="dialog">
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" onPress={p.onClose} style={styles.closeBtn}>
            <View accessibilityRole="button" accessibilityLabel="Close" style={styles.closeHit} />
            <View style={styles.closeDisc} pointerEvents="none" />
            <View pointerEvents="none">
              <CloseIcon size={16} color={INK} />
            </View>
          </TouchableOpacity>
          <View style={[styles.seg, { width: Math.min(248.2, width - 72.4 - 72) }]}>
            {SEG.map((s) => {
              const sel = s === p.category;
              const icon = s === 'Homes' ? '🏠' : s === 'Experiences' ? '🎈' : '🛎';
              return (
                <TouchableOpacity
                  key={s}
                  accessibilityRole="tab"
                  accessibilityLabel={s}
                  accessibilityState={{ selected: sel }}
                  onPress={() => p.setCategory(s)}
                  style={styles.segBtn}
                >
                  <Text style={styles.segIcon} aria-hidden={true}>{icon}</Text>
                  <Text style={[sel ? styles.segSel : styles.segUnsel, { letterSpacing: SEG_TRACK[s] }]}>{s}</Text>
                  {sel ? <View style={styles.segUnderline} pointerEvents="none" /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner}>
          <StepCard active={p.step === 'where'} label={PICKER.where} height={p.step === 'where' ? ACTIVE_H.where : INACTIVE_H} onPress={() => p.setStep('where')}>
            {p.step === 'where' ? (
              <View style={[styles.stepBody, { paddingTop: padTop }]}>
                <Text style={styles.stepTitle}>Where?</Text>
                <View style={styles.searchInput}>
                  <SearchIcon size={18} color={INK_SECONDARY} />
                  <Text style={styles.inputPlaceholder}>Search destinations</Text>
                </View>
                <Text style={styles.caption}>Suggested destinations</Text>
                <View style={styles.destList}>
                  {destinations.map((d) => (
                    <TouchableOpacity key={d.name} accessibilityRole="button" accessibilityLabel={d.name} onPress={() => { p.pickDestination(d.name); p.setStep('when'); }} style={styles.destRow}>
                      <View style={[styles.destThumb, { backgroundColor: d.tile }]} pointerEvents="none">
                        <DestinationMark glyph={d.glyph} size={30} color={d.ink} />
                      </View>
                      <View style={styles.destText}>
                        <Text style={styles.destName}>{d.name}</Text>
                        <Text style={styles.destSub} numberOfLines={2}>{d.sub}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.destFade} pointerEvents="none" />
                </View>
              </View>
            ) : (
              <InactiveRow title="Where" value={p.destination ?? 'Nearby'} valueColor={INK} />
            )}
          </StepCard>

          <View style={{ height: CARD_GAP }} />

          <StepCard active={p.step === 'when'} label={PICKER.when} height={p.step === 'when' ? ACTIVE_H.when : INACTIVE_H} onPress={() => p.setStep('when')}>
            {p.step === 'when' ? (
              <View style={[styles.stepBody, styles.stepBodyWhen, { paddingTop: padTop }]}>
                <Text style={styles.stepTitleBold}>When?</Text>
                <View style={styles.dateSeg} pointerEvents="none" aria-hidden={true}>
                  <View style={styles.dateSegPill}>
                    <Text style={styles.dateSegPillText}>Dates</Text>
                  </View>
                  <Text style={styles.dateSegText}>Flexible</Text>
                </View>
                <View style={styles.calendarWrap}>
                  <Calendar year={2026} months={[8, 9]} range={p.range} onSelect={toggleRange} today={new Date(2026, 8, 19)} />
                </View>
                <View style={styles.flexChips} accessibilityRole="radiogroup">
                  {FLEX_CHIPS.map((c, i) => (
                    <TouchableOpacity
                      key={c.label}
                      accessibilityRole="radio"
                      accessibilityLabel={c.label}
                      accessibilityState={{ checked: i === flexIndex }}
                      aria-checked={i === flexIndex}
                      onPress={() => setFlexIndex(i)}
                      activeOpacity={0.8}
                      style={[styles.chip, i === flexIndex ? styles.chipExact : null, { width: c.width }]}
                    >
                      <Text style={styles.chipText} aria-hidden={true}>{c.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <InactiveRow title="When" value={rangeText()} />
            )}
          </StepCard>

          <View style={{ height: CARD_GAP }} />

          <StepCard active={p.step === 'who'} label={PICKER.who} height={p.step === 'who' ? ACTIVE_H.who : INACTIVE_H} onPress={() => p.setStep('who')}>
            {p.step === 'who' ? (
              <View style={[styles.stepBody, { paddingTop: padTop }]}>
                <Text style={styles.stepTitleBold}>Who?</Text>
                <View style={styles.counters}>
                  <CounterRow label="Adults" caption="Ages 13 or above" value={p.guestsTouched ? p.guests.adults : 0} min={0} max={16} onDec={() => setG('adults', -1)} onInc={() => setG('adults', 1)} />
                  <CounterRow label="Children" caption="Ages 2 – 12" value={p.guests.children} min={0} max={15} onDec={() => setG('children', -1)} onInc={() => setG('children', 1)} />
                  <CounterRow label="Infants" caption="Under 2" value={p.guests.infants} min={0} max={5} onDec={() => setG('infants', -1)} onInc={() => setG('infants', 1)} />
                  <CounterRow label="Pets" caption="Bringing a service animal?" captionColor={INK_BLACK} captionRow value={p.guests.pets} min={0} max={5} onDec={() => setG('pets', -1)} onInc={() => setG('pets', 1)} />
                </View>
              </View>
            ) : (
              <InactiveRow title="Who" value={guestText()} />
            )}
          </StepCard>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={footerLeft}
            accessibilityState={{ disabled: !canClear }}
            disabled={!canClear}
            onPress={p.onClear}
            style={styles.footerLeft}
          >
            <Text style={[styles.footerText, canClear ? null : styles.footerTextDisabled]}>{footerLeft}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={footerRight}
            onPress={() => (isWhen ? p.setStep('who') : p.onSearch())}
            style={[styles.searchBtn, isWhen ? styles.searchBtnWhen : styles.searchBtnSearch, wide ? styles.searchBtnWide : styles.searchBtnNarrow]}
          >
            {wide && !isWhen ? (
              <View style={styles.searchBtnGlyph} pointerEvents="none">
                <SearchIcon size={18} color={colors.white} />
              </View>
            ) : null}
            <Text style={[styles.footerRight, isWhen ? styles.footerRightWhen : styles.footerRightSearch]}>{footerRight}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.sheetBackdrop },
  panel: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.sheetBackdrop,
  },
  header: { position: 'absolute', top: 0, left: 0, right: 0, height: 70, zIndex: 2 },
  closeBtn: { position: 'absolute', right: 16, top: 14.9, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  closeDisc: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white },
  closeHit: { position: 'absolute', right: 16, top: 16.1, width: 16, height: 16 },
  seg: { position: 'absolute', top: 24, left: 72.4, width: 248.2, height: 45, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4 },
  segBtn: { width: 80.1, flexShrink: 1, height: 45, alignItems: 'center' },
  segIcon: { fontSize: 26, lineHeight: 26, height: 26, marginBottom: 6.55 },
  segUnderline: { position: 'absolute', top: 49, alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: INK_BLACK },
  segSel: { fontFamily: fonts.sans, fontSize: 10, lineHeight: 13, fontWeight: '600' as const, letterSpacing: -0.2, color: INK_BLACK },
  segUnsel: { fontFamily: fonts.sans, fontSize: 10, lineHeight: 13, fontWeight: '600' as const, letterSpacing: -0.2, color: INK_SECONDARY },
  body: { position: 'absolute', top: 70, left: 0, right: 0, bottom: FOOTER_H + 1 },
  bodyInner: { paddingTop: 31.2, paddingHorizontal: 16, paddingBottom: 16 },
  stepCard: {
    borderWidth: 1, borderColor: 'transparent', borderRadius: radii.stepRadius, overflow: 'hidden',
    backgroundColor: colors.white, position: 'relative',
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  stepCardActive: { marginHorizontal: -4 },
  stepBodyWhen: { height: 502.7, overflow: 'hidden' },
  cardLabel: { position: 'absolute', top: -1, left: -1, right: -1, bottom: -1, zIndex: 0 },
  stepInner: { position: 'relative', zIndex: 1 },
  stepBody: { paddingHorizontal: 23, paddingBottom: 8 },
  stepTitle: {
    fontFamily: fonts.sans, fontSize: 20, lineHeight: 25.8, height: 25.8,
    fontWeight: '500' as const, letterSpacing: -0.28, color: INK,
  },
  stepTitleBold: {
    fontFamily: fonts.sans, fontSize: 20, lineHeight: 25.8, height: 25.8,
    fontWeight: '700' as const, letterSpacing: -0.28, color: INK,
  },
  destFade: {
    position: 'absolute', left: 0, right: 0, bottom: 6.3, height: 32.5,
    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${colors.white} 100%)`,
  } as unknown as import('react-native').ViewStyle,
  searchInput: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.fieldBorder,
    borderRadius: 12, paddingHorizontal: 23, height: 56, marginTop: 19.1, marginBottom: 0, gap: 10.1,
  },
  caption: {
    fontFamily: fonts.sans, fontSize: 12, lineHeight: 15.6, height: 15.6,
    fontWeight: '400' as const, letterSpacing: -0.256, color: INK, marginTop: 8, marginBottom: 4.1,
  },
  destList: { marginHorizontal: -8 },
  destRow: { height: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  destThumb: { width: 56, height: 56, borderRadius: 12, marginRight: 16, alignItems: 'center', justifyContent: 'center' },
  destText: { width: 249 },
  destName: {
    fontFamily: fonts.sans, fontSize: 14, lineHeight: 20.4, height: 20.4,
    fontWeight: '600' as const, letterSpacing: -0.245, color: INK, position: 'relative', top: -0.75,
  },
  destSub: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 18.2, fontWeight: '400' as const, letterSpacing: -0.195, color: colors.secondary },
  calendarWrap: { marginTop: 16.5, height: 340, overflow: 'hidden' },
  dateSeg: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.hairlineSoft,
    borderRadius: 21, height: 41.7, marginTop: 16.5, paddingHorizontal: 4,
  },
  dateSegPill: {
    flex: 1, height: 34, borderRadius: 17, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  dateSegPillText: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 18, fontWeight: '600' as const, color: INK },
  dateSegText: { flex: 1, textAlign: 'center', fontFamily: fonts.sans, fontSize: 14, lineHeight: 18, fontWeight: '600' as const, color: INK },
  flexChips: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingLeft: 23, paddingTop: 12.1, paddingBottom: 11,
    flexDirection: 'row', alignItems: 'center', gap: 12.3, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.hairline,
  },
  chip: {
    height: 32, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.hairline,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  chipExact: { borderWidth: 1.8, borderColor: INK },
  chipText: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 17, fontWeight: '400' as const, color: INK },
  counters: { marginTop: 8.35 },
  inactiveRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 19 },
  inactiveTitle: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 18.2, height: 18.2, fontWeight: '600' as const, letterSpacing: -0.15, color: INK_SECONDARY },
  inactiveValue: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 18.2, height: 18.2, fontWeight: '600' as const, letterSpacing: -0.27, color: INK_BLACK },
  inputPlaceholder: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 18.2, fontWeight: '400' as const, letterSpacing: -0.242, color: INK_SECONDARY, position: 'relative', top: 0.5 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: FOOTER_H, backgroundColor: colors.sheetBackdrop, zIndex: 2 },
  footerLeft: { position: 'absolute', left: 12, top: 16, width: 80.1, height: 48, paddingLeft: 12, paddingTop: 2, justifyContent: 'center' },
  footerText: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 20.7, fontWeight: '600' as const, letterSpacing: -0.105, color: INK },
  footerTextDisabled: { color: INK_DISABLED },
  searchBtn: {
    position: 'absolute', top: 16, width: 130.3, height: 48, borderRadius: 12,
    backgroundColor: colors.searchPink, justifyContent: 'center',
  },
  searchBtnSearch: { alignItems: 'flex-start', paddingLeft: 49.1 },
  searchBtnGlyph: { position: 'absolute', left: 16.6, top: 0, bottom: 0, justifyContent: 'center' },
  searchBtnWhen: { alignItems: 'center', backgroundColor: INK },
  searchBtnNarrow: { right: 24 },
  searchBtnWide: { left: 238.7 },
  footerRight: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 20, fontWeight: '700' as const, color: colors.white },
  footerRightSearch: { letterSpacing: 0.13 },
  footerRightWhen: { letterSpacing: 0.5125 },
});
