// pull React from ESM CDN (works on GitHub Pages)
import React from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Ren — Personal Site (glassy + playful)
 * - Data-driven via siteConfig
 * - Sections: Hero, Projects, Experience, Guestbook (with replies), About, Contact
 * - Kept tasteful easter eggs (Ironmouse theme, confetti); removed pet features
 */

// ===================== CONFIG =====================
const siteConfig = {
  name: "Ren",
  fullName: "Renaldi Chaka Bagastama",
  tag: "UI/UX • Creative Dev • Chaos Tamer",
  location: "Yerevan → Europe soon",
  email: "you@example.com", // TODO: update
  resumeUrl: "/assets/Renaldi_Resume.pdf", // TODO: place your PDF
  socials: {
    github: "https://github.com/rrrreii",
    twitter: "https://x.com/yourhandle",
    linkedin: "https://www.linkedin.com/in/your-handle/",
    website: "https://mouseyy.pages.dev/"
  },
  about: `Cynical, competent, and allergic to bloated UX. I ship neat, fast, and slightly feral interfaces.\nI’ve done UI/UX, video edits, and hobby dev from CMS bits to Habbo retro servers.\nCurrently saving, grinding nights, and building an AI companion because love is real and also programmable.`,
  currently: [
    "Night‑shift CS @ Trishula Tech (saving for relocation)",
    "Prototyping AI Companion (Open‑LLM‑VTuber + Hume)",
    "Collecting EU opportunities (logistics / creative / frontend)"
  ],
  skills: ["Figma", "After Effects", "Premiere", "Photoshop", "HTML", "CSS", "JS", "Node", "Python", "UI/UX"],
  projects: [
    {
      title: "Open‑LLM‑VTuber Companion",
      blurb: "Interactive VTuber‑style AI with emotion‑aware TTS, Discord hooks, and cozy chaos.",
      tech: ["Node", "Ollama", "Hume AI", "WebRTC"],
      links: { live: "#", repo: "https://github.com/Open-LLM-VTuber/Open-LLM-VTuber" },
      image: "/assets/vtuber-thumb.png"
    },
    {
      title: "Mouseyy Microsite",
      blurb: "Charity promo + media deck for Ironmouse. Minimal, fast, unhinged.",
      tech: ["HTML", "CSS", "JS"],
      links: { live: "https://mouseyy.pages.dev/", repo: "https://github.com/rrrreii/mouseyy" },
      image: "/assets/mouseyy.png"
    },
    {
      title: "Retro CMS + Habbo Server",
      blurb: "Wrote/edited CMS from scratch, themed UI, stable deployment. Nostalgia with guardrails.",
      tech: ["PHP", "MySQL", "Nginx"],
      links: { live: "#", repo: "#" },
      image: "/assets/habbo.png"
    }
  ],
  experience: [
    {
      role: "Customer Support (Night Shift)",
      org: "Trishula Tech",
      period: "2025 – Present",
      bullets: [
        "Handled high‑volume tickets with a < 1h median resolution",
        "Documented processes; reduced repeat issues via macros & micro‑UX hints",
        "Savings discipline for relocation (ops‑minded, reliable)"
      ]
    },
    {
      role: "Freelance Creative",
      org: "Various (BRI Insurance, Robot&Co)",
      period: "2021 – 2024",
      bullets: [
        "Produced motion/video assets, social graphics, and lightweight web pages",
        "Improved content turnaround by ~40% using templates & automation"
      ]
    }
  ]
};

// ===================== UTILITIES =====================
const cn = (...s) => s.filter(Boolean).join(" ");
const rnd = (min, max) => Math.random() * (max - min) + min;

const useLocalStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw != null ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
};

// tiny event bus on window for confetti/toasts
const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
const useEvent = (name, handler) => {
  useEffect(() => { const h = (e) => handler?.(e.detail); window.addEventListener(name, h); return () => window.removeEventListener(name, h); }, [name, handler]);
};

