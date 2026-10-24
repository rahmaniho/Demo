import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";

gsap.registerPlugin(ScrollTrigger);

/** مسیر نسبی تصویرها بر اساس BASE_URL تا روی GitHub Pages (زیرمسیر /Demo/) هم درست بارگذاری شوند */
const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, "")}`;

type SectionId =
  | "home"
  | "products"
  | "anatomy"
  | "uses"
  | "projects"
  | "process"
  | "about"
  | "faq"
  | "contact";

const NAV: [SectionId, string][] = [
  ["products", "محصولات"],
  ["projects", "پروژه‌ها"],
  ["process", "فرایند نصب"],
  ["faq", "پرسش‌ها"],
  ["contact", "تماس"],
];

const products = [
  {
    icon: "ri-sun-line",
    title: "نورگیر سقفی هوشمند",
    desc: "سقف اتاق‌های تاریک را به آسمان باز کنید؛ نور طبیعی فراوان، تهویه مطبوع و کنترل کامل از راه دور.",
    bullets: ["بازشو برقی با ریموت و اپلیکیشن", "سنسور باران و باد", "شیشه سه‌جداره با پوشش Low-E"],
    chart: "seasons",
    chartNote: "میانگین ساعت نور طبیعی در روز",
  },
  {
    icon: "ri-window-2-line",
    title: "پنجره سه‌جداره آلومینیومی",
    desc: "ترکیب پروفیل ترمال‌بریک و محفظه گاز آرگون، اتلاف انرژی را تا مرز استانداردهای passive-house پایین می‌آورد.",
    bullets: ["ضریب انتقال حرارت ۱٫۰ W/m²K", "گاز آرگون بین لایه‌ها", "پوشش بازتابنده Low-E"],
    chart: "donut",
    chartNote: "کاهش اتلاف انرژی نسبت به پنجره تک‌جداره",
  },
  {
    icon: "ri-volume-mute-line",
    title: "عایق صوتی شهری",
    desc: "اگر کنار خیابان شلوغ یا بزرگراه زندگی می‌کنید، لایه‌های شیشه و درزبندی چندگانه سکوت را به خانه برمی‌گردانند.",
    bullets: ["کاهش تا ۴۲ دسی‌بل صدای محیط", "درزبندی مغناطیسی سه‌لایه", "خواب آرام‌تر در شب"],
    chart: "noise",
    chartNote: "سطح صدا (دسی‌بل) پیش و پس از نصب",
  },
  {
    icon: "ri-landscape-line",
    title: "پنجره قدی و اسلایدینگ",
    desc: "قاب‌های باریک و دهانه‌های بدون ستون، منظره بیرون را مثل یک تابلوی زنده به داخل خانه می‌آورند.",
    bullets: ["دید پانوراما بدون ستون مزاحم", "یراق‌آلات نرم و بی‌صدا", "قفل ایمنی کودک"],
    chart: "temp",
    chartNote: "پایداری دمای داخل در برابر نوسان بیرون",
  },
];

const parts = [
  ["شیشه بیرونی نشکن ۴mm", "لایه نخست در برابر باد، باران و ضربه؛ با لبه‌های صیقل‌خورده."],
  ["محفظه گاز آرگون", "گاز بی‌ اثر و خشک که انتقال حرارت و میعان را متوقف می‌کند."],
  ["پوشش بازتابنده Low-E", "لایه نامرئی که گرما را به داخل اتاق بازمی‌گرداند."],
  ["شیشه میانی و داخلی", "دو لایه محافظ اضافه برای سکوت و ایمنی بیشتر."],
  ["پروفیل ترمال‌بریک آلومینیوم", "قاب مقاوم با پل حرارتی شکسته؛ بدون تغییر رنگ تا ده‌ها سال."],
];

const uses = [
  { icon: "fa-solid fa-house-chimney-window", title: "سقف شیروانی و اتاق زیرشیروانی", desc: "نورگیرهای بازشو و ثابت، فضای نیمه‌تاریک زیر سقف را به روشن‌ترین اتاق خانه تبدیل می‌کند." },
  { icon: "fa-solid fa-mountain-sun", title: "ویلا و خانه‌های ییلاقی", desc: "درهای اسلایدینگ قدی با دید پانوراما به جنگل، دریا یا کوهستان." },
  { icon: "fa-solid fa-building", title: "آپارتمان‌های شهری", desc: "عایق صوتی و حرارتی برای زندگی آرام در کنار خیابان‌های شلوغ." },
  { icon: "fa-solid fa-cloud-showers-heavy", title: "مناطق پرباران و برفی", desc: "آب‌بندی سه‌لایه و شیشه مقاوم در برابر باران تند و سنگینی برف." },
];

const steps = [
  { n: "۰۱", icon: "ri-ruler-2-line", title: "بازدید و اندازه‌گیری", desc: "کارشناس ما در محل حاضر می‌شود؛ ابعاد، زاویه سقف، جهت نور و وضعیت سازه را بررسی می‌کند." },
  { n: "۰۲", icon: "ri-pencil-ruler-2-line", title: "طراحی و انتخاب پروفیل", desc: "بر اساس اقلیم، کاربرد و بودجه شما، بهترین ترکیب شیشه، قاب و یراق‌آلات پیشنهاد می‌شود." },
  { n: "۰۳", icon: "ri-tools-line", title: "نصب تخصصی و آب‌بندی", desc: "نصب توسط تیم گواهی‌شده با آب‌بندی سه‌لایه، بدون آسیب به بنا و تحویل تمیز کارگاه." },
  { n: "۰۴", icon: "ri-shield-check-line", title: "تحویل، گارانتی و پشتیبانی", desc: "۱۰ سال گارانتی کتبی شیشه و پروفیل، ۵ سال خدمات نصب و پشتیبانی مادام‌العمر." },
];

const metrics: [string, string][] = [
  ["۱٫۰", "ضریب انتقال حرارت W/m²K"],
  ["۴۲dB", "کاهش صدای محیط"],
  ["+۱۲۰۰", "پروژه نصب‌شده"],
  ["۱۰ سال", "گارانتی کتبی"],
];

const projects = [
  { img: "/images/project1.jpg", tag: "ویلای مدرن", title: "نمای تمام‌شیشه در دل شب", text: "پنجره‌های قدی سه‌جداره با پروفیل مشکی، مرز میان نشیمن و طبیعت را از میان برداشتند؛ بدون اتلاف حرارت، بدون بازتاب آزاردهنده." },
  { img: "/images/project2.jpg", tag: "نورگیر سقفی", title: "آرامش زیر باران", text: "نورگیر سه‌جداره روی سقف شیروانی سنگی؛ حتی در باران تند هم بدون چکه، بدون صدا و بدون میعان." },
  { img: "/images/project3.jpg", tag: "خانه جنگلی", title: "صبح‌هایی رو به مه", text: "درهای اسلایدینگ سه‌جداره، منظره مه‌آلود جنگل را به اتاق نشیمن آوردند و سرمای صبح را پشت شیشه نگه داشتند." },
];

const testimonials: [string, string, string][] = [
  ["نورگیر اتاق زیرشیروانی را در یک روز نصب کردند؛ انگار یک اتاق جدید به خانه اضافه شد. نور عصرش دیدنی است.", "نگار محمدی", "صاحب‌خانه، لواسان"],
  ["کنار بزرگراه زندگی می‌کنیم و حالا شب‌ها صدای ماشین‌ها را نمی‌شنویم. تفاوت شیشه سه‌جداره باورنکردنی است.", "امید رستمی", "آپارتمان‌نشین، تهران"],
  ["از اندازه‌گیری تا تحویل، همه‌چیز برنامه‌ریزی‌شده و تمیز پیش رفت. پشتیبانی‌شان هم واقعاً پاسخ‌گوست.", "سارا کاویانی", "معمار و کارفرما"],
];

const faqs: [string, string][] = [
  ["نصب نورگیر سقفی چقدر طول می‌کشد؟", "برای یک نورگیر استاندارد روی سقف شیروانی، معمولاً یک تا دو روز کاری کافی است. پروژه‌های نمای تمام‌شیشه بسته به ابعاد، بین سه روز تا دو هفته زمان می‌برند."],
  ["آیا در فصل سرد یا بارانی هم نصب انجام می‌شود؟", "بله. با پوشش موقت سقف و آب‌بندی مرحله‌ای، هرگز خانه شما در معرض باران یا سرما نمی‌ماند؛ تیم نصب در همان روز، دهانه را می‌بندد."],
  ["گارانتی دقیقاً شامل چه مواردی است؟", "۱۰ سال گارانتی کتبی برای شیشه (از جمله میعان بین لایه‌ها) و پروفیل آلومینیوم، ۵ سال برای یراق‌آلات و آب‌بندی نصب، به‌همراه پشتیبانی مادام‌العمر."],
  ["سنسور باران چگونه کار می‌کند؟", "با نشست نخستین قطره‌های باران روی حسگر بیرونی، بازشوی برقی به‌صورت خودکار و کامل بسته می‌شود؛ حتی اگر خانه نباشید یا برق قطع باشد، فنر ایمنی دهانه را می‌بندد."],
  ["هزینه تقریبی چطور محاسبه می‌شود؟", "پس از بازدید رایگان، پیش‌فاکتور شفاف بر اساس ابعاد دهانه، نوع شیشه و یراق‌آلات صادر می‌شود. قیمت نهایی همان عدد پیش‌فاکتور است؛ بدون هزینه پنهان."],
];

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const SECTION_IDS: SectionId[] = ["home", ...NAV.map(([id]) => id)];

function useActiveSection() {
  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id as SectionId)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function go(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- نمودارهای توضیحی ---------- */
function Legend({ items }: { items: [string, string][] }) {
  return (
    <g className="chart-axis">
      {items.map(([color, label], i) => (
        <g key={label}>
          <rect x={26 + i * 92} y={10} width={12} height={12} fill={color} />
          <text x={44 + i * 92} y={20}>{label}</text>
        </g>
      ))}
    </g>
  );
}

function Chart({ type }: { type: string }) {
  if (type === "donut")
    return (
      <svg viewBox="0 0 320 220" className="h-full w-full">
        <circle cx="160" cy="110" r="68" className="donut" stroke="#e5ddd5" />
        <circle cx="160" cy="110" r="68" className="donut" stroke="#2d5016" strokeDasharray="171 428" />
        <text x="160" y="106" textAnchor="middle" className="chart-axis" style={{ fontSize: 13 }}>کاهش اتلاف انرژی</text>
        <text x="160" y="132" textAnchor="middle" fontWeight="700" fontSize="24">۴۰٪</text>
      </svg>
    );
  if (type === "seasons") {
    const vs: [string, number][] = [["بهار", 8.5], ["تابستان", 11], ["پاییز", 7], ["زمستان", 5]];
    return (
      <svg viewBox="0 0 360 220" className="h-full w-full">
        <g className="chart-grid">{[45, 90, 135, 180].map((y) => <line key={y} x1="32" y1={y} x2="345" y2={y} />)}</g>
        {vs.map(([label, v], i) => (
          <g key={label}>
            <rect className="chart-bar" x={62 + i * 75} y={190 - v * 14} width="40" height={v * 14} style={{ animationDelay: `${i * 90}ms` }} />
            <text x={82 + i * 75} y={208} textAnchor="middle" className="chart-axis">{label}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (type === "noise") {
    const rooms: [string, number, number][] = [["اتاق خواب", 72, 29], ["نشیمن", 66, 27], ["اتاق کار", 60, 25]];
    return (
      <svg viewBox="0 0 360 220" className="h-full w-full">
        <Legend items={[["#c9bdb2", "پیش از نصب"], ["#2d5016", "پس از نصب"]]} />
        <g className="chart-grid">{[60, 100, 140, 180].map((y) => <line key={y} x1="32" y1={y} x2="345" y2={y} />)}</g>
        {rooms.map(([label, before, after], i) => (
          <g key={label}>
            <rect className="chart-bar" x={48 + i * 105} y={190 - before * 1.9} width="28" height={before * 1.9} fill="#c9bdb2" style={{ animationDelay: `${i * 90}ms` }} />
            <rect className="chart-bar" x={82 + i * 105} y={190 - after * 1.9} width="28" height={after * 1.9} style={{ animationDelay: `${i * 90 + 120}ms` }} />
            <text x={72 + i * 105} y={208} textAnchor="middle" className="chart-axis">{label}</text>
          </g>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 360 220" className="h-full w-full">
      <Legend items={[["#8b847e", "دمای بیرون"], ["#1a1a1a", "دمای داخل"]]} />
      <g className="chart-grid">{[60, 100, 140, 180].map((y) => <line key={y} x1="28" y1={y} x2="345" y2={y} />)}</g>
      <polyline className="chart-line soft" points="35,70 92,150 149,62 206,155 263,75 330,145" />
      <polyline className="chart-line" points="35,112 92,110 149,116 206,108 263,114 330,110" />
    </svg>
  );
}

/* ---------- آناتومی پنجره ---------- */
function AnatomyDiagram() {
  return (
    <svg viewBox="0 0 560 330" className="w-full max-w-xl" role="img" aria-label="برش عرضی پنجره سه‌جداره آلپاین">
      {/* قاب */}
      <rect x="252" y="252" width="216" height="30" fill="#3a3f45" />
      <text x="360" y="305" textAnchor="middle" className="chart-axis" fill="#e8ddd3" style={{ fontSize: 12 }}>پروفیل ترمال‌بریک آلومینیوم</text>
      {/* لایه‌های شیشه (از راست = بیرون) */}
      <rect x="430" y="55" width="16" height="197" fill="#bcd6df" opacity="0.9" />
      <rect x="360" y="55" width="16" height="197" fill="#bcd6df" opacity="0.75" />
      <rect x="290" y="55" width="16" height="197" fill="#bcd6df" opacity="0.6" />
      {/* پوشش Low-E */}
      <rect x="355" y="55" width="4" height="197" fill="#e0b45c" />
      {/* محفظه‌های آرگون */}
      <text x="403" y="150" textAnchor="middle" className="chart-axis" fill="#ffffff99" style={{ fontSize: 11 }} transform="rotate(-90 403 150)">گاز آرگون</text>
      <text x="333" y="150" textAnchor="middle" className="chart-axis" fill="#ffffff99" style={{ fontSize: 11 }} transform="rotate(-90 333 150)">گاز آرگون</text>
      <line x1="403" y1="60" x2="403" y2="248" stroke="#ffffff33" strokeDasharray="4 6" />
      <line x1="333" y1="60" x2="333" y2="248" stroke="#ffffff33" strokeDasharray="4 6" />
      {/* پرتو نور: عبور می‌کند */}
      <line x1="540" y1="30" x2="270" y2="230" stroke="#ffd97a" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <text x="540" y="20" textAnchor="end" className="chart-axis" fill="#ffd97a" style={{ fontSize: 12 }}>نور طبیعی: عبور کامل</text>
      {/* موج حرارت: متوقف می‌شود */}
      <path d="M545 150 q10 -12 20 0 q10 12 20 0" transform="translate(-95 0)" fill="none" stroke="#ff8a66" strokeWidth="3" strokeLinecap="round" />
      <g stroke="#ff8a66" strokeWidth="3" strokeLinecap="round">
        <line x1="462" y1="142" x2="478" y2="158" />
        <line x1="478" y1="142" x2="462" y2="158" />
      </g>
      <text x="545" y="125" textAnchor="end" className="chart-axis" fill="#ff8a66" style={{ fontSize: 12 }}>اتلاف حرارت: متوقف</text>
      {/* جهت بیرون / داخل */}
      <text x="520" y="290" textAnchor="middle" className="chart-axis" fill="#ffffff88" style={{ fontSize: 12 }}>بیرون</text>
      <text x="200" y="290" textAnchor="middle" className="chart-axis" fill="#ffffff88" style={{ fontSize: 12 }}>داخل</text>
      {/* شماره لایه‌ها */}
      {[[438, 45, "۱"], [403, 45, "۲"], [357, 45, "۳"], [298, 45, "۴"], [452, 267, "۵"]].map(([x, y, n]) => (
        <g key={n as string}>
          <circle cx={x as number} cy={y as number} r="13" fill="#2d5016" />
          <text x={x as number} y={(y as number) + 5} textAnchor="middle" fill="#fff" style={{ fontSize: 13, fontFamily: "Vazirmatn" }}>{n}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- بخش‌ها ---------- */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={cn("fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-shadow", scrolled && "shadow-lg shadow-black/5")}>
      <div className="section-wrap flex h-20 items-center justify-between">
        <button onClick={() => go("home")} className="flex cursor-pointer items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-brand-green text-white"><i className="ri-window-2-line text-2xl" /></span>
          <span className="font-display text-2xl">پنجره‌های آلپاین</span>
        </button>
        <div className="desktop-nav flex items-center gap-7">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className={cn("cursor-pointer whitespace-nowrap transition", active === id ? "font-bold text-brand-green" : "text-neutral-600 hover:text-brand-green")}>
              {label}
            </button>
          ))}
        </div>
        <div className="desktop-nav flex items-center gap-3">
          <a href="tel:02191004820" className="px-4 py-2 text-sm text-neutral-700 hover:text-brand-green" dir="ltr">۰۲۱ ۹۱۰۰ ۴۸۲۰</a>
          <button onClick={() => go("contact")} className="cursor-pointer bg-brand-black px-5 py-2.5 text-sm text-white transition hover:bg-brand-green">مشاوره رایگان</button>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="منو" className="h-10 w-10 cursor-pointer md:hidden">
          <i className={`${open ? "ri-close-line" : "ri-menu-line"} text-2xl`} />
        </button>
      </div>
      {open && (
        <div className="border-t bg-white px-5 pb-5 md:hidden">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => { go(id); setOpen(false); }} className="block w-full cursor-pointer border-b py-3 text-right">{label}</button>
          ))}
          <button onClick={() => { go("contact"); setOpen(false); }} className="mt-4 w-full bg-brand-black py-3 text-white">مشاوره رایگان</button>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const quote = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: ".hero-container", start: "top top", end: "+=150%", pin: true, scrub: 1 } })
        .to(".hero__cover-img", { scale: 2, z: 350, transformOrigin: "center center", ease: "power1.inOut" })
        .to(".hero__cover", { "--overlay-opacity": 0, ease: "power1.inOut" }, "<")
        .to(".hero__bg", { scale: 1.1, filter: "blur(0px) brightness(1)", ease: "power1.inOut" }, "<")
        .to(".hero__title", { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power1.inOut" }, "<");
      if (quote.current) {
        const txt = quote.current.textContent || "";
        quote.current.innerHTML = [...txt].map((c) => (c === " " ? '<span class="char">&nbsp;</span>' : `<span class="char">${c}</span>`)).join("");
        const chars = quote.current.querySelectorAll(".char");
        gsap.set(chars, { opacity: 0.18 });
        gsap.timeline({ scrollTrigger: { trigger: ".quote-stick", pin: true, start: "center center", end: "+=1500", scrub: 1 } })
          .to(chars, { opacity: 1, stagger: 1, ease: "none" })
          .to({}, { duration: 8 })
          .to(".quote-fade", { opacity: 0, scale: 1.12, duration: 30 });
      }
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root}>
      <div className="hero-container" id="home">
        <section className="hero">
          <div className="hero__content">
            <div className="hero__bg" />
            <h1 className="hero__title">خانه‌ات را<br />غرق نور کن</h1>
          </div>
          <div className="hero__cover">
            <img className="hero__cover-img" src={asset("images/hero.jpg")} alt="اتاق زیرشیروانی روشن با نورگیرهای سقفی آلپاین" />
          </div>
          <div className="hero-hint">
            <span>برای دیدن نور، پیمایش کنید</span>
            <i className="ri-arrow-down-line text-xl" />
          </div>
        </section>
      </div>
      <section className="quote-stick">
        <p ref={quote} className="quote-fade">پنجره فقط شیشه نیست؛ قابی است که منظرهٔ زندگی‌ات را انتخاب می‌کند.</p>
      </section>
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="reveal mb-16 text-center">
      <h2 className="section-title mb-5">{title}</h2>
      <p className="mx-auto max-w-3xl text-xl text-brand-grey">{sub}</p>
    </div>
  );
}

function Products() {
  return (
    <section id="products" className="bg-white py-24">
      <div className="section-wrap">
        <Heading title="محصولاتی که آرامش می‌سازند" sub="از نورگیر سقفی تا پنجره‌های قدی؛ مهندسی‌شده برای نور بیشتر، سکوت بیشتر و مصرف انرژی کمتر" />
        <div className="grid gap-8 md:grid-cols-2">
          {products.map((f, i) => (
            <article key={f.title} className="feature-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="relative z-10">
                <div className="icon-box mb-6"><i className={`${f.icon} text-3xl`} /></div>
                <h3 className="mb-3 text-2xl">{f.title}</h3>
                <p className="mb-6 leading-8 text-brand-grey">{f.desc}</p>
                <ul className="mb-6 space-y-3">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-brand-grey">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><i className="ri-check-line" /></span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="h-56 bg-white/60 p-3"><Chart type={f.chart} /></div>
                <p className="mt-2 text-center text-xs text-brand-grey">{f.chartNote}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Anatomy() {
  return (
    <section id="anatomy" className="bg-brand-black py-24 text-white">
      <div className="section-wrap grid items-center gap-14 lg:grid-cols-2">
        <div className="reveal order-2 lg:order-1"><AnatomyDiagram /></div>
        <div className="reveal order-1 lg:order-2">
          <h2 className="section-title mb-6">آناتومی یک پنجره آلپاین</h2>
          <p className="mb-9 text-xl leading-9 text-white/70">
            هر پنجره ما پنج لایه مهندسی‌شده دارد که نور را عبور می‌دهند و سرما، گرما و صدا را پشت مرز خانه نگه می‌دارند.
          </p>
          <ol className="space-y-5">
            {parts.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green font-bold">{["۱", "۲", "۳", "۴", "۵"][i]}</span>
                <div>
                  <strong className="block text-lg">{t}</strong>
                  <span className="text-sm leading-7 text-white/60">{d}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Uses() {
  return (
    <section id="uses" className="bg-brand-beige-light py-24">
      <div className="section-wrap">
        <Heading title="برای هر فضا، یک راهکار" sub="از سقف شیروانی خانه قدیمی تا نمای شیشه‌ای ویلاهای مدرن" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {uses.map((x, i) => (
            <article key={x.title} className="industry-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-brand-beige-light text-brand-green"><i className={`${x.icon} text-xl`} /></div>
              <h3 className="mb-3 text-xl">{x.title}</h3>
              <p className="text-sm leading-7 text-brand-grey">{x.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="bg-white py-24">
      <div className="section-wrap">
        <Heading title="پروژه‌های اخیر" sub="نگاهی به خانه‌هایی که نور، سکوت و منظره را دوباره پیدا کردند" />
        <div className="grid gap-8 lg:grid-cols-3">
          {projects.map((s, i) => (
            <article key={s.title} className="reveal bg-white shadow-sm" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="story-img"><img src={asset(s.img)} alt={s.title} loading="lazy" /></div>
              <div className="p-8">
                <span className="text-sm font-bold text-brand-green">{s.tag}</span>
                <h3 className="my-3 text-3xl">{s.title}</h3>
                <p className="leading-8 text-brand-grey">{s.text}</p>
                <button onClick={() => go("contact")} className="mt-6 cursor-pointer border-b border-brand-green pb-1 text-brand-green">درخواست مشابه این پروژه ←</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-brand-beige-light py-24">
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-brand-green/10 blur-3xl" />
      <div className="section-wrap relative">
        <Heading title="فرایند نصب در چهار گام" sub="از تماس اول تا تحویل نهایی؛ بدون غافلگیری و بدون آسیب به بنای شما" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <article key={s.n} className="step-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="step-no">{s.n}</span>
              <div className="mb-8 flex h-14 w-14 items-center justify-center bg-brand-green text-white"><i className={`${s.icon} text-2xl`} /></div>
              <h3 className="mb-3 text-xl">{s.title}</h3>
              <p className="leading-7 text-brand-grey">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="bg-brand-black py-20 text-white">
      <div className="section-wrap grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([n, l]) => (
          <div key={l} className="reveal">
            <strong className="font-display block text-5xl text-brand-beige">{n}</strong>
            <span className="mt-3 block text-white/70">{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InstallBand() {
  const items = [
    "تیم نصب گواهی‌شده، نه پیمانکار متفرقه",
    "آب‌بندی سه‌لایه و تست فشار هوا و آب پس از نصب",
    "پوشش کامل کارگاه؛ خانه شما تمیز تحویل می‌شود",
    "شیشه سه‌جداره با ضریب انتقال حرارت ۱٫۰ W/m²K",
  ];
  return (
    <section id="about" className="bg-white py-24">
      <div className="section-wrap grid items-center gap-12 lg:grid-cols-2">
        <div className="story-img reveal"><img src={asset("images/install.jpg")} alt="نصاب متخصص آلپاین در حال نصب پنجره سه‌جداره" loading="lazy" /></div>
        <div className="reveal">
          <h2 className="section-title mb-6">نصب، نیمی از محصول است</h2>
          <p className="mb-7 leading-9 text-brand-grey">
            بهترین شیشه سه‌جداره هم اگر درست نصب نشود، چکه می‌کند، صدا می‌دهد و انرژی هدر می‌دهد. به همین دلیل نصب هر پروژه را تنها با تیم آموزش‌دیده خودمان انجام می‌دهیم و پس از پایان کار، دهانه را با تست فشار هوا و آب تحویل می‌دهیم.
          </p>
          <ul className="space-y-4">
            {items.map((x) => (
              <li key={x} className="flex items-center gap-3 text-brand-grey">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><i className="ri-check-line" /></span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-brand-beige-light py-24">
      <div className="section-wrap">
        <Heading title="روایت صاحب‌خانه‌ها" sub="تجربه کسانی که هر صبح با نور طبیعی بیدار می‌شوند" />
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map(([q, n, r], i) => (
            <blockquote key={n} className="reveal border-t-4 border-brand-green bg-white p-8" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="mb-5 text-brand-green">★★★★★</div>
              <p className="mb-8 leading-8 text-brand-grey">«{q}»</p>
              <strong className="block">{n}</strong>
              <span className="text-sm text-brand-grey">{r}</span>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-white py-24">
      <div className="section-wrap max-w-4xl">
        <Heading title="پرسش‌های متداول" sub="هرآنچه پیش از سفارش باید بدانید" />
        {faqs.map(([q, a], i) => (
          <div key={q} className="faq-item reveal">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-right">
              <span className="text-lg font-semibold">{q}</span>
              <i className={`${open === i ? "ri-subtract-line" : "ri-add-line"} text-2xl text-brand-green`} />
            </button>
            <div className={`faq-answer ${open === i ? "open" : ""}`}>
              <div><p className="pb-6 leading-8 text-brand-grey">{a}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="bg-brand-green py-24 text-white">
      <div className="section-wrap reveal text-center">
        <h2 className="section-title mb-6">آماده‌ای سقف خانه‌ات را به آسمان باز کنی؟</h2>
        <p className="mx-auto mb-9 max-w-2xl text-xl text-white/80">همین امروز مشاوره رایگان بگیر؛ کارشناس ما بازدید، اندازه‌گیری و پیش‌فاکتور شفاف را بر عهده می‌گیرد.</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button onClick={() => go("contact")} className="cursor-pointer bg-white px-8 py-4 font-bold text-brand-green">درخواست مشاوره رایگان</button>
          <a href="tel:02191004820" className="border-2 border-white px-8 py-4 font-bold">تماس تلفنی</a>
        </div>
        <p className="mt-6 text-sm text-white/65">بازدید رایگان · پیش‌فاکتور شفاف · گارانتی ۱۰ ساله کتبی</p>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="bg-brand-beige-light py-24">
      <div className="section-wrap">
        <Heading title="با ما گفت‌وگو کنید" sub="برای مشاوره، بازدید رایگان یا استعلام قیمت، فرم زیر را تکمیل کنید." />
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="reveal lg:col-span-2">
            <h3 className="mb-6 text-3xl">راه‌های ارتباطی</h3>
            <p className="mb-8 leading-8 text-brand-grey">کارشناسان ما حداکثر تا یک روز کاری پاسخ می‌دهند؛ برای موارد فوری تلفن سریع‌تر است.</p>
            <div className="space-y-5">
              <p><a href="mailto:info@alpine-windows.ir" className="hover:text-brand-green"><i className="ri-mail-line ml-3 text-brand-green" /><span dir="ltr">info@alpine-windows.ir</span></a></p>
              <p><a href="tel:02191004820" className="hover:text-brand-green"><i className="ri-phone-line ml-3 text-brand-green" />۰۲۱ ۹۱۰۰ ۴۸۲۰</a></p>
              <p><i className="ri-map-pin-line ml-3 text-brand-green" />تهران، بلوار کشاورز، خیابان سپند، پلاک ۲۴</p>
              <p><i className="ri-time-line ml-3 text-brand-green" />شنبه تا پنج‌شنبه، ۹ تا ۱۸</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="reveal bg-white p-8 lg:col-span-3">
            {sent ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <i className="ri-checkbox-circle-line mb-5 text-6xl text-brand-green" />
                <h3 className="text-3xl">درخواست شما ثبت شد</h3>
                <p className="mt-3 text-brand-grey">به‌زودی برای هماهنگی بازدید رایگان با شما تماس می‌گیریم.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <label>نام و نام خانوادگی<input required className="input mt-2" placeholder="مثلاً نگار محمدی" /></label>
                <label>شماره تماس<input required type="tel" className="input mt-2" dir="ltr" placeholder="0912..." /></label>
                <label>نوع فضا<select className="input mt-2" defaultValue="اتاق زیرشیروانی">
                  {["اتاق زیرشیروانی", "ویلایی", "آپارتمان شهری", "فضای تجاری"].map((o) => <option key={o}>{o}</option>)}
                </select></label>
                <label>شهر<input className="input mt-2" placeholder="تهران" /></label>
                <label className="sm:col-span-2">توضیح پروژه<textarea required rows={5} className="input mt-2 resize-none" placeholder="مثلاً نورگیر سقفی برای اتاق زیرشیروانی با سقف شیروانی..." /></label>
                <button className="cursor-pointer bg-brand-green px-7 py-4 font-bold text-white sm:col-span-2">ارسال درخواست</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: [string, [string, SectionId | null][]][] = [
    ["محصولات", [["نورگیر سقفی", "products"], ["پنجره سه‌جداره", "products"], ["درهای اسلایدینگ", "products"]]],
    ["شرکت", [["پروژه‌ها", "projects"], ["فرایند نصب", "process"], ["درباره ما", "about"]]],
    ["پشتیبانی", [["پرسش‌های متداول", "faq"], ["تماس با ما", "contact"], ["مشاوره رایگان", "contact"]]],
  ];
  return (
    <footer className="bg-brand-black py-16 text-white">
      <div className="section-wrap">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-brand-green"><i className="ri-window-2-line text-xl" /></span>
              <span className="font-display text-2xl">پنجره‌های آلپاین</span>
            </div>
            <p className="max-w-sm leading-7 text-brand-beige-light">نورگیرهای سقفی و پنجره‌های سه‌جداره؛ برای خانه‌هایی که نور، سکوت و منظره کم ندارند.</p>
          </div>
          {cols.map(([h, ls]) => (
            <div key={h}>
              <h3 className="mb-5 text-lg">{h}</h3>
              <ul className="space-y-3 text-brand-beige-light">
                {ls.map(([label, target]) => (
                  <li key={label}><button onClick={() => target && go(target)} className="cursor-pointer hover:text-white">{label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-brand-beige-light md:flex-row">
          <p>© ۱۴۰۵ پنجره‌های آلپاین. همه حقوق محفوظ است.</p>
          <div className="flex gap-6"><a href="#home">بازگشت به بالا ↑</a></div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);
  return (
    <>
      <Header />
      <main className="bg-brand-beige-light">
        <Hero />
        <Products />
        <Anatomy />
        <Uses />
        <Projects />
        <Process />
        <Metrics />
        <InstallBand />
        <Testimonials />
        <Faq />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
