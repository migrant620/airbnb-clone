import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  TextStyle,
} from 'react-native';
import { colors, type, space, radii, shadow } from '../tokens';
import { CloseIcon, PlusIcon, MinusIcon } from './Icons';
import { filterChips } from '../data';


type PlaceType = 'Any' | 'Private room' | 'Entire home';

const PLACE_TYPES: PlaceType[] = ['Any', 'Private room', 'Entire home'];

const STEP_ROWS: { key: 'bedrooms' | 'beds' | 'baths'; label: string }[] = [
  { key: 'bedrooms', label: 'Bedrooms' },
  { key: 'beds', label: 'Beds' },
  { key: 'baths', label: 'Bathrooms' },
];

const Stepper = ({
  value,
  onValue,
}: {
  value: number;
  onValue: (n: number) => void;
}) => {
  const dec = () => onValue(Math.max(0, value - 1));
  const inc = () => onValue(value + 1);
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="decrease"
        onPress={dec}
        disabled={value === 0}
        activeOpacity={0.7}
        style={[styles.stepBtn, value === 0 ? styles.stepBtnDisabled : null]}
      >
        <MinusIcon size={16} color={value === 0 ? colors.secondary : colors.ink} />
      </TouchableOpacity>
      <Text style={[type.counterValue, styles.stepValue]} numberOfLines={1}>
        {value === 0 ? 'Any' : String(value)}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="increase"
        onPress={inc}
        activeOpacity={0.7}
        style={styles.stepBtn}
      >
        <PlusIcon size={16} color={colors.ink} />
      </TouchableOpacity>
    </View>
  );
};

export type FilterState = {
  placeType: PlaceType;
  amenities: number[];
  rooms: { bedrooms: number; beds: number; baths: number };
  minPrice: string;
  maxPrice: string;
};

export const initialFilters: FilterState = {
  placeType: 'Any',
  amenities: [],
  rooms: { bedrooms: 0, beds: 0, baths: 0 },
  minPrice: '',
  maxPrice: '',
};

export const appliedCount = (f: FilterState) =>
  (f.placeType !== 'Any' ? 1 : 0) + f.amenities.length + (f.rooms.bedrooms > 0 ? 1 : 0) +
  (f.rooms.beds > 0 ? 1 : 0) + (f.rooms.baths > 0 ? 1 : 0) + (f.minPrice !== '' || f.maxPrice !== '' ? 1 : 0);

export const toggleAmenityIn = (f: FilterState, i: number): FilterState => ({
  ...f,
  amenities: f.amenities.includes(i) ? f.amenities.filter((a) => a !== i) : [...f.amenities, i].sort((a, b) => a - b),
});

const digits = (t: string) => t.replace(/[^0-9]/g, '').slice(0, 6);

