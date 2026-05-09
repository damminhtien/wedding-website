import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";

const EVENT = Object.freeze({
  groom: "Đàm Minh Tiến",
  bride: "Nguyễn Minh Thuỳ",
  date: new Date("2026-05-11T11:00:00+07:00"),
  dateText: "11.05.2026",
  venue: "Hội trường A - Hồ Cô Tiên",
  address: "Tổ 65 - khu 5 - Phường Bạch Đằng, Hạ Long - Quảng Ninh",
  ceremonyTime: "10:30",
  partyTime: "11:00",
  groomFamily: ["Đàm Mạnh Tươi", "Phạm Thị Tấm"],
  brideFamily: ["Nguyễn Văn Xuân", "Trần Thị Thanh Thao"],
});

const WEDDING_EVENTS = Object.freeze([
  {
    side: "Nhà gái",
    dateText: "10.05.2026",
    venue: "Hội trường Happy Gold Palace",
    address: "Trung tâm hội nghị Hoà Bình",
    mapUrl: "https://maps.app.goo.gl/DURjH1w5pXL9s2HD7",
    ceremonyTime: EVENT.ceremonyTime,
    partyTime: EVENT.partyTime,
  },
  {
    side: "Nhà trai",
    dateText: EVENT.dateText,
    venue: EVENT.venue,
    address: EVENT.address,
    mapUrl: "https://maps.app.goo.gl/chcQ7yRCViXh5yMC8",
    ceremonyTime: EVENT.ceremonyTime,
    partyTime: EVENT.partyTime,
  },
]);

const NAV_ITEMS = Object.freeze([
  ["home", "Trang chủ"],
  ["story", "Câu chuyện"],
  ["events", "Sự kiện"],
  ["location", "Địa điểm"],
  ["gifts", "Mừng cưới"],
  ["gallery", "Album ảnh"],
  ["guestbook", "Lưu bút"],
]);

const STORY = Object.freeze([
  ["12.2021", "The First Meeting", "In an English class did our quiet chapter begin. We were but ordinary friends, trading lessons and borrowed answers, speaking seldom, yet somehow remembered.", "book-open"],
  ["02.2022", "The First Date", "Upon a rain-kissed day, our first date came softly. Some gentle soul had said that rain may open the curtain to a romantic love, and so it did.", "umbrella"],
  ["Secret", "The Proposal", "One romantic evening, veiled in secrecy, a promise was offered. After four years of loving, the heart found courage enough to speak forever.", "ring"],
  ["11.05.2026", "One Home", "When every star and season had gathered in their proper place, we came home to one another, ready to build the morrow hand in hand.", "home"],
]);

const STORY_QUOTE = "At last, we have reached the fair harbor of lovers' love; now this love shall grow wider still, and make room for all the life before us.";

const GIFT_ACCOUNTS = Object.freeze([
  { name: "Đàm Minh Tiến", bank: "MB Bank", account: "8666180197" },
  { name: "Nguyễn Minh Thuỳ", bank: "BIDV", account: "4550860245" },
]);

const SCHEDULE = Object.freeze([
  ["10:30", "Đón khách", "users"],
  ["11:00", "Lễ thành hôn", "heart"],
  ["11:30", "Khai tiệc", "wine"],
  ["12:00", "Chụp ảnh & giao lưu", "camera"],
]);

const GALLERY = Object.freeze([
  ["SMA_0324", "portrait"],
  ["SMA_0123", "portrait"],
  ["SMA_9710", "portrait"],
  ["SMA_9230", "portrait"],
  ["SMA_2412", "portrait"],
  ["SMA_0963", "portrait"],
  ["SMA_1088", "portrait"],
  ["SMA_1239", "portrait"],
  ["SMA_1251", "portrait"],
  ["SMA_1436", "portrait"],
  ["SMA_1715", "portrait"],
  ["SMA_1755", "portrait"],
  ["SMA_1908", "portrait"],
  ["SMA_1957", "portrait"],
  ["SMA_1975", "portrait"],
  ["SMA_2281", "portrait"],
  ["SMA_2330", "portrait"],
  ["SMA_2370", "portrait"],
  ["SMA_2375", "portrait"],
].map(([file, orientation], index) => ({
  id: file,
  src: `/assets/images-optimized/thumbs/${file}.webp`,
  fullSrc: `/assets/images-optimized/large/${file}.webp`,
  alt: `Ảnh cưới Tiến và Thuỳ ${index + 1}`,
  orientation,
  span: orientation === "landscape" ? 34 : index % 5 === 0 ? 54 : index % 3 === 0 ? 48 : 44,
})));

const HERO_IMAGE = "/assets/images-optimized/large/SMA_1244.webp";
const FEATURED_IMAGES = Object.freeze([
  "/assets/images-optimized/thumbs/SMA_0059.webp",
  "/assets/images-optimized/thumbs/SMA_1461.webp",
  "/assets/images-optimized/thumbs/SMA_9660.webp",
]);

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

