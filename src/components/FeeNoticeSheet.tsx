import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { colors, fonts } from '../tokens';
import { CloseIcon } from './Icons';


const SHEET_TOP = 383.5;
const rel = (y: number) => y - SHEET_TOP;

const TagArt = () => (
  <Svg width={83} height={86} viewBox="0 0 83 86">
    <Path d="M14 30 L40 8 L72 40 L44 76 L18 70 Z" fill="#DEDBD5" />
    <Path d="M22 22 L50 10 L80 44 L50 80 L20 54 Z" fill="#F54073" />
    <Circle cx={33} cy={26} r={5.2} fill="#E9C77A" />
    <Circle cx={33} cy={26} r={2.8} fill="#F4F2EC" />
    <Path d="M33 26 C26 18 18 10 8 4" stroke="#9C9A96" strokeWidth={2.2} fill="none" strokeLinecap="round" />
  </Svg>
);

export const FeeNoticeSheet = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.root} aria-modal={true} role="dialog" accessibilityLabel="Prices include all fees">
    <TouchableWithoutFeedback onPress={onClose} accessible={false}>
      <View style={styles.scrim} />
    </TouchableWithoutFeedback>
    <View style={styles.sheet}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.closeHit}
      >
        <CloseIcon size={16} color={colors.ink} />
      </TouchableOpacity>
      <View style={styles.art} pointerEvents="none" aria-hidden={true}>
        <TagArt />
      </View>
      <Text style={styles.notice}>Now you’ll see one price for your trip, all fees included.</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Got it"
        onPress={onClose}
        activeOpacity={0.9}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Got it</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 60 },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 777 - SHEET_TOP,
    backgroundColor: '#F4F2EC', borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },
  closeHit: {
    position: 'absolute', top: rel(407.6) - 16, right: 393 - 369 - 16, width: 48, height: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  art: { position: 'absolute', top: rel(463.2), left: 155.7, width: 83, height: 86 },
  notice: {
    position: 'absolute', top: rel(594.6), left: 36, right: 36,
    fontFamily: fonts.sans, fontSize: 22, lineHeight: 26.2, fontWeight: '600' as const,
    letterSpacing: -0.45, color: colors.ink, textAlign: 'center',
  },
  button: {
    position: 'absolute', top: rel(689.6), left: 24, right: 24.4, height: 48,
    borderRadius: 11, backgroundColor: '#222222', alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 20, fontWeight: '600' as const, letterSpacing: -0.21, color: colors.white },
});
