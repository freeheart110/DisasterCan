import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAirQuality } from '../hooks/useAirQuality';

// ── Precomputed particle data (deterministic — no Math.random in render) ──────

const RAIN = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: `${((i * 19 + 7) % 94) + 3}%` as `${number}%`,
  duration: 500 + (i * 67) % 350,
  initY: -((i * 23) % 120),
}));

const SNOW = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: `${((i * 31 + 5) % 88) + 5}%` as `${number}%`,
  duration: 2200 + (i * 113) % 1800,
  initY: -((i * 37) % 140),
  drift: (i % 2 === 0 ? 1 : -1) * (8 + (i * 7) % 18),
}));

const STARS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: `${((i * 17 + 3) % 93) + 3}%` as `${number}%`,
  y: `${((i * 23 + 7) % 68) + 5}%` as `${number}%`,
  duration: 1400 + (i * 89) % 2200,
  initOpacity: ((i * 37) % 10) / 10,
}));

const CLOUDS = [
  { id: 0, top: 8,  width: 90,  initX: -100, duration: 9000 },
  { id: 1, top: 38, width: 70,  initX: -80,  duration: 14000 },
  { id: 2, top: 62, width: 110, initX: -120, duration: 11000 },
];

const WISPS = [
  { id: 0, top: 12, width: 70,  initX: -80,  duration: 6000 },
  { id: 1, top: 35, width: 90,  initX: -100, duration: 8500 },
  { id: 2, top: 58, width: 60,  initX: -70,  duration: 7000 },
  { id: 3, top: 78, width: 80,  initX: -90,  duration: 9500 },
];

// ── Theme helper ──────────────────────────────────────────────────────────────

type WeatherType = 'clear-day' | 'clear-night' | 'cloudy' | 'cloudy-night' | 'rain' | 'snow' | 'snow-night' | 'thunderstorm' | 'mist' | 'mist-night';
type GradientColors = readonly [string, string, ...string[]];

function getWeatherTheme(id: number, icon: string): { gradient: GradientColors; type: WeatherType } {
  const isNight = icon.endsWith('n');
  if (id >= 200 && id < 300) return { gradient: ['#1a1a2e', '#2c3e50'], type: 'thunderstorm' };
  if (id >= 300 && id < 400) return { gradient: ['#2c3e50', '#3d5a73'], type: 'rain' };
  if (id >= 500 && id < 600) return { gradient: ['#141e30', '#243b55'], type: 'rain' };
  if (id >= 600 && id < 700) {
    return isNight
      ? { gradient: ['#0e1b2e', '#1c2e42', '#253d54'], type: 'snow-night' }
      : { gradient: ['#b8cfe0', '#dde8f0', '#f0f5f9'], type: 'snow' };
  }
  if (id >= 700 && id < 800) {
    return isNight
      ? { gradient: ['#1a2535', '#2c3a4a'], type: 'mist-night' }
      : { gradient: ['#6b7b8d', '#9aacba'], type: 'mist' };
  }
  if (id === 800) {
    return isNight
      ? { gradient: ['#0d0d2b', '#1a1a4e', '#0f2b4d'], type: 'clear-night' }
      : { gradient: ['#f7971e', '#f5a623', '#ffd200'], type: 'clear-day' };
  }
  return isNight
    ? { gradient: ['#1c2b3a', '#2c3e50'], type: 'cloudy-night' }
    : { gradient: ['#6d8caa', '#93b1c8'], type: 'cloudy' };
}

// ── Animation Layers ──────────────────────────────────────────────────────────

function RainLayer({ cardHeight }: { cardHeight: number }) {
  const anims = useRef(RAIN.map((d) => new Animated.Value(d.initY))).current;
  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(Animated.timing(anim, { toValue: cardHeight + 20, duration: RAIN[i].duration, useNativeDriver: true }))
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [cardHeight]);
  return (
    <>
      {RAIN.map((d, i) => (
        <Animated.View
          key={d.id}
          style={{ position: 'absolute', left: d.x, width: 1.5, height: 16, borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)', transform: [{ translateY: anims[i] }] }}
        />
      ))}
    </>
  );
}

function SnowLayer({ cardHeight }: { cardHeight: number }) {
  const yAnims = useRef(SNOW.map((s) => new Animated.Value(s.initY))).current;
  const xAnims = useRef(SNOW.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const yLoops = yAnims.map((anim, i) =>
      Animated.loop(Animated.timing(anim, { toValue: cardHeight + 10, duration: SNOW[i].duration, useNativeDriver: true }))
    );
    const xLoops = xAnims.map((anim, i) =>
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: SNOW[i].drift, duration: SNOW[i].duration / 2, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: SNOW[i].duration / 2, useNativeDriver: true }),
      ]))
    );
    [...yLoops, ...xLoops].forEach((l) => l.start());
    return () => [...yLoops, ...xLoops].forEach((l) => l.stop());
  }, [cardHeight]);
  return (
    <>
      {SNOW.map((s, i) => (
        <Animated.View
          key={s.id}
          style={{ position: 'absolute', left: s.x, width: 7, height: 7, borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.85)',
            transform: [{ translateY: yAnims[i] }, { translateX: xAnims[i] }] }}
        />
      ))}
    </>
  );
}