export const FiltersSheet = ({
  onClose,
  value,
  onChange,
}: {
  onClose: () => void;
  value: FilterState;
  onChange: (next: FilterState) => void;
}) => {
  const { placeType, rooms } = value;
  const setPlaceType = (t: PlaceType) => onChange({ ...value, placeType: t });
  const setRooms = (fn: (r: FilterState['rooms']) => FilterState['rooms']) => onChange({ ...value, rooms: fn(rooms) });
  const toggleAmenity = (i: number) => onChange(toggleAmenityIn(value, i));
  const clearAll = () => onChange(initialFilters);

  return (
    <View style={styles.scrim}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.scrimTouch} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet} role="dialog" aria-modal={true}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={[type.sheetTitle, styles.headerTitle]} numberOfLines={1}>Filters</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.headerClose}
          >
            <CloseIcon size={16} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} bounces={false}>
          <Text style={[type.sheetSectionTitle, styles.sectionTitle]}>Price range</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInput}>
              <Text style={type.inputPlaceholder} numberOfLines={1}>{value.minPrice === '' ? 'Min' : '$'}</Text>
              <TextInput
                accessibilityLabel="Minimum price"
                value={value.minPrice}
                onChangeText={(t) => onChange({ ...value, minPrice: digits(t) })}
                keyboardType="number-pad"
                style={priceField}
              />
            </View>
            <Text style={styles.priceDash} numberOfLines={1}>–</Text>
            <View style={styles.priceInput}>
              <Text style={type.inputPlaceholder} numberOfLines={1}>{value.maxPrice === '' ? 'Max' : '$'}</Text>
              <TextInput
                accessibilityLabel="Maximum price"
                value={value.maxPrice}
                onChangeText={(t) => onChange({ ...value, maxPrice: digits(t) })}
                keyboardType="number-pad"
                style={priceField}
              />
            </View>
          </View>

          <View style={styles.divider} pointerEvents="none" />

          <Text style={[type.sheetSectionTitle, styles.sectionTitle]}>Type of place</Text>
          <View style={styles.segment}>
            {PLACE_TYPES.map((t) => {
              const sel = t === placeType;
              return (
                <TouchableOpacity
                  key={t}
                  accessibilityRole="button"
                  accessibilityLabel={t}
                  accessibilityState={{ selected: sel }}
                  onPress={() => setPlaceType(t)}
                  activeOpacity={0.8}
                  style={[styles.segmentBtn, sel ? styles.segmentBtnSelected : null]}
                >
                  <Text style={[type.filterChip, sel ? styles.segmentTextSelected : styles.segmentText]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} pointerEvents="none" />

          <Text style={[type.sheetSectionTitle, styles.sectionTitle]}>Rooms and beds</Text>
          {STEP_ROWS.map(({ key, label }, idx) => (
            <View key={key} style={[styles.stepRow, idx < STEP_ROWS.length - 1 ? styles.stepRowBordered : null]}>
              <Text style={type.counterLabel} numberOfLines={1}>{label}</Text>
              <Stepper
                value={rooms[key]}
                onValue={(n) => setRooms((r) => ({ ...r, [key]: n }))}
              />
            </View>
          ))}

          <View style={styles.divider} pointerEvents="none" />

          <Text style={[type.sheetSectionTitle, styles.sectionTitle]}>Amenities</Text>
          <View style={styles.chipWrap}>
            {filterChips.map((label, i) => {
              const sel = value.amenities.includes(i);
              return (
                <TouchableOpacity
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: sel }}
                  onPress={() => toggleAmenity(i)}
                  activeOpacity={0.8}
                  style={[styles.chip, sel ? styles.chipSelected : null]}
                >
                  <Text style={[type.filterChip, sel ? styles.chipTextSelected : styles.chipText]} numberOfLines={1}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Clear all"
            onPress={clearAll}
            activeOpacity={0.7}
            style={styles.clearBtn}
          >
            <Text style={[type.sheetTitle, styles.clearText]}>Clear all</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Show 312 homes"
            onPress={onClose}
            activeOpacity={0.9}
            style={styles.showBtn}
          >
            <Text style={[type.reserveBtn, styles.showText]} numberOfLines={1}>Show 312 homes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'flex-end', zIndex: 56,
  },
  scrimTouch: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim },
  sheet: {
    width: '100%',
    maxHeight: '88%',
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.sheetTop,
    borderTopRightRadius: radii.sheetTop,
    ...shadow.sheet,
    paddingBottom: space.sheetPad,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    height: 56, paddingHorizontal: space.sheetPad, borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft,
  },
  headerSpacer: { width: 32 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17 },
  headerClose: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  body: { paddingHorizontal: space.sheetPad },
  sectionTitle: { marginTop: 24, marginBottom: 14 },
  divider: { height: 1, backgroundColor: colors.hairlineSoft, marginVertical: 24 },

  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceInput: {
    flex: 1, height: 56, borderWidth: 1, borderColor: colors.hairline, borderRadius: 12,
    backgroundColor: colors.white, justifyContent: 'center', paddingHorizontal: 16,
  },
  priceDash: { width: 20, textAlign: 'center', color: colors.secondary, fontSize: 16 },

  segment: { flexDirection: 'row', gap: 8 },
  segmentBtn: {
    flex: 1, height: 44, borderWidth: 1, borderColor: colors.hairline, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
  },
  segmentBtnSelected: { backgroundColor: colors.chipSelected, borderColor: colors.chipSelected },
  segmentText: { color: colors.ink },
  segmentTextSelected: { color: colors.ink },

  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56 },
  stepRowBordered: { borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.hairline,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepValue: { minWidth: 48, textAlign: 'center' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    height: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: colors.hairline,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
  },
  chipSelected: { backgroundColor: colors.chipSelected, borderColor: colors.chipSelected },
  chipText: { color: colors.ink },
  chipTextSelected: { color: colors.ink },

  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: space.sheetPad, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.hairlineSoft,
    marginTop: 8,
  },
  clearBtn: { paddingVertical: 12 },
  clearText: { fontSize: 17 },
  showBtn: {
    height: 48, paddingHorizontal: 24, borderRadius: 24, backgroundColor: colors.searchPink,
    alignItems: 'center', justifyContent: 'center',
  },
  showText: { color: colors.white },
});

const priceField = {
  position: 'absolute', left: 28, right: 12, top: 0, bottom: 0,
  fontFamily: type.inputValue.fontFamily, fontSize: type.inputValue.fontSize, color: colors.ink,
  backgroundColor: 'transparent', borderWidth: 0, outlineStyle: 'none',
} as unknown as TextStyle;