// ===================== APP =====================
export default function Site() {
  const [theme, setTheme] = useLocalStorage("nyan_theme", "dark");
  const [secret, setSecret] = useLocalStorage("nyan_secret", "");
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current?.closest("html") || document.documentElement;
    if (theme === "dark") el.classList.add("dark"); else el.classList.remove("dark");
  }, [theme]);

  useEffect(() => { if (secret === "mousey") emit("nyan:toast", { text: "Mousey mode unlocked" }); }, [secret]);

  return (
    <div ref={rootRef} className={cn("min-h-dvh w-full bg-gradient-to-br",
      theme === "dark" ? (secret === "mousey" ? "from-fuchsia-900 via-zinc-950 to-black text-zinc-100" : "from-zinc-900 via-zinc-950 to-black text-zinc-100")
                        : (secret === "mousey" ? "from-pink-50 via-rose-50 to-white text-zinc-900" : "from-white via-zinc-100 to-sky-50 text-zinc-900"))}>
      {/* Anchor for back-to-top */}
      <a id="top" className="absolute left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden />

      <SiteChrome theme={theme} setTheme={setTheme} secret={secret} />
      <ConfettiLayer />
      <Toaster />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16">
        <Hero theme={theme} secret={secret} />
        <ProjectsGrid items={siteConfig.projects} />
        <ExperienceTimeline items={siteConfig.experience} />
        <Guestbook setSecret={setSecret} />
        <AboutSection />
        <ContactBlock email={siteConfig.email} socials={siteConfig.socials} resumeUrl={siteConfig.resumeUrl} />
        <FunExtras />
        <Footer />
      </main>
    </div>
  );
}

// ===================== CHROME / HEADER =====================
function SiteChrome({ theme, setTheme, secret }) {
  const [openHelp, setOpenHelp] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/10 dark:supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo secret={secret} />
        <nav className="ml-auto hidden gap-2 sm:flex">
          <NavButton href="#projects">Projects</NavButton>
          <NavButton href="#experience">Experience</NavButton>
          <NavButton href="#guestbook">Guestbook</NavButton>
          <NavButton href="#about">About</NavButton>
          <NavButton href="#contact">Contact</NavButton>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenHelp(true)} className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/20" aria-label="Help">?</button>
          <ThemeSwitch theme={theme} onToggle={() => setTheme(t => (t === "dark" ? "light" : "dark"))} />
        </div>
      </div>
      {openHelp && <HelpPanel onClose={() => setOpenHelp(false)} />}
    </header>
  );
}

function Logo({ secret }) {
  return (
    <div className="flex select-none items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-inset ring-white/10">
      <span className="inline-grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-pink-500 to-indigo-500 text-white shadow"><span className="text-xs">ny</span></span>
      <span className="text-sm font-semibold tracking-wide">ren</span>
      {secret === "mousey" && (<span className="ml-2 rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-200 ring-1 ring-pink-300/30">MOUSEY</span>)}
    </div>
  );
}

function NavButton({ href, children }) {
  return <a href={href} className="rounded-xl px-3 py-1.5 text-sm font-medium text-white/80 ring-1 ring-inset ring-white/10 transition hover:text-white hover:ring-white/20">{children}</a>;
}

function ThemeSwitch({ theme, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme" className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/20">{theme === "dark" ? "Dark" : "Light"}</button>
  );
}

function HelpPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-w-lg rounded-3xl border border-white/15 bg-white/10 p-5 text-sm text-white/90 backdrop-blur">
        <div className="mb-2 flex items-center justify-between"><h3 className="text-lg font-bold">Help & Secrets</h3><button onClick={onClose} className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">close</button></div>
        <ul className="list-inside list-disc space-y-1 text-white/80">
          <li>Guestbook easter egg: names <i>ren/rena/ren-chan/rena-chan/renaldi/fishboy</i> → nyan replies to your comment.</li>
          <li>Message contains <code className="rounded bg-black/30 px-1">what the freak</code> → confetti pops.</li>
          <li>Name <i>ironmouse</i> or <i>mousey</i> → unlocks a pinkish secret theme.</li>
          <li>Message exactly <i>first!</i> → nyan roasts you (deserved).</li>
        </ul>
        <p className="mt-3 text-xs text-white/60">No accounts or tracking. Guestbook saves locally.</p>
      </div>
    </div>
  );
}

