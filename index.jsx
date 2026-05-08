import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";

const EVENT = Object.freeze({
  groom: "Đàm Minh Tiến",
  bride: "Nguyễn Minh Thuỷ",
  date: new Date("2026-05-11T11:00:00+07:00"),
  dateText: "11.05.2026",
  lunarDate: "25 tháng 03 năm Bính Ngọ",
  venue: "Hội trường A - Hồ Cô Tiên",
  address: "Tổ 65 - khu 5 - Phường Bạch Đằng, Hạ Long - Quảng Ninh",
  ceremonyTime: "10:30",
  partyTime: "11:00",
  groomFamily: ["Đàm Mạnh Tươi", "Phạm Thị Tấm"],
  brideFamily: ["Nguyễn Văn Xuân", "Trần Thị Thanh Thảo"],
});

const NAV_ITEMS = Object.freeze([
  ["home", "Trang chủ"],
  ["story", "Câu chuyện"],
  ["events", "Sự kiện"],
  ["location", "Địa điểm"],
  ["gallery", "Album ảnh"],
  ["guestbook", "Lưu bút"],
]);

const STORY = Object.freeze([
  ["01.2020", "Lần đầu gặp gỡ", "Một cuộc gặp rất bình thường, mở đầu cho một hành trình rất đặc biệt."],
  ["05.2021", "Chúng ta hẹn hò", "Những buổi hẹn giản dị, những câu chuyện dài và sự đồng hành mỗi ngày."],
  ["12.2023", "Cầu hôn", "Một lời hứa nhẹ nhàng, đủ để hai người cùng bước sang chương mới."],
  ["11.05.2026", "Về chung một nhà", "Ngày gia đình, bạn bè và những người thương cùng chứng kiến hạnh phúc."],
]);

const SCHEDULE = Object.freeze([
  ["10:30", "Đón khách", "users"],
  ["11:00", "Lễ thành hôn", "heart"],
  ["11:30", "Khai tiệc", "wine"],
  ["12:00", "Chụp ảnh & giao lưu", "camera"],
]);

const GALLERY = Object.freeze([
  ["SMA_0059", "portrait"],
  ["SMA_0098", "portrait"],
  ["SMA_0102", "portrait"],
  ["SMA_0123", "portrait"],
  ["SMA_0163", "portrait"],
  ["SMA_0324", "portrait"],
  ["SMA_0597", "portrait"],
  ["SMA_0963", "portrait"],
  ["SMA_1088", "portrait"],
  ["SMA_1106", "portrait"],
  ["SMA_1239", "portrait"],
  ["SMA_1244", "landscape"],
  ["SMA_1251", "portrait"],
  ["SMA_1436", "portrait"],
  ["SMA_1461", "portrait"],
  ["SMA_1715", "portrait"],
  ["SMA_1723", "portrait"],
  ["SMA_1755", "portrait"],
  ["SMA_1829", "portrait"],
  ["SMA_1908", "portrait"],
  ["SMA_1957", "portrait"],
  ["SMA_1975", "portrait"],
  ["SMA_2281", "portrait"],
  ["SMA_2330", "portrait"],
  ["SMA_2370", "portrait"],
  ["SMA_2375", "portrait"],
  ["SMA_2412", "portrait"],
  ["SMA_2426", "portrait"],
  ["SMA_9210", "portrait"],
  ["SMA_9223", "portrait"],
  ["SMA_9230", "portrait"],
  ["SMA_9466", "portrait"],
  ["SMA_9564", "portrait"],
  ["SMA_9660", "portrait"],
  ["SMA_9710", "portrait"],
  ["SMA_9851", "portrait"],
  ["SMA_9936", "portrait"],
  ["SMA_9945", "portrait"],
  ["SMA_9963", "portrait"],
  ["SMA_9985", "portrait"],
  ["SMA_9998", "portrait"],
].map(([file, orientation], index) => ({
  id: file,
  src: `/assets/images-optimized/thumbs/${file}.webp`,
  fullSrc: `/assets/images-optimized/large/${file}.webp`,
  alt: `Ảnh cưới Tiến và Thuỷ ${index + 1}`,
  orientation,
  span: orientation === "landscape" ? 34 : index % 5 === 0 ? 54 : index % 3 === 0 ? 48 : 44,
})));

