import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors, type, fonts, space } from '../tokens';
import { BackIcon, AmenityMark } from './Icons';
import { detailAmenities } from '../data';

export const AmenitiesScreen = ({ onClose, scrollOffset = 0, onScrollOffset }: { onClose: () => void; scrollOffset?: number; onScrollOffset?: (offset: number) => void }) => {
  const scroll = React.useRef<ScrollView>(null);
  const live = React.useRef(true);
  const initialOffset = React.useRef(scrollOffset);
  const restoring = React.useRef(true);
  const restore = () => {
    if (!restoring.current || !scroll.current) return;
    scroll.current.scrollTo({ y: initialOffset.current, animated: false });
    const node = scroll.current.getScrollableNode?.();
    if (typeof node?.scrollTop === 'number' && Math.abs(node.scrollTop - initialOffset.current) < 1) restoring.current = false;
  };
  React.useLayoutEffect(() => {
    live.current = true;
    const node = scroll.current?.getScrollableNode?.();
    return () => {
      live.current = false;
      if (typeof node?.scrollTop === 'number') onScrollOffset?.(node.scrollTop);
    };
  }, [onScrollOffset]);
  return (
  <View style={styles.root} aria-modal={true} role="dialog">
    <View style={styles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Navigate up"
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.backBtn}
      >
        <BackIcon size={22} color={colors.ink} />
      </TouchableOpacity>
      <Text style={[type.sheetTitle, styles.headerTitle]} numberOfLines={1}>What this place offers</Text>
      <View style={styles.headerSpacer} />
    </View>

    <ScrollView
      ref={scroll}
      onLayout={restore}
        onContentSizeChange={restore}
      onScroll={event => {
          if (!live.current || !scroll.current) return;
          const node = scroll.current?.getScrollableNode?.();
          const y = typeof node?.scrollTop === 'number' ? node.scrollTop : event.nativeEvent.contentOffset.y;
          if (restoring.current && Math.abs(y - initialOffset.current) > 1) return;
          restoring.current = false; onScrollOffset?.(y);
        }}
      scrollEventThrottle={100}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {detailAmenities.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle} numberOfLines={1}>{group.title}</Text>
          {group.items.map((a) => (
            <View key={a.label} style={styles.row}>
              <View style={styles.rowMark} pointerEvents="none">
                <AmenityMark glyph={a.glyph} size={24} color={colors.ink} />
              </View>
              <Text style={styles.rowLabel} numberOfLines={1}>{a.label}</Text>
            </View>
          ))}
        </View>
      ))}
      <View style={styles.footerSpace} pointerEvents="none" />
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.white, zIndex: 62, overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    height: 56, paddingHorizontal: space.sheetPad,
    borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft,
  },
  backBtn: { width: 40, height: 40, marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17 },
  headerSpacer: { width: 32 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: space.contentPad, paddingTop: 20 },

  group: { marginBottom: 26 },
  groupTitle: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 20, fontWeight: '600', color: colors.ink },
  row: {
    flexDirection: 'row', alignItems: 'center', height: 52,
    borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft,
  },
  rowMark: { width: 24, alignItems: 'center', justifyContent: 'center' },
  rowLabel: {
    flex: 1, marginLeft: 14,
    fontFamily: fonts.sans, fontSize: 15, lineHeight: 20, fontWeight: '400', color: colors.ink,
  },

  footerSpace: { height: 40 },
});