export function pad(value) {
  invariant(Number.isFinite(value), "pad(value): value must be a finite number");
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

export function getCountdownParts(targetDate, nowDate = new Date()) {
  invariant(targetDate instanceof Date && !Number.isNaN(targetDate.getTime()), "targetDate must be a valid Date");
  invariant(nowDate instanceof Date && !Number.isNaN(nowDate.getTime()), "nowDate must be a valid Date");

  const diffMs = Math.max(0, targetDate.getTime() - nowDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function runSelfTests() {
  const sample = getCountdownParts(new Date("2026-05-12T12:30:15Z"), new Date("2026-05-11T10:00:00Z"));
  console.assert(sample.days === 1, "countdown: days should be 1");
  console.assert(sample.hours === 2, "countdown: hours should be 2");
  console.assert(sample.minutes === 30, "countdown: minutes should be 30");
  console.assert(sample.seconds === 15, "countdown: seconds should be 15");
  console.assert(pad(7) === "07", "pad: one digit number should be zero-padded");
  console.assert(pad(12) === "12", "pad: two digit number should be unchanged");
  console.assert(pad(-2) === "00", "pad: negative number should clamp to 00");
  const past = getCountdownParts(new Date("2026-01-01T00:00:00Z"), new Date("2026-01-02T00:00:00Z"));
  console.assert(past.days === 0 && past.hours === 0 && past.minutes === 0 && past.seconds === 0, "countdown: past target should clamp to zero");
  console.assert(GALLERY.length === 19, "gallery: 19 images should be listed");
}

if (typeof window !== "undefined") runSelfTests();

function useCountdown(targetDate) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const id = window.setInterval(() => setCountdown(getCountdownParts(targetDate)), 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  return countdown;
}

function smoothScroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openMap(event = WEDDING_EVENTS[1]) {
  if (event.mapUrl) {
    window.open(event.mapUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const query = encodeURIComponent(`${event.venue} ${event.address}`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function Icon({ name, className = "", filled = false }) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (name) {
    case "book-open":
      return <svg {...common}><path d="M12 7v14" /><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22V5.5Z" /></svg>;
    case "calendar":
      return <svg {...common}><path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M8 13h2M14 13h2M8 17h2M14 17h2" /></svg>;
    case "camera":
      return <svg {...common}><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" /><circle cx="12" cy="13" r="3.2" /></svg>;
    case "chevron-down":
      return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
    case "chevron-left":
      return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>;
    case "chevron-right":
      return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
    case "check":
      return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    case "copy":
      return <svg {...common}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" /></svg>;
    case "gift":
      return <svg {...common}><path d="M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8H7.5A2.5 2.5 0 1 1 10 5.5C10 7 12 8 12 8ZM12 8h4.5A2.5 2.5 0 1 0 14 5.5C14 7 12 8 12 8Z" /></svg>;
    case "heart":
      return <svg {...common}><path d="M20.8 5.8a5.1 5.1 0 0 0-7.2 0L12 7.4l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21.8l8.8-8.8a5.1 5.1 0 0 0 0-7.2Z" /></svg>;
    case "home":
      return <svg {...common}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>;
    case "map-pin":
      return <svg {...common}><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
    case "music":
      return <svg {...common}><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></svg>;
    case "navigation":
      return <svg {...common}><path d="m12 2 8 19-8-4-8 4 8-19Z" /></svg>;
    case "pause":
      return <svg {...common}><path d="M8 5v14M16 5v14" /></svg>;
    case "play":
      return <svg {...common}><path d="m8 5 11 7-11 7V5Z" /></svg>;
    case "ring":
      return <svg {...common}><path d="M9 3h6l2 4-5 4-5-4 2-4Z" /><circle cx="12" cy="16" r="5" /></svg>;
    case "send":
      return <svg {...common}><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="M12 3 10 9l-6 2 6 2 2 6 2-6 6-2-6-2-2-6ZM19 16l-.8 2.2L16 19l2.2.8L19 22l.8-2.2L22 19l-2.2-.8L19 16ZM5 2l-.7 2.3L2 5l2.3.7L5 8l.7-2.3L8 5l-2.3-.7L5 2Z" /></svg>;
    case "umbrella":
      return <svg {...common}><path d="M4 12a8 8 0 0 1 16 0Z" /><path d="M12 12v6a3 3 0 0 0 6 0" /><path d="M12 4v2" /></svg>;
    case "users":
      return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "wine":
      return <svg {...common}><path d="M8 2h8l-1 9a3 3 0 0 1-6 0L8 2ZM12 14v7M9 21h6" /><path d="M8.5 7h7" /></svg>;
    case "x":
      return <svg {...common}><path d="M18 6 6 18M6 6l12 12" /></svg>;
    default:
      return <span className={className}>*</span>;
  }
}

function Button({ children, onClick, type = "button", variant = "solid", className = "", disabled = false }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#b48b3a]/20 disabled:cursor-not-allowed disabled:opacity-60";
  const styles = variant === "outline"
    ? "border border-[#c7b27a] bg-white/70 text-[#42553d] backdrop-blur hover:bg-white"
    : "bg-[#42553d] text-white shadow-lg shadow-[#42553d]/15 hover:bg-[#344530]";

  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>{children}</button>;
}

function SectionLabel({ children }) {
  return <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#b48b3a]">{children}</div>;
}

function Petals() {
  const petals = useMemo(() => Array.from({ length: 28 }, (_, index) => ({
    id: index,
    left: `${(index * 23) % 100}%`,
    delay: `${(index % 11) * 0.7}s`,
    duration: `${10 + (index % 9)}s`,
    size: 9 + (index % 6) * 3,
    opacity: 0.3 + (index % 5) * 0.08,
  })), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute -top-10 rounded-full bg-white/80 shadow-[0_0_16px_rgba(255,255,255,0.9)]"
          style={{
            left: petal.left,
            width: petal.size,
            height: Math.round(petal.size * 1.55),
            opacity: petal.opacity,
            animation: `petal-fall ${petal.duration} linear ${petal.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ThankRain({ burstKey }) {
  const items = useMemo(() => Array.from({ length: 150 }, (_, index) => ({
    id: index,
    left: `${(index * 19 + 8) % 100}%`,
    delay: `${(index % 60) * 0.84}s`,
    duration: `${10.5 + (index % 5) * 0.8}s`,
    size: 17 + (index % 4) * 3,
    drift: `${index % 2 === 0 ? 34 : -28}px`,
  })), []);

  return (
    <div key={burstKey} className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute -top-10 font-serif font-semibold italic text-[#c99a2e] drop-shadow-[0_4px_12px_rgba(90,67,23,0.28)]"
          style={{
            left: item.left,
            fontSize: item.size,
            animation: `thank-fall ${item.duration} ease-in ${item.delay} forwards`,
            "--thank-drift": item.drift,
          }}
        >
          thank
        </span>
      ))}
    </div>
  );
}

function FloralCorner({ className = "" }) {
  return (
    <svg viewBox="0 0 320 260" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.5">
        <path d="M248 48c-36 8-58 31-67 65 30-13 58-5 77 17 16 19 15 46-3 62-18 16-47 15-66-1-19-17-26-43-12-72-33 10-57 31-70 62" />
        <path d="M177 119c-33-32-72-36-114-14 32 8 52 28 59 60 5 26-9 50-33 57-24 7-49-7-57-31-9-25 2-51 28-66" />
        <path d="M111 176c42-1 76 14 102 45" />
        <path d="M205 88c36-6 68 2 97 24" />
        <path d="M55 89c18-38 52-61 102-70" />
        <path d="M88 214c24 12 53 15 88 9" />
      </g>
    </svg>
  );
}

function CountdownCard() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT.date);
  const cells = [[days, "Ngày"], [hours, "Giờ"], [minutes, "Phút"], [seconds, "Giây"]];

  return (
    <div className="border border-white/70 bg-white/75 p-4 text-center shadow-xl shadow-[#6b5b2e]/10 backdrop-blur-xl sm:p-5">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#42553d] sm:text-xs sm:tracking-[0.22em]">Đếm ngược đến ngày vui</div>
      <div className="grid grid-cols-4 divide-x divide-[#c7b27a]/40">
        {cells.map(([value, label]) => (
          <div key={label} className="px-2 sm:px-3">
            <motion.div key={`${label}-${value}`} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif text-xl text-[#283b2c] sm:text-3xl">
              {label === "Ngày" ? value : pad(value)}
            </motion.div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#7d704a]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MusicControl() {
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const playAudio = async () => {
      try {
        audio.volume = 0.55;
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    playAudio();
    return () => audio.pause();
  }, []);

  useEffect(() => {
    const playFromInvitation = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        audio.volume = 0.55;
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    window.addEventListener("wedding:open-invitation", playFromInvitation);
    return () => window.removeEventListener("wedding:open-invitation", playFromInvitation);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      audio.volume = 0.55;
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/music.mp3" loop autoPlay preload="auto" playsInline />
      <button type="button" onClick={toggle} className="group fixed bottom-24 left-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-[#42553d]/90 text-white shadow-2xl backdrop-blur-xl transition hover:scale-105 md:bottom-5" aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}>
        <Icon name={playing ? "pause" : "play"} className="h-5 w-5" />
      </button>
    </>
  );
}

function EnvelopeIntro({ onDone }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return undefined;
    const timer = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(timer);
  }, [opened, onDone]);

  const openInvitation = () => {
    if (opened) return;
    window.dispatchEvent(new Event("wedding:open-invitation"));
    setOpened(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-[#f8f3e8] px-5 text-[#283b2c]"
      initial={{ opacity: 1 }}
      animate={{ opacity: opened ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, delay: opened ? 1.45 : 0 }}
      aria-label="Mở phong bao thiệp cưới"
    >
      <FloralCorner className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 -rotate-12 text-[#71856b]/55" />
      <FloralCorner className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rotate-180 text-[#b48b3a]/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.88),transparent_38%),linear-gradient(180deg,rgba(248,243,232,0.28),rgba(216,196,144,0.24))]" />

      <div className="relative flex w-full max-w-md flex-col items-center">
        <motion.div
          className="w-full max-w-[350px] sm:max-w-[390px]"
          animate={opened ? { rotate: 0, y: 0 } : { rotate: [-0.6, 0.8, -0.4, 0.5, 0], y: [0, -3, 0, 2, 0] }}
          transition={opened ? { duration: 0.35 } : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="relative h-[300px] w-full sm:h-[330px]"
            initial={false}
            animate={opened ? "open" : "closed"}
          >
            <motion.div
              className="absolute left-1/2 top-8 z-10 h-[220px] w-[78%] -translate-x-1/2 overflow-hidden rounded-md border border-[#e8d7ad] bg-[#fffaf0] p-6 text-center shadow-2xl shadow-[#6b5b2e]/18"
              variants={{
                closed: { y: 72, scale: 0.96, rotate: 0, zIndex: 10 },
                open: { y: -50, scale: 1, rotate: -1.2, zIndex: 40 },
              }}
              transition={{ type: "spring", stiffness: 68, damping: 18, mass: 0.95, delay: opened ? 0.18 : 0 }}
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-[#dfc37d] bg-[#f7ecd0] text-[#b48b3a]">
                <Icon name="heart" className="h-6 w-6" filled />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b48b3a]">Thiệp mời</div>
              <div className="mt-3 font-serif text-4xl italic text-[#40553d]">Tiến & Thuỳ</div>
              <div className="mt-3 font-serif text-xl italic text-[#7d704a]">10.05 & 11.05.2026</div>
              <div className="mx-auto mt-5 h-px w-24 bg-[#dfc37d]" />
            </motion.div>

            <div className="absolute bottom-8 left-0 right-0 h-[210px] rounded-lg border border-[#d8c18a] bg-[#ead7a8] shadow-2xl shadow-[#6b5b2e]/20">
              <div className="absolute inset-x-0 bottom-0 h-[150px] rounded-b-lg bg-[#dec58f]" />
              <div className="absolute inset-x-0 bottom-0 h-[172px] rounded-b-lg bg-[#e6d09c] [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
              <div className="absolute bottom-0 left-0 h-[172px] w-1/2 rounded-bl-lg bg-[#d6bd83] [clip-path:polygon(0_0,100%_55%,100%_100%,0_100%)]" />
              <div className="absolute bottom-0 right-0 h-[172px] w-1/2 rounded-br-lg bg-[#e8d3a1] [clip-path:polygon(0_55%,100%_0,100%_100%,0_100%)]" />
              <motion.div
                className="absolute left-0 right-0 top-0 z-20 h-[132px] origin-top rounded-t-lg bg-[#f0dfb8] [clip-path:polygon(0_0,100%_0,50%_100%)]"
                variants={{
                  closed: { rotateX: 0, y: 0, zIndex: 30 },
                  open: { rotateX: -168, y: -14, zIndex: 5 },
                }}
                transition={{ duration: 1.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 900 }}
              />
              <div className="absolute left-1/2 top-[104px] z-30 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full border border-[#dfc37d] bg-[#40553d] text-[#f7ecd0] shadow-lg">
                <Icon name="heart" className="h-7 w-7" filled />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.button
          type="button"
          onClick={openInvitation}
          disabled={opened}
          className="relative z-10 mt-2 inline-flex h-12 min-w-40 items-center justify-center gap-2 rounded-md bg-[#40553d] px-6 text-sm font-semibold text-white shadow-lg shadow-[#40553d]/20 transition hover:bg-[#344530] disabled:opacity-70"
          initial={false}
          animate={{ opacity: opened ? 0 : 1, y: opened ? 16 : 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Icon name="sparkles" className="h-4 w-4" />
          Mở thiệp
        </motion.button>
      </div>
    </motion.div>
  );
}

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/50 bg-[#fffaf0]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
        <button type="button" onClick={() => smoothScroll("home")} className="group flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d4be7b]/60 bg-white/75 font-serif text-base font-semibold text-[#b48b3a] shadow-sm">T&T</div>
          <div className="hidden text-left sm:block">
            <div className="font-serif text-sm uppercase tracking-[0.2em] text-[#42553d]">Tiến & Thuỳ</div>
            <div className="text-[11px] text-[#8a7d5c]">Wedding invitation</div>
          </div>
        </button>
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => smoothScroll(id)} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#42553d] transition hover:text-[#b48b3a]">{label}</button>
          ))}
        </nav>
        <Button onClick={() => smoothScroll("gifts")} variant="outline" className="px-3 py-2.5 text-[#8d6f31] shadow-lg shadow-[#81692d]/10 sm:px-4"><Icon name="gift" className="h-4 w-4" /> Gửi quà</Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#f8f3e8] pt-16 sm:pt-20 lg:min-h-screen">
      <img src={HERO_IMAGE} alt="Tiến và Thuỳ" className="absolute inset-0 h-full w-full object-cover object-[center_42%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf0]/94 via-[#fffaf0]/86 to-[#283b2c]/34 lg:bg-gradient-to-r lg:from-[#fffaf0]/96 lg:via-[#fffaf0]/86 lg:to-[#283b2c]/26" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f8f3e8] to-transparent" />
      <FloralCorner className="absolute -left-24 top-16 h-80 w-80 rotate-180 text-[#71856b]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-5 sm:py-12 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8c48b]/60 bg-white/75 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8d6f31] shadow-sm backdrop-blur sm:mb-5 sm:px-4 sm:text-xs sm:tracking-[0.16em]"><Icon name="sparkles" className="h-4 w-4" /> Trân trọng kính mời</div>
          <h1 className="diamond-text inline-block whitespace-nowrap rounded-md bg-[#fffaf0]/58 px-3 py-1 text-[clamp(1.8rem,6.8vw,3.9rem)] font-medium italic tracking-[0.005em] text-[#142217] shadow-2xl shadow-[#42553d]/16 backdrop-blur-md sm:px-4 sm:tracking-[0.015em] lg:tracking-[0.025em]" style={{ "--shine-base": "#142217", "--shine-glow": "#f6d984", fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif', fontVariationSettings: '"SOFT" 75, "WONK" 1', WebkitTextStroke: "0.18px rgba(255, 250, 240, 0.86)", textShadow: "0 3px 20px rgba(255, 250, 240, 1), 0 3px 6px rgba(20, 34, 23, 0.3)" }}>Lễ Thành Hôn</h1>
          <div className="mt-4 font-serif text-[clamp(2.45rem,10vw,4.7rem)] italic leading-[1.06] text-[#b48b3a] sm:mt-5">
            <div className="diamond-text inline-block" style={{ "--shine-base": "#b48b3a", "--shine-glow": "#fff1a8" }}>{EVENT.groom}</div>
            <div className="text-3xl leading-none text-[#6b7758] sm:text-4xl">&</div>
            <div className="diamond-text inline-block" style={{ "--shine-base": "#b48b3a", "--shine-glow": "#fff1a8" }}>{EVENT.bride}</div>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
            <div className="rounded-md border border-[#f1d992] bg-[#fffaf0] px-4 py-3 text-sm font-semibold text-[#162318] shadow-2xl shadow-[#142217]/18 backdrop-blur-xl sm:px-5 sm:text-base"><Icon name="calendar" className="mr-2 inline h-4 w-4 text-[#9d7730]" />{EVENT.dateText}</div>
            <div className="rounded-md border border-[#f1d992] bg-[#fffaf0] px-4 py-3 text-sm font-semibold leading-6 text-[#162318] shadow-2xl shadow-[#142217]/18 backdrop-blur-xl sm:px-5 sm:text-base"><Icon name="map-pin" className="mr-2 inline h-4 w-4 text-[#9d7730]" />{EVENT.venue}</div>
          </div>

          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
            <Button onClick={() => smoothScroll("gifts")} className="h-12 w-full px-6 py-0 sm:w-auto">Gửi quà <Icon name="gift" className="h-4 w-4" /></Button>
            <Button onClick={() => smoothScroll("gallery")} variant="outline" className="h-12 w-full px-6 py-0 sm:w-auto">Xem album <Icon name="camera" className="h-4 w-4" /></Button>
          </div>
          <div className="mx-auto mt-5 max-w-md lg:hidden">
            <CountdownCard />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.15 }} className="relative hidden lg:block">
          <div className="ml-auto grid max-w-xl grid-cols-[0.9fr_1.1fr] gap-4">
            <div className="space-y-4 pt-16">
              <img src={FEATURED_IMAGES[0]} alt="Khoảnh khắc cưới 1" className="h-72 w-full rounded-lg border border-white/70 object-cover object-top shadow-2xl" />
              <CountdownCard />
            </div>
            <div className="space-y-4">
              <img src={FEATURED_IMAGES[1]} alt="Khoảnh khắc cưới 2" className="h-96 w-full rounded-lg border border-white/70 object-cover object-top shadow-2xl" />
              <img src={FEATURED_IMAGES[2]} alt="Khoảnh khắc cưới 3" className="h-52 w-full rounded-lg border border-white/70 object-cover object-[center_25%] shadow-2xl" />
            </div>
          </div>
        </motion.div>
      </div>

      <button type="button" onClick={() => smoothScroll("story")} className="absolute bottom-7 left-1/2 z-30 hidden h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-white/80 bg-white/70 text-[#42553d] shadow-xl backdrop-blur md:grid" aria-label="Cuộn xuống">
        <Icon name="chevron-down" className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}

function WeddingMealSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8f3e8] px-4 py-12 sm:px-5 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf0] via-[#f8f3e8] to-[#eef4e8]" />
      <FloralCorner className="absolute -right-24 -top-24 h-80 w-80 text-[#71856b]/50" />
      <div className="relative mx-auto max-w-4xl rounded-lg border border-[#d8c48b]/80 bg-[#f5f7ee]/95 p-6 text-center text-[#2f3f2d] shadow-2xl shadow-[#42553d]/12 backdrop-blur-xl sm:p-8">
        <SectionLabel>Thông tin tiệc cưới</SectionLabel>
        <h2 className="font-serif text-4xl italic text-[#40553d] md:text-5xl">Bữa cơm thân mật mừng lễ thành hôn</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8">
          Được tổ chức lúc <strong>{EVENT.partyTime}</strong>, ngày <strong>{EVENT.dateText}</strong> tại <strong>{EVENT.venue}</strong>, {EVENT.address}.
        </p>
        <p className="mx-auto mt-4 max-w-3xl border-t border-[#d8c48b]/60 pt-4 text-lg font-medium leading-8">
          Gia đình nhà gái tổ chức ngày <strong>10.05.2026</strong> tại Hội trường Happy Gold Palace, Trung tâm hội nghị Hoà Bình.
        </p>
      </div>
    </section>
  );
}

function StorySection() {
  const [selected, setSelected] = useState(0);

  return (
    <section id="story" className="relative overflow-hidden bg-[#f8f3e8] px-4 py-16 sm:px-5 sm:py-24">
      <FloralCorner className="absolute -bottom-32 -left-24 h-96 w-96 rotate-12 text-[#71856b]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <SectionLabel>Love timeline</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Our Love Story</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {STORY.map(([date, title, text, icon], index) => (
            <motion.button key={date} type="button" onClick={() => setSelected(index)} whileHover={{ y: -6 }} className={`relative rounded-lg border p-5 text-left shadow-xl transition ${selected === index ? "border-[#c4a052] bg-white/88" : "border-white/70 bg-white/55 hover:bg-white/80"} backdrop-blur-xl`}>
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#42553d] text-white shadow-lg"><Icon name={icon} className="h-6 w-6" /></div>
              <div className="font-serif text-2xl text-[#42553d]">{date}</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[#8d6f31]">{title}</div>
              <p className="mt-4 text-sm leading-6 text-[#5f684e]">{text}</p>
            </motion.button>
          ))}
        </div>
        <motion.blockquote initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mx-auto mt-10 max-w-4xl border-y border-[#d8c48b]/70 px-4 py-7 text-center font-serif text-2xl italic leading-relaxed text-[#40553d] sm:px-8 md:text-3xl">
          "{STORY_QUOTE}"
        </motion.blockquote>
      </div>
    </section>
  );
}

function EventSection() {
  return (
    <section id="events" className="relative bg-[#fdf8ee] px-4 py-16 sm:px-5 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8ee] via-[#f8f1e1] to-[#e6eddc]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel>Wedding day</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Lịch trình ngày cưới</h2>
          <div className="mt-8 space-y-4">
            {WEDDING_EVENTS.map((event) => (
              <div key={event.side} className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-xl backdrop-blur-xl sm:p-6">
                <div className="flex items-start gap-4">
                  <Icon name="calendar" className="mt-1 h-6 w-6 shrink-0 text-[#b48b3a]" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d6f31]">{event.side}</div>
                    <div className="mt-1 font-serif text-2xl text-[#42553d]">{event.dateText}</div>
                    <div className="mt-3 text-sm leading-6 text-[#5f684e]">{event.venue} - {event.address}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {SCHEDULE.map(([time, title, icon], index) => (
            <motion.div key={time} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} className="group flex items-center gap-3 rounded-lg border border-white/70 bg-white/70 p-4 shadow-xl shadow-[#42553d]/5 backdrop-blur-xl sm:gap-5 sm:p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#42553d] text-white shadow-lg transition group-hover:scale-105 group-hover:bg-[#b48b3a] sm:h-14 sm:w-14"><Icon name={icon} className="h-5 w-5 sm:h-6 sm:w-6" /></div>
              <div className="w-16 shrink-0 font-serif text-2xl text-[#b48b3a] sm:w-24 sm:text-3xl">{time}</div>
              <div className="text-base font-medium text-[#283b2c] sm:text-lg">{title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="location" className="relative overflow-hidden bg-[#eef4e8] px-4 py-16 sm:px-5 sm:py-24">
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#40553d]/18 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center">
          <SectionLabel>Location</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Địa điểm tổ chức</h2>
          <p className="mt-5 text-sm leading-7 text-[#5f684e]">Khách mời chọn đúng địa điểm theo lịch nhà gái hoặc nhà trai để mở bản đồ chỉ đường.</p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
            {WEDDING_EVENTS.map((event) => (
              <Button key={event.side} onClick={() => openMap(event)} className="w-full px-7 py-4 sm:w-auto">
                <Icon name="navigation" className="h-4 w-4" /> Chỉ đường {event.side}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {WEDDING_EVENTS.map((event, index) => (
            <div key={event.side} className="overflow-hidden rounded-lg border border-white/70 bg-white/60 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl">
              <div className="relative h-80 overflow-hidden bg-[#dbe4d2] sm:h-[420px]">
                <div className="absolute inset-0 opacity-65">
                  <div className="absolute left-0 top-16 h-px w-full rotate-6 bg-[#9aa98e]" />
                  <div className="absolute left-0 top-48 h-px w-full -rotate-3 bg-[#9aa98e]" />
                  <div className="absolute left-0 top-72 h-px w-full rotate-2 bg-[#9aa98e]" />
                  <div className="absolute left-20 top-0 h-full w-px rotate-12 bg-[#9aa98e]" />
                  <div className="absolute left-64 top-0 h-full w-px -rotate-6 bg-[#9aa98e]" />
                  <div className="absolute right-32 top-0 h-full w-px rotate-6 bg-[#9aa98e]" />
                </div>
                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }} className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#b48b3a] text-white shadow-2xl shadow-[#b48b3a]/40">
                  <Icon name="map-pin" filled className="h-9 w-9" />
                </motion.div>
                <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/80 bg-white/78 p-5 shadow-xl backdrop-blur-xl">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d6f31]">{event.side} · {event.dateText}</div>
                  <div className="mt-2 font-serif text-2xl text-[#283b2c]">{event.venue}</div>
                  <div className="mt-2 text-sm leading-6 text-[#5f684e]">{event.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftSection() {
  const [copiedAccount, setCopiedAccount] = useState("");
  const [thankBurst, setThankBurst] = useState(null);

  const copyAccount = async (account) => {
    await copyText(account);
    setCopiedAccount(account);
    setThankBurst(Date.now());
    window.setTimeout(() => setCopiedAccount((current) => (current === account ? "" : current)), 1800);
    window.setTimeout(() => setThankBurst(null), 60000);
  };

  return (
    <section id="gifts" className="relative overflow-hidden bg-[#f8f3e8] px-4 py-16 sm:px-5 sm:py-24">
      {thankBurst && <ThankRain burstKey={thankBurst} />}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf0] via-[#f8f3e8] to-[#edf3e7]" />
      <FloralCorner className="absolute -left-24 top-4 h-80 w-80 rotate-180 text-[#71856b]/70" />
      <FloralCorner className="absolute -bottom-28 -right-16 h-96 w-96 text-[#b48b3a]/45" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Wedding gift</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Mừng cưới</h2>
          <p className="mt-5 text-sm leading-7 text-[#5f684e]">Sự hiện diện của Quý khách là niềm vinh hạnh lớn nhất của gia đình. Nếu Quý khách muốn gửi lời chúc mừng qua hình thức chuyển khoản, xin vui lòng sử dụng thông tin dưới đây.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {GIFT_ACCOUNTS.map((account) => {
            const copied = copiedAccount === account.account;
            return (
              <motion.div key={account.account} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} className="relative overflow-hidden rounded-lg border border-white/80 bg-white/76 p-6 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl sm:p-7">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[#d8c48b]/40" />
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#42553d] text-white shadow-lg">
                    <Icon name="gift" className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d6f31]">{account.bank}</div>
                    <div className="mt-2 font-serif text-3xl text-[#283b2c]">{account.name}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-md border border-[#e1d4b7] bg-[#fffaf0]/82 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d704a]">Số tài khoản</div>
                  <div className="mt-2 break-all font-serif text-3xl text-[#40553d]">{account.account}</div>
                </div>

                <Button onClick={() => copyAccount(account.account)} variant={copied ? "solid" : "outline"} className="mt-5 w-full py-3.5">
                  <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
                  {copied ? "Đã copy số tài khoản" : "Copy số tài khoản"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [active, setActive] = useState(null);

  const showPrevious = () => {
    setActive((current) => (current === null ? 0 : (current - 1 + GALLERY.length) % GALLERY.length));
  };

  const showNext = () => {
    setActive((current) => (current === null ? 0 : (current + 1) % GALLERY.length));
  };

  useEffect(() => {
    if (active === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <section id="gallery" className="bg-[#f8f3e8] px-4 py-16 sm:px-5 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionLabel>Memories</SectionLabel>
            <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Album ảnh</h2>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {GALLERY.slice(0, 4).map((image, index) => (
            <button key={image.id} type="button" onClick={() => setActive(index)} className="group relative h-[220px] overflow-hidden rounded-lg border border-white/70 bg-white shadow-xl sm:h-[280px] md:h-[360px]">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b241d]/45 via-transparent to-transparent opacity-80" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5" style={{ gridAutoRows: "clamp(7px, 0.7vw, 9px)" }}>
          {GALLERY.map((image, index) => (
            <motion.button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ delay: Math.min(index * 0.012, 0.26) }}
              className="group relative overflow-hidden rounded-lg border border-white/70 bg-white shadow-md"
              style={{ gridRowEnd: `span ${image.span}` }}
            >
              <img src={image.src} alt={image.alt} loading={index < 8 ? "eager" : "lazy"} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#1b241d]/0 transition group-hover:bg-[#1b241d]/18" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#121711]/88 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" onClick={() => setActive(null)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[#283b2c] shadow-xl" aria-label="Đóng ảnh">
              <Icon name="x" className="h-5 w-5" />
            </button>
            <button type="button" onClick={showPrevious} className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-[#283b2c] shadow-xl md:grid" aria-label="Ảnh trước">
              <Icon name="chevron-left" className="h-6 w-6" />
            </button>
            <motion.img key={GALLERY[active].id} src={GALLERY[active].fullSrc} alt={GALLERY[active].alt} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-h-[86vh] max-w-[92vw] rounded-lg object-contain shadow-2xl" />
            <button type="button" onClick={showNext} className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-[#283b2c] shadow-xl md:grid" aria-label="Ảnh tiếp theo">
              <Icon name="chevron-right" className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FamilyGuestbook() {
  const [wishes, setWishes] = useState([
    { name: "Albert Einstein", message: "For Tiến and Thuỳ: if love had an equation, today would be the proof: two hearts, one universe, and an infinite supply of cake." },
    { name: "Marie Curie", message: "May Tiến and Thuỳ glow brighter than radium, but with far fewer safety instructions and much better dancing." },
    { name: "Abraham Lincoln", message: "May this union of Tiến and Thuỳ be of the two, by the two, for the two, and never perish from the dinner table." },
    { name: "Winston Churchill", message: "Tiến and Thuỳ, never surrender the last slice of wedding cake. Negotiate bravely, then share it with excellent manners." },
    { name: "Charlie Chaplin", message: "For Tiến and Thuỳ: a day without laughter is a day wasted; a marriage with laughter is a masterpiece in motion." },
    { name: "Audrey Hepburn", message: "May elegance visit Tiến and Thuỳ often, kindness stay for tea, and joy keep finding excuses to wear its best shoes." },
    { name: "Nikola Tesla", message: "May Tiến and Thuỳ keep perfect current: bright, a little electric, and powerful enough to light every room." },
    { name: "Leonardo da Vinci", message: "For Tiến and Thuỳ, where art, patience, and curiosity meet, a beautiful future is drawn. Also, remember to eat before inventing." },
  ]);
  const [draft, setDraft] = useState({ name: "", message: "" });

  const addWish = (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    const message = draft.message.trim();
    if (!name || !message) return;
    setWishes([{ name, message }, ...wishes]);
    setDraft({ name: "", message: "" });
  };

  return (
    <section id="guestbook" className="relative overflow-hidden bg-[#fdf8ee] px-4 py-16 sm:px-5 sm:py-24">
      <FloralCorner className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] text-[#71856b]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/70 bg-white/64 p-5 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl sm:p-8">
          <SectionLabel>Family</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c]">Thông tin gia đình</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-[#e1d4b7] bg-white/75 p-6 text-center">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#8d6f31]">Nhà trai</div>
              {EVENT.groomFamily.map((name) => <div key={name} className="mt-3 font-serif text-2xl text-[#283b2c]">{name}</div>)}
            </div>
            <div className="rounded-lg border border-[#e1d4b7] bg-white/75 p-6 text-center">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#8d6f31]">Nhà gái</div>
              {EVENT.brideFamily.map((name) => <div key={name} className="mt-3 font-serif text-2xl text-[#283b2c]">{name}</div>)}
            </div>
          </div>
          <Button onClick={() => smoothScroll("gifts")} className="mt-7 w-full py-4"><Icon name="gift" className="h-4 w-4" /> Gửi quà mừng cưới</Button>
        </div>

        <div className="rounded-lg border border-white/70 bg-white/64 p-5 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl sm:p-8">
          <SectionLabel>Guestbook</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c]">Sổ lưu bút</h2>
          <form onSubmit={addWish} className="mt-7 grid gap-4 md:grid-cols-[0.8fr_1.2fr_auto]">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-md border border-[#d8ccb2] bg-white/85 px-4 py-3 outline-none focus:border-[#b48b3a]" placeholder="Tên của bạn" />
            <input value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} className="rounded-md border border-[#d8ccb2] bg-white/85 px-4 py-3 outline-none focus:border-[#b48b3a]" placeholder="Lời chúc" />
            <Button type="submit" className="bg-[#b48b3a] px-6 hover:bg-[#9d7730]"><Icon name="send" className="h-4 w-4" /></Button>
          </form>
          <div className="mt-6 max-h-72 space-y-3 overflow-auto pr-2">
            {wishes.map((wish, index) => (
              <motion.div key={`${wish.name}-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[#e1d4b7] bg-white/75 p-4">
                <div className="font-semibold text-[#42553d]">{wish.name}</div>
                <div className="mt-1 text-sm leading-6 text-[#5f684e]">{wish.message}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#40553d] px-5 py-16 text-center text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white/12 to-transparent" />
      <FloralCorner className="absolute -bottom-16 left-8 h-72 w-72 rotate-45 text-white" />
      <FloralCorner className="absolute -right-12 -top-24 h-80 w-80 text-white" />
      <div className="relative mx-auto max-w-3xl">
        <div className="font-serif text-5xl italic text-[#f4d78d]">Tiến & Thuỳ</div>
        <p className="mt-4 text-sm leading-7 text-white/80">Cảm ơn Quý khách đã dành thời gian chung vui cùng gia đình.</p>
        <div className="mt-6 text-xs uppercase tracking-[0.24em] text-white/70">10.05.2026 · Happy Gold Palace / {EVENT.dateText} · {EVENT.venue}</div>
      </div>
    </footer>
  );
}

function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/60 bg-[#fffaf0]/92 px-4 py-3 shadow-[0_-10px_30px_rgba(40,59,44,0.14)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <Button onClick={() => smoothScroll("gifts")} className="h-12 px-3 py-0">
          <Icon name="gift" className="h-4 w-4" /> Gửi quà
        </Button>
        <Button onClick={() => smoothScroll("location")} variant="outline" className="h-12 px-3 py-0 bg-white">
          <Icon name="map-pin" className="h-4 w-4" /> Địa điểm
        </Button>
      </div>
    </div>
  );
}

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f3e8] pb-20 text-[#283b2c] md:pb-0">
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #f8f3e8; font-family: "Cormorant Garamond", Georgia, serif; }
        @keyframes petal-fall {
          0% { transform: translate3d(0, -12vh, 0) rotate(0deg); }
          50% { transform: translate3d(42px, 50vh, 0) rotate(180deg); }
          100% { transform: translate3d(-24px, 112vh, 0) rotate(360deg); }
        }
        @keyframes thank-fall {
          0% { opacity: 1; transform: translate3d(0, 2vh, 0) rotate(-8deg); }
          88% { opacity: 1; }
          100% { opacity: 0; transform: translate3d(var(--thank-drift), 112vh, 0) rotate(16deg); }
        }
        .diamond-text {
          position: relative;
          color: transparent;
          background-image:
            linear-gradient(110deg, var(--shine-base) 0%, var(--shine-base) 34%, #fff8cf 45%, var(--shine-glow) 50%, #ffffff 54%, var(--shine-base) 66%, var(--shine-base) 100%);
          background-size: 260% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: diamond-shimmer 4.8s ease-in-out infinite;
        }
        .diamond-text::after {
          content: "";
          position: absolute;
          inset: -0.08em -0.12em;
          pointer-events: none;
          background:
            radial-gradient(circle at 16% 28%, rgba(255, 255, 255, 0.95) 0 1px, transparent 2px),
            radial-gradient(circle at 54% 6%, rgba(255, 240, 168, 0.9) 0 1px, transparent 2px),
            radial-gradient(circle at 84% 58%, rgba(255, 255, 255, 0.9) 0 1px, transparent 2px);
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(246, 217, 132, 0.55));
          animation: diamond-sparkle 3.2s ease-in-out infinite;
        }
        @keyframes diamond-shimmer {
          0%, 38% { background-position: 130% 50%; }
          62%, 100% { background-position: -130% 50%; }
        }
        @keyframes diamond-sparkle {
          0%, 35%, 100% { opacity: 0; transform: scale(0.96); }
          45% { opacity: 0.95; transform: scale(1); }
          55% { opacity: 0.25; transform: scale(1.02); }
        }
      `}</style>
      <Header />
      <Petals />
      <MusicControl />
      <AnimatePresence>
        {!introDone && <EnvelopeIntro onDone={() => setIntroDone(true)} />}
      </AnimatePresence>
      <MobileActionBar />
      <main>
        <Hero />
        <WeddingMealSection />
        <StorySection />
        <EventSection />
        <LocationSection />
        <GiftSection />
        <GallerySection />
        <FamilyGuestbook />
      </main>
      <Footer />
    </div>
  );
}

export default App;

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
