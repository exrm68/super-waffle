import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, X, Flame } from 'lucide-react';
import { AdultBannerItem, AppSettings } from '../types';

interface AdultContentPageProps {
  items: AdultBannerItem[];
  tutorialBanner?: string;
  tutorialLink?: string;
  appSettings?: AppSettings;
  onClose: () => void;
}

const PAGE_SIZE = 12;

const AdultContentPage: React.FC<AdultContentPageProps> = ({
  items, tutorialBanner, tutorialLink, appSettings, onClose
}) => {
  const allCats = Array.from(new Set(items.map(i => i.category || 'General')));
  const [activeCat, setActiveCat] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // প্রথম category default
  const defaultCat = allCats[0] || '';
  const currentCat = activeCat || defaultCat;
  const filtered = items.filter(i => (i.category || 'General') === currentCat);
  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // প্রথম load এ default category set করো
  useEffect(() => {
    if (!activeCat && allCats.length > 0) setActiveCat(allCats[0]);
  }, [items]);
  // Category change এ reset
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeCat]);

  // Load more on scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(p => p + PAGE_SIZE);
          setLoadingMore(false);
        }, 400);
      }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0d0d10',
      zIndex: 200,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* ── Sticky Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(to bottom, #0d0d10 85%, transparent)',
        padding: '14px 16px 10px',
        transform: 'translateZ(0)',
      }}>
        {/* Back + Branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <ChevronLeft size={20} color="#fff" />
            </button>
            <div>
              {/* Cineflix Adult Hub branding */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '22px', letterSpacing: '1px',
                  background: 'linear-gradient(90deg, #FFD700, #fff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>CINEFLIX</span>
                <span style={{
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  borderRadius: '6px', padding: '2px 8px',
                }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '11px', fontWeight: 900, color: '#fff',
                    letterSpacing: '0.05em',
                  }}>ADULT HUB</span>
                </span>
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', color: 'rgba(255,255,255,0.3)',
              }}>Adults only · 18+</p>
            </div>
          </div>
          {/* Item count */}
          <div style={{
            background: 'rgba(236,72,153,0.15)',
            border: '1px solid rgba(236,72,153,0.3)',
            borderRadius: '20px', padding: '4px 10px',
          }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, color: '#ec4899' }}>
              {filtered.length} videos
            </span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="no-scrollbar" style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {allCats.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: '20px',
              border: currentCat === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px', fontWeight: 700,
              background: currentCat === cat
                ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                : 'rgba(255,255,255,0.06)',
              color: currentCat === cat ? '#fff' : 'rgba(255,255,255,0.5)',
              boxShadow: currentCat === cat ? '0 3px 12px rgba(236,72,153,0.4)' : 'none',
            }}>
              {cat === 'Trending' ? <><Flame size={10} style={{ display: 'inline', marginRight: 3 }} />{cat}</> : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '10px 16px 100px' }}>

        {/* Tutorial Banner */}
        {tutorialBanner && (
          <div onClick={() => tutorialLink && window.open(tutorialLink, '_blank')}
            style={{
              borderRadius: '14px', overflow: 'hidden',
              marginBottom: '14px', cursor: tutorialLink ? 'pointer' : 'default',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
            <img src={tutorialBanner} alt="How to watch" style={{ width: '100%', display: 'block' }} />
          </div>
        )}

        {displayed.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans',sans-serif", fontSize: '13px' }}>
            এই category তে কোনো content নেই
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayed.map(item => (
              <ContentCard key={item.id} item={item} appSettings={appSettings} />
            ))}
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {loadingMore && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '16px 0' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#ec4899',
                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        )}

        {!hasMore && filtered.length > PAGE_SIZE && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '11px', padding: '12px 0', fontFamily: "'DM Sans',sans-serif" }}>
            — সব {filtered.length}টা দেখা হয়ে গেছে —
          </p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Ad Logic — MovieDetails এর মতো proper