// ===================== HERO =====================
function Hero({ theme, secret }) {
  return (
    <section className="relative mb-10 mt-4">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-3xl">
        <div className={cn("mx-auto h-48 w-3/4 rounded-full",
          theme === "dark" ? (secret === "mousey"
            ? "bg-[radial-gradient(circle_at_30%_20%,#ec4899_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#f472b6_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#e879f9_0%,transparent_40%)]"
            : "bg-[radial-gradient(circle_at_30%_20%,#ec4899_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#6366f1_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#22d3ee_0%,transparent_40%)]")
          : (secret === "mousey"
            ? "bg-[radial-gradient(circle_at_30%_20%,#f472b6_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#f9a8d4_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#f0abfc_0%,transparent_40%)]"
            : "bg-[radial-gradient(circle_at_30%_20%,#f472b6_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#93c5fd_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#67e8f9_0%,transparent_40%)]"))}/>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{siteConfig.fullName} — {siteConfig.name}</h1>
          <p className="mt-1 text-lg font-semibold text-white/80">{siteConfig.tag}</p>
          <p className="mt-3 max-w-prose text-base text-white/70">minimal brain cells, maximal polish. i design, prototype, and ship fast.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={siteConfig.resumeUrl} className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900 shadow hover:bg-white">View Resume</a>
            <a href="#contact" className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/20">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== PROJECTS =====================
function ProjectsGrid({ items }) {
  return (
    <section id="projects" className="mt-6">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Projects</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => <ProjectCard key={i} p={p} />)}
      </div>
    </section>
  );
}

