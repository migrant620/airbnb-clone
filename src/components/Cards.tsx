import * as React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, type, space, radii } from '../tokens';
import { PhotoHeartIcon, StarIcon } from './Icons';
import type { Listing } from '../data';

export const listingLabel = (l: Listing) =>
  [l.badge, l.title, l.priceForNights, `${String(l.rating)} out of 5 average rating.`]
    .filter(Boolean)
    .join('. ')
    .replace(/,(\S)/g, ', $1');

export const ListingCard = React.memo(({
  listing,
  onOpen,
  onHeart,
  height,
  imageHeight,
  favorite,
}: {
  listing: Listing;
  onOpen: () => void;
  onHeart: () => void;
  height?: number;
  imageHeight?: number;
  favorite?: boolean;
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={listingLabel(listing)}
    onPress={onOpen}
    activeOpacity={0.9}
  >
    <View style={[styles.card, height ? { height } : null]}>
      <Image
        source={listing.photo}
        style={[styles.image, imageHeight ? { height: imageHeight } : null]}
        resizeMode="cover"
      />
      {listing.badge ? (
        <View style={styles.badge} pointerEvents="none">
          <Text style={styles.badgeText}>{listing.badge}</Text>
        </View>
      ) : null}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Save to wishlist"
        onPress={onHeart}
        style={styles.heart}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <PhotoHeartIcon size={24} fill={favorite ? colors.brand : undefined} />
      </TouchableOpacity>
      <View style={styles.textBlock} aria-hidden={true}>
        <Text style={[type.cardTitle, styles.title]} numberOfLines={2}>{listing.title}</Text>
        <View style={styles.priceRow}>
          <Text style={[type.cardPrice, styles.priceSmall]}>{listing.priceForNights}</Text>
          <View style={styles.dotSep} pointerEvents="none" />
          <StarIcon size={10.2} color={colors.secondary} />
          <Text style={[type.cardRatingNum, styles.priceSmall]}>{String(listing.rating)}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: { width: space.cardWidth },
  image: {
    width: space.cardWidth, height: space.cardImageHeight,
    borderTopLeftRadius: radii.cardImage, borderTopRightRadius: radii.cardImage,
    borderBottomLeftRadius: radii.cardImage, borderBottomRightRadius: radii.cardImage,
    backgroundColor: colors.mapBlock,
  },
  badge: {
    position: 'absolute', top: 12, left: 12, height: 22.6,
    backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 9.9,
    borderRadius: 11.3, justifyContent: 'center',
  },
  badgeText: { ...type.badgePill, fontSize: 11, lineHeight: 22.6 },
  priceSmall: { fontSize: 12, lineHeight: 16, color: colors.secondary },
  heart: {
    position: 'absolute', top: 8.5, right: 8,
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
  },
  textBlock: { paddingTop: 4.7, paddingHorizontal: 4 },
  title: { lineHeight: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3.3, gap: 2, flexWrap: 'nowrap' },
  dotSep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.secondary, flexShrink: 0 },
});