// ─────────────────────────────────────────
const runAds = (
  adCount: number,
  appSettings: AppSettings | undefined,
  onAllDone: () => void,
  onSkipped: () => void,
) => {
  const monetagZoneId = appSettings?.adZoneId || '';
  const adsgramBlockId = appSettings?.adsgramBlockId || '';
  const useAdsgram = !!(appSettings?.adsgramEnabled && adsgramBlockId);
  const adsEnabled = !!(appSettings?.adEnabled && (monetagZoneId || adsgramBlockId));

  if (!adsEnabled || adCount <= 0) { onAllDone(); return; }

  const showOne = (): Promise<'watched' | 'skipped'> => new Promise(resolve => {
    if (useAdsgram) {
      let tries = 0;
      const try_ = () => {
        // @ts-ignore
        const A = window.Adsgram;
        if (A) {
          try {
            // @ts-ignore
            A.init({ blockId: String(adsgramBlockId) }).show()
              .then(() => resolve('watched'))
              .catch(() => resolve('skipped'));
          } catch { resolve('skipped'); }
        } else if (tries++ < 25) setTimeout(try_, 400);
        else resolve('skipped');
      };
      try_();
    } else {
      let tries = 0;
      const try_ = () => {
        // @ts-ignore
        const fn = window[`show_${monetagZoneId}`];
        if (typeof fn === 'function') fn().then(() => resolve('watched')).catch(() => resolve('skipped'));
        else if (tries++ < 30) setTimeout(try_, 200);
        else resolve('skipped');
      };
      try_();
    }
  });

  const run = async (remaining: number) => {
    if (remaining <= 0) { onAllDone(); return; }
    const result = await showOne();
    if (result === 'skipped') { onSkipped(); return; }
    run(remaining - 1);
  };
  run(adCount);
};