function StarLayer() {
  const anims = useRef(STARS.map((s) => new Animated.Value(s.initOpacity))).current;
  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 0.95, duration: STARS[i].duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.1, duration: STARS[i].duration, useNativeDriver: true }),
      ]))
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);
  return (
    <>
      {STARS.map((s, i) => (
        <Animated.View
          key={s.id}
          style={{ position: 'absolute', left: s.x, top: s.y, width: 2, height: 2,
            borderRadius: 1, backgroundColor: '#fff', opacity: anims[i] }}
        />
      ))}
    </>
  );
}

function CloudLayer({ cardWidth }: { cardWidth: number }) {
  const anims = useRef(CLOUDS.map((c) => new Animated.Value(c.initX))).current;
  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(Animated.timing(anim, { toValue: cardWidth + 20, duration: CLOUDS[i].duration, useNativeDriver: true }))
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [cardWidth]);
  return (
    <>
      {CLOUDS.map((c, i) => (
        <Animated.View
          key={c.id}
          style={{ position: 'absolute', top: c.top, width: c.width, height: 26,
            borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)',
            transform: [{ translateX: anims[i] }] }}
        />
      ))}
    </>
  );
}

function MistLayer({ cardWidth }: { cardWidth: number }) {
  const anims = useRef(WISPS.map((w) => new Animated.Value(w.initX))).current;
  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(Animated.timing(anim, { toValue: cardWidth + 20, duration: WISPS[i].duration, useNativeDriver: true }))
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [cardWidth]);
  return (
    <>
      {WISPS.map((w, i) => (
        <Animated.View
          key={w.id}
          style={{ position: 'absolute', top: w.top, width: w.width, height: 14,
            borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.22)',
            transform: [{ translateX: anims[i] }] }}
        />
      ))}
    </>
  );
}

function SunLayer() {
  const pulse = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.65, duration: 2200, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.35, duration: 2200, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View style={{ position: 'absolute', right: -28, top: -28,
      width: 130, height: 130, borderRadius: 65,
      backgroundColor: 'rgba(255, 230, 80, 0.5)', opacity: pulse }} />
  );
}

function LightningLayer() {
  const flash = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let cancelled = false;
    const trigger = () => {
      if (cancelled) return;
      Animated.sequence([
        Animated.timing(flash, { toValue: 0.5, duration: 70, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 70, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0.3, duration: 70, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.delay(2800 + (Date.now() % 3000)),
      ]).start(() => trigger());
    };
    trigger();
    return () => { cancelled = true; flash.stopAnimation(); };
  }, []);
  return (
    <Animated.View style={{ ...StyleSheet.absoluteFillObject,
      backgroundColor: '#fffde7', opacity: flash }} />
  );
}

function WeatherBackground({ type, cardWidth, cardHeight }: {
  type: WeatherType; cardWidth: number; cardHeight: number;
}) {
  if (cardWidth === 0 || cardHeight === 0) return null;
  switch (type) {
    case 'rain':          return <><RainLayer cardHeight={cardHeight} /></>;
    case 'thunderstorm':  return <><RainLayer cardHeight={cardHeight} /><LightningLayer /></>;
    case 'snow':          return <SnowLayer cardHeight={cardHeight} />;
    case 'snow-night':    return <><StarLayer /><SnowLayer cardHeight={cardHeight} /></>;
    case 'clear-night':   return <><StarLayer /></>;
    case 'clear-day':     return <SunLayer />;
    case 'cloudy':
    case 'cloudy-night':  return <CloudLayer cardWidth={cardWidth} />;
    case 'mist':
    case 'mist-night':    return <MistLayer cardWidth={cardWidth} />;
    default:              return null;
  }
}

// ── AQI helper ────────────────────────────────────────────────────────────────

const AQI_LABELS: Record<number, string> = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };

// ── WeatherCard ───────────────────────────────────────────────────────────────

export function WeatherCard({ weather }: { weather: any }) {
  const { airQuality, loading: airQualityLoading } = useAirQuality();
  const [dims, setDims] = useState({ width: 0, height: 0 });

  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
  const { gradient, type } = getWeatherTheme(weather.weather[0].id, weather.weather[0].icon);

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
      onLayout={(e) => setDims({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      {/* Animated particles behind content */}
      <WeatherBackground type={type} cardWidth={dims.width} cardHeight={dims.height} />

      {/* Content (sits above particles) */}
      <View style={styles.content}>
        {weather.name ? <Text style={styles.cityName}>{weather.name}</Text> : null}

        <View style={styles.topRow}>
          <View style={styles.left}>
            <Image source={{ uri: iconUrl }} style={styles.icon} />
            <View>
              <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
              <Text style={styles.condition}>{weather.weather[0].description}</Text>
              {!airQualityLoading && airQuality && (
                <Text style={styles.aqi}>
                  Air: {AQI_LABELS[airQuality.main.aqi] ?? 'Unknown'} (AQI {airQuality.main.aqi})
                </Text>
              )}
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Feels like </Text>
              <Text style={styles.value}>{Math.round(weather.main.feels_like)}°C</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Humidity </Text>
              <Text style={styles.value}>{weather.main.humidity}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Wind </Text>
              <Text style={styles.value}>{weather.wind.speed} m/s</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

// Skeleton placeholder shown while weather is loading
export function WeatherCardSkeleton() {
  return (
    <View style={[styles.card, styles.skeleton]}>
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonLineShort} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  cityName: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 8,
  },
  temp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  condition: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'capitalize',
  },
  aqi: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  skeleton: {
    backgroundColor: '#5a7a96',
    justifyContent: 'center',
    minHeight: 90,
    padding: 16,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    marginBottom: 10,
    width: '60%',
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 6,
    width: '40%',
  },
});
