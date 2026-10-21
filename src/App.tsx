import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, type, space, fontFiles, frame } from './tokens';
import { ExploreScreen } from './components/ExploreScreen';
import { FiltersSheet, FilterState, initialFilters, appliedCount, toggleAmenityIn } from './components/FiltersSheet';
import { EmptyState } from './components/EmptyState';
import { ListingCard } from './components/Cards';
import { BottomNav } from './components/Chrome';
import type { Guests } from './components/SearchSheet';
import type { DayRange } from './components/Calendar';
import { detailListing, detailListingCard, Listing } from './data';
import { useVariableWeightFont } from './webfont';

const loadSearch = () => import('./components/SearchSheet');
const loadResults = () => import('./components/ResultsScreen');
const loadDetail = () => import('./components/ListingDetail');
const loadPhotoViewer = () => import('./components/PhotoViewer');
const loadPhotoFullscreen = () => import('./components/PhotoFullscreen');
const loadPanels = () => import('./components/DetailPanels');
const loadReviews = () => import('./components/ReviewsScreen');
const loadAmenities = () => import('./components/AmenitiesScreen');
const loadLogin = () => import('./components/LoginSheet');
const loadFeeNotice = () => import('./components/FeeNoticeSheet');
const SearchSheet = React.lazy(() => loadSearch().then((m) => ({ default: m.SearchSheet })));
const ResultsScreen = React.lazy(() => loadResults().then((m) => ({ default: m.ResultsScreen })));
const ListingDetail = React.lazy(() => loadDetail().then((m) => ({ default: m.ListingDetail })));
const PhotoViewer = React.lazy(() => loadPhotoViewer().then((m) => ({ default: m.PhotoViewer })));
const PhotoFullscreen = React.lazy(() => loadPhotoFullscreen().then((m) => ({ default: m.PhotoFullscreen })));
const AboutSpaceScreen = React.lazy(() => loadPanels().then((m) => ({ default: m.AboutSpaceScreen })));
const PriceDetailsScreen = React.lazy(() => loadPanels().then((m) => ({ default: m.PriceDetailsScreen })));
const HostScreen = React.lazy(() => loadPanels().then((m) => ({ default: m.HostScreen })));
const ReviewsScreen = React.lazy(() => loadReviews().then((m) => ({ default: m.ReviewsScreen })));
const AmenitiesScreen = React.lazy(() => loadAmenities().then((m) => ({ default: m.AmenitiesScreen })));
const LoginSheet = React.lazy(() => loadLogin().then((m) => ({ default: m.LoginSheet })));
const FeeNoticeSheet = React.lazy(() => loadFeeNotice().then((m) => ({ default: m.FeeNoticeSheet })));

let prefetched = false;
const prefetch = () => {
  if (prefetched) return;
  prefetched = true;
  [loadSearch, loadResults, loadDetail, loadPhotoViewer, loadPhotoFullscreen, loadPanels, loadReviews,
    loadAmenities, loadLogin, loadFeeNotice].forEach((load) => {
    load().catch(() => undefined);
  });
};
const Deferred = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={null}>{children}</React.Suspense>
);

const FONT_GRACE_MS = 1200;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LOGGED_OUT_TABS = ['wishlists', 'trips', 'messages', 'login'] as const;

function WishlistsScreen({
  favorites,
  onOpenListing,
  onRemove,
  activeNav,
  onNav,
}: {
  favorites: Listing[];
  onOpenListing: () => void;
  onRemove: (l: Listing) => void;
  activeNav: string;
  onNav: (k: string) => void;
}) {
  return (
    <View style={styles.wishRoot}>
      <View style={styles.wishHeader}>
        <Text style={type.sheetSectionTitle}>Wishlists</Text>
      </View>
      <ScrollView
        style={styles.wishScroll}
        contentContainerStyle={styles.wishGrid}
        showsVerticalScrollIndicator={false}
      >
        {favorites.map((l) => (
          <View key={l.id} style={styles.wishSlot}>
            <ListingCard listing={l} onOpen={onOpenListing} onHeart={() => onRemove(l)} favorite />
          </View>
        ))}
      </ScrollView>
      <BottomNav active={activeNav} onSelect={onNav} />
    </View>
  );
}