// ─────────────────────────────────────────
// Single Content Card
// ─────────────────────────────────────────
const ContentCard: React.FC<{ item: AdultBannerItem; appSettings?: AppSettings }> = ({ item, appSettings }) => {
  const isPremium = item.isPremium === true;
  const premiumPrice = item.premiumPrice || appSettings?.adultDefaultPrice || 5;
  const adCount = appSettings?.defaultWatchAdCount ?? 0;
  const adsEnabled = !!(appSettings?.adEnabled && (appSettings?.adZoneId || appSettings?.adsgramBlockId));

  const [watched, setWatched] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [skipped, setSkipped] = useState(false);
  // Cooldown — MovieDetails এর মতো
  const [cooldown, setCooldown] = useState(0);
  const lastAdTimeRef = useRef(0);

  const openLink = useCallback(() => {
    if (!item.channelLink) return;
    // ✅ View count increment করো
    import('firebase/firestore').then(async ({ doc, updateDoc, increment }) => {
      const { db } = await import('../firebase');
      try {
        await updateDoc(doc(db, 'adultContent', item.id), { views: increment(1) });
      } catch(e) { /* silent */ }
    });
    // @ts-ignore
    if (window.Telegram?.WebApp) {
      // @ts-ignore
      window.Telegram.WebApp.openLink(item.channelLink);
    } else {
      window.open(item.channelLink, '_blank');
    }
  }, [item.channelLink, item.id]);

  const startCooldown = useCallback(() => {
    const secs = appSettings?.taskCooldownSecs ?? 5;
    lastAdTimeRef.current = Date.now();
    let s = secs;
    setCooldown(s);
    const iv = setInterval(() => {
      s--;
      if (s <= 0) { clearInterval(iv); setCooldown(0); }
      else setCooldown(s);
    }, 1000);
  }, [appSettings]);

  const handleWatch = useCallback(async () => {
    if (unlocked) { openLink(); return; }
    if (adLoading) return;

    // ── Premium paid unlock ──
    if (isPremium) {
      setAdLoading(true);
      try {
        const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        if (!tgUser) { alert('Telegram এ login করো!'); setAdLoading(false); return; }
        const uid = String(tgUser.id);
        const { doc, getDoc, updateDoc, increment, addDoc, collection, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        const userSnap = await getDoc(doc(db, 'users', uid));
        const balance = userSnap.data()?.takaBalance || 0;
        if (balance < premiumPrice) {
          alert(`টাকা কম! ৳${premiumPrice} দরকার, তোমার আছে ৳${balance.toFixed(2)}`);
          setAdLoading(false); return;
        }
        // Deduct taka
        await updateDoc(doc(db, 'users', uid), { takaBalance: increment(-premiumPrice) });
        await addDoc(collection(db, `users/${uid}/coinHistory`), {
          type: 'spend', reason: `🔞 Premium Content: ${item.title}`,
          amount: premiumPrice, currency: 'taka', createdAt: serverTimestamp(),
        });
        setUnlocked(true);
        setAdLoading(false);
        setTimeout(() => openLink(), 300);
      } catch(e) {
        console.warn(e);
        setAdLoading(false);
      }
      return;
    }

    // ── Ad based unlock ──
    const secs = appSettings?.taskCooldownSecs ?? 5;
    const diff = Date.now() - lastAdTimeRef.current;
    if (lastAdTimeRef.current > 0 && diff < secs * 1000) { return; }
    if (!adsEnabled || adCount <= 0) { openLink(); return; }

    setAdLoading(true);
    setSkipped(false);
    runAds(1, appSettings,
      () => {
        setAdLoading(false);
        startCooldown();
        const newWatched = watched + 1;
        setWatched(newWatched);
        if (newWatched >= adCount) { setUnlocked(true); setTimeout(() => openLink(), 300); }
      },
      () => { setAdLoading(false); setSkipped(true); startCooldown(); }
    );
  }, [unlocked, adLoading, watched, adCount, adsEnabled, isPremium, premiumPrice, appSettings, openLink, startCooldown, item.title]);

  const buttonLabel = () => {
    if (unlocked) return '▶ WATCH NOW';
    if (adLoading) return isPremium ? 'Processing...' : 'Ad লোড হচ্ছে...';
    if (cooldown > 0) return `⏳ ${cooldown}s অপেক্ষা করো`;
    if (isPremium) return `💳 ৳${premiumPrice} দিয়ে Unlock করো`;
    if (!adsEnabled || adCount <= 0) return '▶ WATCH NOW';
    return `🔓 UNLOCK (${watched}/${adCount})`;
  };

  return (
    <div style={{
      background: '#18181b',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
        {/* Thumbnail */}
        <div style={{
          position: 'relative',
          width: '140px', flexShrink: 0,
          aspectRatio: '16/9',
          alignSelf: 'center',
          margin: '10px 0 10px 10px',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#111',
        }}>
          <img
            src={item.thumbnail} alt={item.title}
            loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Duration badge */}
          {(item as any).duration && (
            <div style={{
              position: 'absolute', bottom: 5, right: 5,
              background: 'rgba(0,0,0,0.8)',
              borderRadius: '4px', padding: '2px 5px',
            }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>{(item as any).duration}</span>
            </div>
          )}
          {/* Unlocked indicator */}
          {unlocked && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '24px' }}>▶</span>
            </div>
          )}
        </div>

        {/* Right content */}
        <div style={{ flex: 1, padding: '12px 12px 12px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          {/* Title */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px', fontWeight: 700, color: '#fff',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            lineHeight: '1.3', marginBottom: '5px',
          }}>
            {item.title}
          </p>

          {/* Category */}
          {item.category && (
            <span style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '11px', color: 'rgba(255,255,255,0.35)',
              marginBottom: '6px', display: 'block',
            }}>{item.category}</span>
          )}

          {/* Skipped warning */}
          {skipped && (
            <p style={{ fontSize: '10px', color: '#f87171', fontFamily: "'DM Sans',sans-serif", marginBottom: '4px' }}>
              ⚠️ Ad skip করেছো, আবার চেষ্টা করো
            </p>
          )}

          {/* Watch & Unlock label */}
          {!unlocked && adsEnabled && adCount > 0 && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, color: '#ec4899', marginBottom: '7px' }}>
              WATCH & UNLOCK 😊
            </p>
          )}

          {/* Progress dots */}
          {!unlocked && adsEnabled && adCount > 1 && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '7px' }}>
              {Array.from({ length: adCount }).map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i < watched
                    ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                    : 'rgba(255,255,255,0.15)',
                }} />
              ))}
            </div>
          )}

          {/* Watch Button */}
          <button
            onClick={handleWatch}
            disabled={adLoading || cooldown > 0}
            style={{
              width: '100%', padding: '10px',
              borderRadius: '10px', border: 'none',
              background: unlocked
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : (adLoading || cooldown > 0)
                ? 'rgba(255,255,255,0.08)'
                : isPremium
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'linear-gradient(135deg, #1877F2, #0a5cd8)',
              color: (adLoading || cooldown > 0) ? 'rgba(255,255,255,0.4)' : '#fff',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '12px', fontWeight: 800,
              cursor: (adLoading || cooldown > 0) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', letterSpacing: '0.03em',
              transition: 'all 0.2s',
            }}
          >
            {adLoading && (
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#fff',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }} />
            )}
            {buttonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdultContentPage;
