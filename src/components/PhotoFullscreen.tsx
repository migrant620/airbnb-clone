import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions } from 'react-native';
import { colors, type } from '../tokens';
import { CloseIcon } from './Icons';
import { detailListing, PHOTO_TOTAL } from '../data';

export const PhotoFullscreen = ({ startIndex, onClose }: { startIndex: number; onClose: () => void }) => {
  const photos = detailListing.photos;
  const { width } = useWindowDimensions();
  const pageW = Math.min(width, 393);
  const [index, setIndex] = React.useState(startIndex);
  const ref = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    ref.current?.scrollTo({ x: startIndex * pageW, animated: false });
  }, [startIndex, pageW]);

  return (
    <View style={styles.root} aria-modal={true} role="dialog" accessibilityLabel="Photo viewer">
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / pageW);
          if (i !== index) setIndex(i);
        }}
        scrollEventThrottle={32}
        style={styles.pager}
      >
        {photos.map((p, i) => (
          <View key={p.category} style={[styles.page, { width: pageW }]}>
            <Image
              source={p.file}
              style={styles.photo}
              resizeMode="contain"
              accessibilityLabel={`${p.category}, photo ${i + 1}`}
            />
          </View>
        ))}
      </ScrollView>

      <Text style={[type.pdpCounter, styles.counter, styles.noHit]} numberOfLines={1}>
        {index + 1} / {PHOTO_TOTAL}
      </Text>
      <Text style={[type.pdpCounter, styles.caption, styles.noHit]} numberOfLines={1}>
        {photos[index]?.category ?? ''}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.close}
      >
        <CloseIcon size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.black, zIndex: 65 },
  pager: { flex: 1 },
  page: { height: '100%', alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '70%' },
  close: { position: 'absolute', left: 8, top: 8.4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  counter: { position: 'absolute', top: 24.4, left: 0, right: 0, textAlign: 'center' },
  noHit: { pointerEvents: 'none' },
  caption: { position: 'absolute', bottom: 32, left: 24, right: 24, textAlign: 'center', fontWeight: '400' },
});