function Shell() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  const [fontGraceOver, setFontGraceOver] = React.useState(false);
  React.useEffect(() => {
    if (fontsLoaded || fontError) return undefined;
    const t = setTimeout(() => setFontGraceOver(true), FONT_GRACE_MS);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);
  useVariableWeightFont();
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      prefetch();
      return undefined;
    }
    const t = setTimeout(prefetch, 8000);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);
  const insets = useSafeAreaInsets();
  const feedRef = React.useRef<ScrollView>(null);

  const [screen, setScreen] = React.useState<'explore' | 'results' | 'detail'>('explore');
  const [detailReturn, setDetailReturn] = React.useState<'explore' | 'results'>('explore');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [activeNav, setActiveNav] = React.useState('explore');
  const [feedScrollY, setFeedScrollY] = React.useState(0);

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchStep, setSearchStep] = React.useState<'where' | 'when' | 'who'>('where');
  const [searchCategory, setSearchCategory] = React.useState('Homes');
  const [destination, setDestination] = React.useState<string | null>(null);
  const [range, setRange] = React.useState<DayRange>({ start: null, end: null });
  const [guests, setGuests] = React.useState<Guests>({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [guestsTouched, setGuestsTouched] = React.useState(false);

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [photoOpen, setPhotoOpen] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [reviewsOpen, setReviewsOpen] = React.useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>(initialFilters);
  const filterCount = appliedCount(filters);
  const [fullPhoto, setFullPhoto] = React.useState<number | null>(null);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [priceOpen, setPriceOpen] = React.useState(false);
  const [hostOpen, setHostOpen] = React.useState(false);
  const [feeNoticeOpen, setFeeNoticeOpen] = React.useState(false);
  const [favorites, setFavorites] = React.useState<Listing[]>([]);
  const toggleFavorite = React.useCallback((l: Listing) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === l.id) ? prev.filter((f) => f.id !== l.id) : [...prev, l],
    );
  }, []);

  const restoreFeed = React.useCallback(() => {
    setTimeout(() => {
      if (screen === 'explore') feedRef.current?.scrollTo({ y: feedScrollY, animated: false });
    }, 0);
  }, [screen, feedScrollY]);

  React.useEffect(() => {
    if (screen === 'explore') restoreFeed();
  }, [screen, restoreFeed]);

  if (!fontsLoaded && !fontError && !fontGraceOver) return null;

  const datesText = (() => {
    const f = (dt: Date | null) => (dt ? `${MONTHS[dt.getMonth()]} ${dt.getDate()}` : null);
    const a = f(range.start);
    if (a) {
      if (range.end) return `${a} – ${f(range.end)}`;
      const next = new Date(range.start as Date);
      next.setDate(next.getDate() + 1);
      return `${a} – ${MONTHS[next.getMonth()]} ${next.getDate()}`;
    }
    return 'Sep 30 – Oct 1';
  })();
  const guestTotal = guests.adults + guests.children;
  const guestsText = guestTotal > 0 ? `${guestTotal} ${guestTotal === 1 ? 'guest' : 'guests'}` : '2 guests';

  const openListing = (from: 'explore' | 'results') => {
    setDetailReturn(from);
    setScreen('detail');
  };
  const openSearch = () => {
    setSearchStep('where');
    setSearchOpen(true);
  };
  const openStep = (s: 'where' | 'when' | 'who') => {
    setSearchStep(s);
    if (s === 'when' && !range.start) setRange({ start: new Date(2026, 8, 30), end: null });
  };
  const onSearch = () => {
    setSearchOpen(false);
    setScreen('results');
  };
  const onClear = () => {
    setDestination(null);
    setRange({ start: null, end: null });
    setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
    setGuestsTouched(false);
  };
  const updateGuests = (g: Guests) => {
    setGuests(g);
    setGuestsTouched(true);
  };
  const handleNav = (k: string) => {
    setActiveNav(k);
    setScreen('explore');
  };
  const shareListing = () => {
    Share.share({
      title: detailListing.title,
      message: `${detailListing.title} · ${detailListing.location}`,
    }).catch(() => undefined);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      {screen === 'explore' ? (
        activeNav === 'wishlists' && favorites.length > 0 ? (
          <WishlistsScreen
            favorites={favorites}
            onOpenListing={() => openListing('explore')}
            onRemove={toggleFavorite}
            activeNav={activeNav}
            onNav={handleNav}
          />
        ) : LOGGED_OUT_TABS.includes(activeNav as typeof LOGGED_OUT_TABS[number]) ? (
          <EmptyState
            tabKey={activeNav as 'wishlists' | 'trips' | 'messages' | 'login'}
            onLogin={() => setLoginOpen(true)}
            onBack={() => setActiveNav('explore')}
            activeNav={activeNav}
            onNav={handleNav}
          />
        ) : (
          <ExploreScreen
            activeCategory={activeCategory}
            onCategory={setActiveCategory}
            onOpenListing={() => openListing('explore')}
            onHeart={() => setLoginOpen(true)}
            onOpenSearch={openSearch}
            onNav={handleNav}
            activeNav={activeNav}
            scrollRef={feedRef}
            onScrollY={setFeedScrollY}
            onOpenFeeNotice={() => setFeeNoticeOpen(true)}
            onOpenRow={() => setScreen('results')}
          />
        )
      ) : null}

      <Deferred>
        {screen === 'results' ? (
          <ResultsScreen
            datesText={datesText}
            guestsText={guestsText}
            onBack={() => { setScreen('explore'); setActiveNav('explore'); }}
            onFilters={() => setFiltersOpen(true)}
            filterCount={filterCount}
            selectedChips={filters.amenities}
            onToggleChip={(i) => setFilters((f) => toggleAmenityIn(f, i))}
            onOpenListing={() => openListing('results')}
            onHeart={() => setLoginOpen(true)}
            favoriteIds={favorites.map((f) => f.id)}
            onToggleFavorite={toggleFavorite}
            activeNav={activeNav}
            onNav={handleNav}
            onEditSearch={openSearch}
          />
        ) : null}
      </Deferred>

      <Deferred>
        {screen === 'detail' ? (
          <ListingDetail
            photoIndex={photoIndex}
            onBack={() => setScreen(detailReturn)}
            onShare={shareListing}
            onHeart={() => setLoginOpen(true)}
            isFavorite={favorites.some((f) => f.id === detailListingCard.id)}
            onOpenPhoto={() => { setPhotoOpen(true); }}
            onPhotoChange={setPhotoIndex}
            onOpenReviews={() => setReviewsOpen(true)}
            onOpenAmenities={() => setAmenitiesOpen(true)}
            onReserve={() => setLoginOpen(true)}
            onShowMore={() => setAboutOpen(true)}
            onOpenHost={() => setHostOpen(true)}
            onOpenPrice={() => setPriceOpen(true)}
          />
        ) : null}
      </Deferred>

      <Deferred>
        {searchOpen ? (
          <SearchSheet
            step={searchStep}
            setStep={openStep}
            category={searchCategory}
            setCategory={setSearchCategory}
            destination={destination}
            pickDestination={setDestination}
            range={range}
            setRange={setRange}
            guests={guests}
            guestsTouched={guestsTouched}
            setGuests={updateGuests}
            onClose={() => setSearchOpen(false)}
            onClear={onClear}
            onSearch={onSearch}
          />
        ) : null}
      </Deferred>

      <Deferred>
        {photoOpen ? (
          <PhotoViewer
            startIndex={photoIndex}
            onClose={() => setPhotoOpen(false)}
            onShare={shareListing}
            onHeart={() => setLoginOpen(true)}
            onOpenPhoto={setFullPhoto}
          />
        ) : null}
      </Deferred>

      <Deferred>
        {fullPhoto !== null ? <PhotoFullscreen startIndex={fullPhoto} onClose={() => setFullPhoto(null)} /> : null}
      </Deferred>

      <Deferred>
        {aboutOpen ? <AboutSpaceScreen onClose={() => setAboutOpen(false)} /> : null}
      </Deferred>

      <Deferred>
        {priceOpen ? (
          <PriceDetailsScreen
            onClose={() => setPriceOpen(false)}
            onReserve={() => { setPriceOpen(false); setLoginOpen(true); }}
          />
        ) : null}
      </Deferred>

      <Deferred>
        {hostOpen ? (
          <HostScreen
            onClose={() => setHostOpen(false)}
            onMessage={() => { setHostOpen(false); setLoginOpen(true); }}
          />
        ) : null}
      </Deferred>

      <Deferred>
        {feeNoticeOpen ? <FeeNoticeSheet onClose={() => setFeeNoticeOpen(false)} /> : null}
      </Deferred>

      <Deferred>
        {loginOpen ? <LoginSheet onClose={() => setLoginOpen(false)} /> : null}
      </Deferred>

      <Deferred>
        {reviewsOpen ? <ReviewsScreen onClose={() => setReviewsOpen(false)} /> : null}
      </Deferred>

      <Deferred>
        {amenitiesOpen ? <AmenitiesScreen onClose={() => setAmenitiesOpen(false)} /> : null}
      </Deferred>

      {filtersOpen ? (
        <FiltersSheet onClose={() => setFiltersOpen(false)} value={filters} onChange={setFilters} />
      ) : null}
    </View>
  );
}

export default React.memo(function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.stage}>
        <Shell />
      </View>
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  wishRoot: { flex: 1, backgroundColor: colors.white },
  wishHeader: { paddingHorizontal: space.contentPad, paddingTop: 20, paddingBottom: 4 },
  wishScroll: { flex: 1 },
  wishGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: space.contentPad, paddingTop: 12, rowGap: 24,
    paddingBottom: space.navHeight + 40,
  },
  wishSlot: { width: space.cardWidth },
  stage: {
    width: frame.width,
    maxWidth: '100%',
    height: frame.height,
    maxHeight: '100%',
    alignSelf: 'center',
    backgroundColor: colors.white,
  },
});