const HERO_IMAGE = "/assets/images-optimized/large/SMA_1244.webp";
const FEATURED_IMAGES = Object.freeze([
  "/assets/images-optimized/thumbs/SMA_0059.webp",
  "/assets/images-optimized/thumbs/SMA_2330.webp",
  "/assets/images-optimized/thumbs/SMA_9998.webp",
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
  console.assert(GALLERY.length === 41, "gallery: all 41 images should be listed");
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

function openMap() {
  const query = encodeURIComponent(`${EVENT.venue} ${EVENT.address}`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
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
    case "gift":
      return <svg {...common}><path d="M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8H7.5A2.5 2.5 0 1 1 10 5.5C10 7 12 8 12 8ZM12 8h4.5A2.5 2.5 0 1 0 14 5.5C14 7 12 8 12 8Z" /></svg>;
    case "heart":
      return <svg {...common}><path d="M20.8 5.8a5.1 5.1 0 0 0-7.2 0L12 7.4l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21.8l8.8-8.8a5.1 5.1 0 0 0 0-7.2Z" /></svg>;
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
    case "send":
      return <svg {...common}><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="M12 3 10 9l-6 2 6 2 2 6 2-6 6-2-6-2-2-6ZM19 16l-.8 2.2L16 19l2.2.8L19 22l.8-2.2L22 19l-2.2-.8L19 16ZM5 2l-.7 2.3L2 5l2.3.7L5 8l.7-2.3L8 5l-2.3-.7L5 2Z" /></svg>;
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
    <div className="border border-white/70 bg-white/70 p-5 text-center shadow-xl shadow-[#6b5b2e]/10 backdrop-blur-xl">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#42553d]">Đếm ngược đến ngày vui</div>
      <div className="grid grid-cols-4 divide-x divide-[#c7b27a]/40">
        {cells.map(([value, label]) => (
          <div key={label} className="px-2 sm:px-3">
            <motion.div key={`${label}-${value}`} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif text-2xl text-[#283b2c] sm:text-3xl">
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
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    return () => {
      try {
        oscillatorRef.current?.stop();
        audioRef.current?.close();
      } catch {
        // AudioContext may already be closed.
      }
    };
  }, []);

  const toggle = async () => {
    if (playing) {
      try {
        oscillatorRef.current?.stop();
        await audioRef.current?.close();
      } finally {
        oscillatorRef.current = null;
        audioRef.current = null;
        setPlaying(false);
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const gain = ctx.createGain();
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 392;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    audioRef.current = ctx;
    oscillatorRef.current = oscillator;
    setPlaying(true);
  };

  return (
    <button type="button" onClick={toggle} className="group fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-[#42553d]/90 text-white shadow-2xl backdrop-blur-xl transition hover:scale-105" aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}>
      <Icon name={playing ? "pause" : "play"} className="h-5 w-5" />
    </button>
  );
}

function RsvpModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", guests: "1", note: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#1b241d]/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.94, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 20, opacity: 0 }} className="relative w-full max-w-lg overflow-hidden rounded-lg border border-white/70 bg-[#fffaf0] p-7 shadow-2xl">
            <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/80 p-2 text-[#42553d] shadow" aria-label="Đóng">
              <Icon name="x" className="h-4 w-4" />
            </button>
            <FloralCorner className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 text-[#71856b]" />
            {!submitted ? (
              <form onSubmit={submit} className="relative space-y-5">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#b48b3a]"><Icon name="sparkles" className="h-4 w-4" /> RSVP</div>
                  <h2 className="font-serif text-3xl text-[#283b2c]">Xác nhận tham dự</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f684e]">Gia đình rất hân hạnh được đón tiếp Quý khách trong ngày vui.</p>
                </div>
                <label className="block text-sm font-medium text-[#42553d]">
                  Tên khách mời
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-md border border-[#d8ccb2] bg-white/85 px-4 py-3 outline-none transition focus:border-[#b48b3a] focus:ring-4 focus:ring-[#b48b3a]/10" placeholder="Ví dụ: Minh Sơn và người thương" />
                </label>
                <label className="block text-sm font-medium text-[#42553d]">
                  Số người tham dự
                  <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="mt-2 w-full rounded-md border border-[#d8ccb2] bg-white/85 px-4 py-3 outline-none transition focus:border-[#b48b3a] focus:ring-4 focus:ring-[#b48b3a]/10">
                    {[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-medium text-[#42553d]">
                  Lời chúc
                  <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-2 min-h-28 w-full rounded-md border border-[#d8ccb2] bg-white/85 px-4 py-3 outline-none transition focus:border-[#b48b3a] focus:ring-4 focus:ring-[#b48b3a]/10" placeholder="Gửi một lời chúc nhỏ tới cô dâu chú rể..." />
                </label>
                <Button type="submit" className="w-full py-4"><Icon name="send" className="h-4 w-4" /> Gửi xác nhận</Button>
              </form>
            ) : (
              <div className="relative py-10 text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#42553d] text-white shadow-xl shadow-[#42553d]/20"><Icon name="heart" filled className="h-7 w-7" /></div>
                <h2 className="font-serif text-3xl text-[#283b2c]">Đã ghi nhận lời chúc</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#5f684e]">Cảm ơn {form.name || "Quý khách"}. Hẹn gặp trong ngày vui của Tiến & Thuỷ.</p>
                <Button onClick={onClose} className="mt-7 px-8">Hoàn tất</Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ onRsvp }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/50 bg-[#fffaf0]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <button type="button" onClick={() => smoothScroll("home")} className="group flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d4be7b]/60 bg-white/75 font-serif text-base font-semibold text-[#b48b3a] shadow-sm">T&T</div>
          <div className="hidden text-left sm:block">
            <div className="font-serif text-sm uppercase tracking-[0.2em] text-[#42553d]">Tiến & Thuỷ</div>
            <div className="text-[11px] text-[#8a7d5c]">Wedding invitation</div>
          </div>
        </button>
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => smoothScroll(id)} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#42553d] transition hover:text-[#b48b3a]">{label}</button>
          ))}
        </nav>
        <Button onClick={onRsvp} variant="outline" className="px-4 py-2.5 text-[#8d6f31] shadow-lg shadow-[#81692d]/10"><Icon name="gift" className="h-4 w-4" /> RSVP</Button>
      </div>
    </header>
  );
}

function Hero({ onRsvp }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#f8f3e8] pt-20">
      <img src={HERO_IMAGE} alt="Tiến và Thuỷ" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf0]/95 via-[#fffaf0]/74 to-[#283b2c]/30" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f8f3e8] to-transparent" />
      <FloralCorner className="absolute -left-24 top-16 h-80 w-80 rotate-180 text-[#71856b]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.96fr_1.04fr]">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8c48b]/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8d6f31] backdrop-blur"><Icon name="sparkles" className="h-4 w-4" /> Trân trọng kính mời</div>
          <h1 className="font-serif text-5xl font-semibold uppercase tracking-[0.12em] text-[#2f4232] md:text-7xl">Lễ Thành Hôn</h1>
          <div className="mt-5 font-serif text-5xl italic leading-tight text-[#b48b3a] md:text-7xl">
            <div>{EVENT.groom}</div>
            <div className="text-3xl text-[#6b7758]">&</div>
            <div>{EVENT.bride}</div>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <div className="rounded-md border border-white/70 bg-white/65 px-5 py-3 shadow-xl shadow-[#42553d]/5 backdrop-blur"><Icon name="calendar" className="mr-2 inline h-4 w-4 text-[#b48b3a]" /><span className="font-serif text-2xl text-[#42553d]">{EVENT.dateText}</span></div>
            <div className="rounded-md border border-white/70 bg-white/65 px-5 py-3 text-[#42553d] shadow-xl shadow-[#42553d]/5 backdrop-blur"><Icon name="map-pin" className="mr-2 inline h-4 w-4 text-[#b48b3a]" /> {EVENT.venue}</div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#4f5d47] lg:text-base">Bữa cơm thân mật mừng lễ thành hôn được tổ chức lúc <strong>{EVENT.partyTime}</strong>, ngày <strong>{EVENT.dateText}</strong> tại {EVENT.venue}, {EVENT.address}.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button onClick={onRsvp} className="px-8 py-4">Gửi RSVP <Icon name="heart" className="h-4 w-4" /></Button>
            <Button onClick={() => smoothScroll("gallery")} variant="outline" className="px-8 py-4">Xem album <Icon name="camera" className="h-4 w-4" /></Button>
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
              <img src={FEATURED_IMAGES[2]} alt="Khoảnh khắc cưới 3" className="h-52 w-full rounded-lg border border-white/70 object-cover object-top shadow-2xl" />
            </div>
          </div>
        </motion.div>
      </div>

      <button type="button" onClick={() => smoothScroll("story")} className="absolute bottom-7 left-1/2 z-30 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-white/80 bg-white/70 text-[#42553d] shadow-xl backdrop-blur" aria-label="Cuộn xuống">
        <Icon name="chevron-down" className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}

function StorySection() {
  const [selected, setSelected] = useState(0);

  return (
    <section id="story" className="relative overflow-hidden bg-[#f8f3e8] px-5 py-24">
      <FloralCorner className="absolute -bottom-32 -left-24 h-96 w-96 rotate-12 text-[#71856b]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <SectionLabel>Love timeline</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Câu chuyện tình yêu</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {STORY.map(([date, title, text], index) => (
            <motion.button key={date} type="button" onClick={() => setSelected(index)} whileHover={{ y: -6 }} className={`relative rounded-lg border p-5 text-left shadow-xl transition ${selected === index ? "border-[#c4a052] bg-white/88" : "border-white/70 bg-white/55 hover:bg-white/80"} backdrop-blur-xl`}>
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#42553d] text-white shadow-lg"><Icon name="heart" filled className="h-5 w-5" /></div>
              <div className="font-serif text-2xl text-[#42553d]">{date}</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[#8d6f31]">{title}</div>
              <p className="mt-4 text-sm leading-6 text-[#5f684e]">{text}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventSection() {
  return (
    <section id="events" className="relative bg-[#fdf8ee] px-5 py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8ee] via-[#f8f1e1] to-[#e6eddc]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel>Wedding day</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Lịch trình ngày cưới</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f684e]">Lễ thành hôn bắt đầu lúc <strong>{EVENT.ceremonyTime}</strong>. Bữa cơm thân mật được tổ chức lúc <strong>{EVENT.partyTime}</strong>, cùng ngày {EVENT.dateText}.</p>
          <div className="mt-8 rounded-lg border border-white/70 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <Icon name="calendar" className="mt-1 h-6 w-6 text-[#b48b3a]" />
              <div>
                <div className="font-serif text-2xl text-[#42553d]">Thứ Hai, {EVENT.dateText}</div>
                <div className="mt-1 text-sm text-[#6d745d]">Tức ngày {EVENT.lunarDate}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {SCHEDULE.map(([time, title, icon], index) => (
            <motion.div key={time} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} className="group flex items-center gap-5 rounded-lg border border-white/70 bg-white/70 p-5 shadow-xl shadow-[#42553d]/5 backdrop-blur-xl">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#42553d] text-white shadow-lg transition group-hover:scale-105 group-hover:bg-[#b48b3a]"><Icon name={icon} className="h-6 w-6" /></div>
              <div className="w-24 font-serif text-3xl text-[#b48b3a]">{time}</div>
              <div className="text-lg font-medium text-[#283b2c]">{title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="location" className="relative overflow-hidden bg-[#eef4e8] px-5 py-24">
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#40553d]/18 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-lg border border-white/70 bg-white/60 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl">
          <div className="relative h-[420px] overflow-hidden bg-[#dbe4d2]">
            <div className="absolute inset-0 opacity-65">
              <div className="absolute left-0 top-16 h-px w-full rotate-6 bg-[#9aa98e]" />
              <div className="absolute left-0 top-48 h-px w-full -rotate-3 bg-[#9aa98e]" />
              <div className="absolute left-0 top-72 h-px w-full rotate-2 bg-[#9aa98e]" />
              <div className="absolute left-20 top-0 h-full w-px rotate-12 bg-[#9aa98e]" />
              <div className="absolute left-64 top-0 h-full w-px -rotate-6 bg-[#9aa98e]" />
              <div className="absolute right-32 top-0 h-full w-px rotate-6 bg-[#9aa98e]" />
            </div>
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#b48b3a] text-white shadow-2xl shadow-[#b48b3a]/40"><Icon name="map-pin" filled className="h-9 w-9" /></motion.div>
            <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/80 bg-white/78 p-5 shadow-xl backdrop-blur-xl">
              <div className="font-serif text-2xl text-[#283b2c]">{EVENT.venue}</div>
              <div className="mt-2 text-sm leading-6 text-[#5f684e]">{EVENT.address}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <SectionLabel>Location</SectionLabel>
          <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Địa điểm tổ chức</h2>
          <p className="mt-5 text-sm leading-7 text-[#5f684e]">Khách mời có thể mở bản đồ và tìm tuyến đường đến Hội trường A - Hồ Cô Tiên.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button onClick={openMap} className="px-7 py-4"><Icon name="navigation" className="h-4 w-4" /> Chỉ đường</Button>
            <Button onClick={() => smoothScroll("guestbook")} variant="outline" className="px-7 py-4">Gửi lời chúc</Button>
          </div>
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
    <section id="gallery" className="bg-[#f8f3e8] px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionLabel>Memories</SectionLabel>
            <h2 className="font-serif text-4xl text-[#283b2c] md:text-5xl">Album ảnh</h2>
          </div>
          <div className="text-sm leading-6 text-[#5f684e] md:max-w-md">{GALLERY.length} khoảnh khắc được hiển thị bằng ảnh WebP tối ưu cho tốc độ tải trang.</div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          {GALLERY.slice(0, 3).map((image, index) => (
            <button key={image.id} type="button" onClick={() => setActive(index)} className={`group relative overflow-hidden rounded-lg border border-white/70 bg-white shadow-xl ${index === 0 ? "h-[460px]" : "h-[220px] md:h-[460px]"}`}>
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b241d]/45 via-transparent to-transparent opacity-80" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" style={{ gridAutoRows: "9px" }}>
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

function FamilyGuestbook({ onRsvp }) {
  const [wishes, setWishes] = useState([
    { name: "Minh Sơn", message: "Chúc hai bạn trăm năm hạnh phúc, luôn đồng hành và yêu thương nhau." },
    { name: "Bạn thân", message: "Ngày vui thật đẹp. Hẹn gặp hai bạn tại Hạ Long!" },
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
    <section id="guestbook" className="relative overflow-hidden bg-[#fdf8ee] px-5 py-24">
      <FloralCorner className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] text-[#71856b]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/70 bg-white/64 p-8 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl">
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
          <Button onClick={onRsvp} className="mt-7 w-full py-4">Xác nhận tham dự</Button>
        </div>

        <div className="rounded-lg border border-white/70 bg-white/64 p-8 shadow-2xl shadow-[#42553d]/10 backdrop-blur-xl">
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
        <div className="font-serif text-5xl italic text-[#f4d78d]">Tiến & Thuỷ</div>
        <p className="mt-4 text-sm leading-7 text-white/80">Cảm ơn Quý khách đã dành thời gian chung vui cùng gia đình.</p>
        <div className="mt-6 text-xs uppercase tracking-[0.24em] text-white/70">{EVENT.dateText} · {EVENT.venue}</div>
      </div>
    </footer>
  );
}

function App() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f3e8] text-[#283b2c]">
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #f8f3e8; }
        @keyframes petal-fall {
          0% { transform: translate3d(0, -12vh, 0) rotate(0deg); }
          50% { transform: translate3d(42px, 50vh, 0) rotate(180deg); }
          100% { transform: translate3d(-24px, 112vh, 0) rotate(360deg); }
        }
      `}</style>
      <Header onRsvp={() => setRsvpOpen(true)} />
      <Petals />
      <MusicControl />
      <main>
        <Hero onRsvp={() => setRsvpOpen(true)} />
        <StorySection />
        <EventSection />
        <LocationSection />
        <GallerySection />
        <FamilyGuestbook onRsvp={() => setRsvpOpen(true)} />
      </main>
      <Footer />
      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </div>
  );
}

export default App;

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