function ProjectCard({ p }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
      <div className="aspect-video w-full bg-white/5">
        {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-white/40">no image</div>}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{p.title}</h3>
        <p className="mt-1 text-sm text-white/70">{p.blurb}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.tech?.map((t, i) => <span key={i} className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white/80">{t}</span>)}
        </div>
        <div className="mt-3 flex gap-2 text-sm">
          {p.links?.live && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 font-semibold hover:bg-white/20" href={p.links.live}>Live</a>}
          {p.links?.repo && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 font-semibold hover:bg-white/20" href={p.links.repo}>Repo</a>}
        </div>
      </div>
    </article>
  );
}

// ===================== EXPERIENCE =====================
function ExperienceTimeline({ items }) {
  return (
    <section id="experience" className="mt-10">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Experience</h2>
      <ol className="relative border-l border-white/15 pl-4">
        {items.map((e, i) => (
          <li key={i} className="mb-6 ml-2">
            <span className="absolute -left-[6px] mt-1 h-3 w-3 rounded-full bg-white/60 ring-2 ring-white/20" />
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{e.role} — <span className="text-white/80">{e.org}</span></div>
                <div className="text-xs text-white/60">{e.period}</div>
              </div>
              <ul className="mt-2 list-inside list-disc text-sm text-white/80">
                {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ===================== GUESTBOOK (threaded replies) =====================
function Guestbook({ setSecret }) {
  const [items, setItems] = useLocalStorage("nyan_guestbook", []); // [{id,name,msg,at,nyan?,parentId?}]
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [replyTo, setReplyTo] = useState(null); // id of parent we're replying to

  const nyanTargets = ["ren","rena","ren-chan","rena-chan","renaldi","fishboy"];
  const isRenLike = (who) => nyanTargets.includes((who || "").toLowerCase());
  const pickReply = () => {
    const variants = [
      "i love you, rena-chan.",
      "mine.",
      "get in the hoodie.",
      "kissing you now. no refunds.",
      "you’re my favorite fish.",
      "i pick you. every time.",
      "thanks for existing, idiot. (affectionate)",
      "cuddle tax is due.",
      "i’m keeping you. try and stop me.",
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  };

  const roastFirst = () => {
    const zingers = ["not anymore.", "congrats on inventing numbers.", "ok pioneer of comments sections.", "bold of you to assume i care."];
    return zingers[Math.floor(Math.random() * zingers.length)];
  };

  const submit = (e) => {
    e.preventDefault();
    const trimmed = msg.trim();
    const who = (name || "").trim() || "anon";
    if (!trimmed) return;

    const id = crypto.randomUUID();
    const entry = { id, name: who, msg: trimmed, at: new Date().toISOString(), parentId: replyTo || null };
    const next = [entry, ...items].slice(0, 200);
    setItems(next);
    setMsg("");
    setReplyTo(null);

    // triggers
    if (/what the freak/i.test(trimmed)) emit("nyan:confetti");

    const lowerName = who.toLowerCase();
    if (lowerName === "ironmouse" || lowerName === "mousey") {
      try { localStorage.setItem("nyan_secret", JSON.stringify("mousey")); } catch {}
      setSecret?.("mousey");
      emit("nyan:toast", { text: "Mousey mode unlocked" });
      emit("nyan:confetti", { count: 36 });
    }

    if (/^first!$/i.test(trimmed)) {
      const rid = crypto.randomUUID();
      setTimeout(() => setItems((cur) => [
        { id: rid, name: "nyan", msg: roastFirst(), at: new Date().toISOString(), nyan: true, parentId: id },
        ...cur
      ].slice(0, 200)), 480);
    }

    // Easter egg: auto-reply when ren-like leaves a message (nyan replies to that specific comment)
    if (isRenLike(who)) {
      const rid = crypto.randomUUID();
      setTimeout(() => setItems((cur) => [
        { id: rid, name: "nyan", msg: pickReply(), at: new Date().toISOString(), nyan: true, parentId: id },
        ...cur
      ].slice(0, 200)), 450);
    }
  };

  // Build a tree for cascading display
  const byParent = new Map();
  for (const it of items) {
    const key = it.parentId || "root";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(it);
  }
  // sort by newest first for each level
  for (const arr of byParent.values()) arr.sort((a,b)=> new Date(b.at) - new Date(a.at));

  const renderThread = (parentId = null, depth = 0) => {
    const list = byParent.get(parentId || "root") || [];
    if (!list.length) return null;
    return (
      <ul className={cn("mt-2 space-y-2", depth>0 && "ml-4 border-l border-white/10 pl-3") }>
        {list.map(it => (
          <li key={it.id} className={cn("rounded-2xl border border-white/10 bg-white/5 p-3", it.nyan && "border-pink-300/30 bg-pink-300/10") }>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span className={cn(it.nyan && "text-pink-300 font-semibold")}>{it.nyan ? "nyan" : it.name}</span>
              <time dateTime={it.at}>{new Date(it.at).toLocaleString()}</time>
            </div>
            {it.parentId && (
              <p className="mt-1 text-[11px] text-white/50">replying to <em>{(items.find(x=>x.id===it.parentId)?.nyan?"nyan":items.find(x=>x.id===it.parentId)?.name)||"comment"}</em></p>
            )}
            <p className="mt-1 text-sm">{it.msg}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>setReplyTo(it.id)} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">reply</button>
            </div>
            {renderThread(it.id, depth+1)}
          </li>
        ))}
      </ul>
    );
  };

  const replyingToName = replyTo ? (items.find(x=>x.id===replyTo)?.nyan?"nyan":items.find(x=>x.id===replyTo)?.name) : null;

  return (
    <section id="guestbook" className="mt-10">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Guestbook</h2>
      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <form onSubmit={submit} className="grid gap-2 sm:grid-cols-[180px,1fr,120px]">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="name (optional)" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"/>
          <div className="flex items-center gap-2">
            <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder={replyTo?`replying to ${replyingToName || "comment"}…`:"say something nice or feral"} className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"/>
            {replyTo && <button type="button" onClick={()=>setReplyTo(null)} className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">cancel</button>}
          </div>
          <button className="rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-white">{replyTo?"reply":"sign"}</button>
        </form>
        {renderThread(null, 0)}
      </div>
    </section>
  );
}

// ===================== ABOUT =====================
function AboutSection() {
  return (
    <section id="about" className="mt-12">
      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
        <h2 className="text-2xl font-bold tracking-tight">About</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-white/70">{siteConfig.about}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-white/80">Currently</h3>
            <ul className="mt-1 list-inside list-disc text-sm text-white/70">{siteConfig.currently.map((c,i)=><li key={i}>{c}</li>)}</ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/80">Skills</h3>
            <div className="mt-1 flex flex-wrap gap-1.5">{siteConfig.skills.map((s,i)=>(<span key={i} className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white/80">{s}</span>))}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== CONTACT =====================
function ContactBlock({ email, socials, resumeUrl }) {
  return (
    <section id="contact" className="mt-12">
      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
        <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
        <div className="mt-2 text-sm text-white/80">Based in {siteConfig.location}. Open to EU roles & trials.</div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" href={`mailto:${email}`}>Email</a>
          {socials.github && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" href={socials.github}>GitHub</a>}
          {socials.linkedin && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" href={socials.linkedin}>LinkedIn</a>}
          {socials.twitter && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" href={socials.twitter}>Twitter</a>}
          {socials.website && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" href={socials.website}>Website</a>}
          {resumeUrl && <a className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" href={resumeUrl}>Resume PDF</a>}
        </div>
      </div>
    </section>
  );
}

// ===================== FUN EXTRAS (tucked) =====================
function FunExtras() {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-12">
      <button onClick={()=>setOpen(o=>!o)} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/20">{open ? "Hide" : "Show"} Fun Extras</button>
      {open && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <GlassCard><GremlinButton /></GlassCard>
          <GlassCard><GuestbookPreview /></GlassCard>
        </div>
      )}
    </section>
  );
}

// ===================== GLOBAL EFFECTS =====================
function ConfettiLayer() {
  const [bits, setBits] = useState([]);
  useEvent("nyan:confetti", (detail) => {
    const id = Math.random().toString(36).slice(2);
    const pack = Array.from({ length: detail?.count || 24 }, (_, i) => ({ id: `${id}-${i}`, x: rnd(5, 95), rot: rnd(-30, 30), emoji: ["✨","💖","🐟","😼","⭐","🌸"][Math.floor(rnd(0,6))], life: 1500 + Math.random()*800 }));
    setBits((prev) => [...prev, ...pack]);
    setTimeout(() => setBits((prev) => prev.filter(b => !pack.some(p => p.id === b.id))), 2200);
  });
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {bits.map((c) => (<span key={c.id} style={{ left: `${c.x}%`, animationDuration: `${c.life}ms`, transform: `rotate(${c.rot}deg)` }} className="absolute top-0 select-none animate-[fall_1.9s_linear_forwards]">{c.emoji}</span>))}
      <style>{`@keyframes fall { 0% { top: 0; opacity: 1 } 100% { top: 100%; opacity: 0 } }`}</style>
    </div>
  );
}

function Toaster() {
  const [toasts, setToasts] = useState([]);
  useEvent("nyan:toast", ({ text }) => { const id = Math.random().toString(36).slice(2); setToasts((t) => [...t, { id, text }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1800); });
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {toasts.map((t, i) => (<div key={t.id} style={{ top: `${8 + i * 36}px` }} className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white shadow">{t.text}</div>))}
    </div>
  );
}

function GlassCard({ children }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-xl transition group-hover:opacity-40" style={{ background: "radial-gradient(800px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.25), transparent 40%)" }} />
      <div className="[&>*]:relative" onMouseMove={(e)=>{ const el = e.currentTarget; const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`); }}>{children}</div>
    </div>
  );
}

function GremlinButton() {
  const click = () => { emit("nyan:confetti"); emit("nyan:toast", { text: "gremlin mode: ON" }); };
  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-lg font-semibold">Gremlin Button</h3><span className="text-xs text-white/60">spawns ✨ chaos ✨</span></div>
      <button onClick={click} className="w-full rounded-2xl bg-gradient-to-br from-pink-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[.99]">what the freak</button>
    </div>
  );
}

function GuestbookPreview() {
  const [items] = useLocalStorage("nyan_guestbook", []);
  const roots = items.filter(it=>!it.parentId).slice(0,4);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between"><h3 className="text-lg font-semibold">Guestbook</h3><a href="#guestbook" className="text-xs text-white/70 underline underline-offset-4">open</a></div>
      {roots.length === 0 ? (
        <p className="text-sm text-white/60">no entries yet. be the first gremlin to scribble.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {roots.map((it,i) => (
            <li key={i} className="truncate"><span className={cn("text-white/60", it.nyan && "text-pink-300 font-semibold")}>{it.nyan ? "nyan" : it.name}</span>: {it.msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===================== FOOTER =====================
function Footer() {
  return (
    <footer className="mt-12 flex items-center justify-between text-xs text-white/40">
      <span>made with <span aria-hidden>❤</span> by ren + nat</span>
      <a className="underline underline-offset-4" href="#top">back to top</a>
    </footer>
  );
}


// ---- mount ----
const root = createRoot(document.getElementById("root"));
import Site from "/site-impl.jsx";
root.render(React.createElement(Site));
