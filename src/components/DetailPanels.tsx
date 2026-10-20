import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors, type, space } from '../tokens';
import { BackIcon, StarIcon } from './Icons';
import { detailListing } from '../data';


const Header = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Navigate up"
      onPress={onClose}
      activeOpacity={0.7}
      style={styles.backBtn}
    >
      <BackIcon size={16} color={colors.ink} />
    </TouchableOpacity>
    <Text style={[type.tourTitle, styles.headerTitle]} numberOfLines={1}>{title}</Text>
  </View>
);

const Page = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <View style={styles.root} aria-modal={true} role="dialog" accessibilityLabel={title}>
    <Header title={title} onClose={onClose} />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
      {children}
      <View style={styles.footerSpace} pointerEvents="none" />
    </ScrollView>
  </View>
);

export const AboutSpaceScreen = ({ onClose }: { onClose: () => void }) => (
  <Page title="About this space" onClose={onClose}>
    <Text style={[type.pdpTitle, styles.left]}>{detailListing.title}</Text>
    <Text style={[type.pdpSub, styles.left, styles.gap6]}>{detailListing.location}</Text>
    <View style={styles.rule} />
    {detailListing.body.split('\n\n').map((p) => (
      <Text key={p.slice(0, 24)} style={[type.pdpBody, styles.para]}>{p}</Text>
    ))}
  </Page>
);

const dollars = (s: string) => Number(s.replace(/[^0-9.]/g, ''));

export const PriceDetailsScreen = ({ onClose, onReserve }: { onClose: () => void; onReserve: () => void }) => {
  const was = dollars(detailListing.priceWas);
  const now = dollars(detailListing.priceNow);
  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: `1 night x ${detailListing.priceWas}`, value: detailListing.priceWas },
    { label: 'Special offer', value: `-$${was - now}`, accent: true },
  ];
  return (
    <Page title="Price details" onClose={onClose}>
      <Text style={[type.pdpHostSub, styles.left]}>{detailListing.priceNote}</Text>
      <View style={styles.rule} />
      {rows.map((r) => (
        <View key={r.label} style={styles.priceRow}>
          <Text style={[type.pdpBlockDesc, styles.priceLabel]} numberOfLines={1}>{r.label}</Text>
          <Text style={[type.pdpBlockTitle, r.accent ? styles.saving : null]} numberOfLines={1}>{r.value}</Text>
        </View>
      ))}
      <View style={styles.rule} />
      <View style={styles.priceRow}>
        <Text style={[type.pdpHostName, styles.priceLabel]} numberOfLines={1}>Total USD</Text>
        <Text style={type.pdpHostName} numberOfLines={1}>{detailListing.priceNow}</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Reserve"
        onPress={onReserve}
        activeOpacity={0.9}
        style={styles.reserve}
      >
        <Text style={type.pdpReserve}>Reserve</Text>
      </TouchableOpacity>
    </Page>
  );
};

export const HostScreen = ({ onClose, onMessage }: { onClose: () => void; onMessage: () => void }) => {
  const { host, photos, rating, reviews } = detailListing;
  const [years] = host.sub.match(/\d+ years?/) ?? ['3 years'];
  const stats = [
    { value: String(reviews), label: 'Reviews' },
    { value: rating, label: 'Rating', star: true },
    { value: years.split(' ')[0], label: 'Years hosting' },
  ];
  return (
    <Page title="Meet your host" onClose={onClose}>
      <View style={styles.hostCard}>
        <View style={styles.hostLeft}>
          <Image source={photos[0].file} style={styles.hostAvatar} resizeMode="cover" />
          <Text style={[type.pdpHostName, styles.centred]} numberOfLines={2}>{host.name}</Text>
          <Text style={[type.pdpHostSub, styles.centred]} numberOfLines={1}>{host.superhost}</Text>
        </View>
        <View style={styles.hostStats}>
          {stats.map((s, i) => (
            <View key={s.label} style={[styles.stat, i < stats.length - 1 ? styles.statRule : null]}>
              <View style={styles.statValueRow}>
                <Text style={type.pdpRating}>{s.value}</Text>
                {s.star ? <StarIcon size={11} color={colors.ink} /> : null}
              </View>
              <Text style={type.pdpBlockDesc}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={[type.pdpBlockTitle, styles.gap24]}>{host.name} is a Superhost</Text>
      <Text style={[type.pdpBlockDesc, styles.gap6]}>
        Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Message host"
        onPress={onMessage}
        activeOpacity={0.8}
        style={styles.outlineBtn}
      >
        <Text style={type.pdpBlockTitle}>Message host</Text>
      </TouchableOpacity>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.white, zIndex: 62, overflow: 'hidden',
  },
  header: {
    height: 64.8, borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft,
  },
  backBtn: { position: 'absolute', left: 8, top: 8.4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { position: 'absolute', left: 56, top: 22.2, right: 24 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: space.contentPad, paddingTop: 24 },
  footerSpace: { height: 40 },
  left: { textAlign: 'left' },
  centred: { textAlign: 'center' },
  gap6: { marginTop: 6 },
  gap24: { marginTop: 24 },
  rule: { height: 1, backgroundColor: colors.hairline, marginVertical: 20 },
  para: { marginBottom: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel: { flexShrink: 1, marginRight: 12 },
  saving: { color: colors.reserve },
  reserve: {
    marginTop: 28, height: 49.1, borderRadius: 24.6, backgroundColor: colors.reserve,
    alignItems: 'center', justifyContent: 'center',
  },
  hostCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.hairlineSoft,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  hostLeft: { flex: 1, alignItems: 'center', paddingRight: 12 },
  hostAvatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 10, backgroundColor: colors.mapBlock },
  hostStats: { width: 108 },
  stat: { paddingVertical: 10 },
  statRule: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  outlineBtn: {
    marginTop: 24, height: 48, borderWidth: 1, borderColor: colors.ink, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});
