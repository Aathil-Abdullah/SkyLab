import { useState, useEffect, useRef } from "react";

// ── palette ────────────────────────────────────────────────────────────────
const C = {
  navy:   "#0a0f2e",
  deep:   "#0d1540",
  mid:    "#112060",
  accent: "#00d4ff",
  gold:   "#ffd94a",
  green:  "#00e5a0",
  coral:  "#ff5e5b",
  white:  "#f0f6ff",
  muted:  "#8899cc",
};

const gfont = document.createElement("link");
gfont.rel = "stylesheet";
gfont.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=DM+Sans:wght@300;400;500;700&display=swap";
document.head.appendChild(gfont);

const css = `
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:${C.navy};color:${C.white};font-family:'DM Sans',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:${C.navy};}::-webkit-scrollbar-thumb{background:${C.accent};border-radius:3px;}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pageIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
.page-wrap{animation:pageIn .45s cubic-bezier(.22,1,.36,1) both;}
.star{position:absolute;border-radius:50%;background:#fff;animation:twinkle var(--d,3s) infinite var(--delay,0s);}
.nav-link{color:${C.muted};text-decoration:none;font-size:.82rem;letter-spacing:.07em;text-transform:uppercase;transition:color .2s;background:none;border:none;cursor:pointer;font-family:inherit;padding:0;}
.nav-link:hover,.nav-link.active{color:${C.accent};}
.nav-link.active{border-bottom:2px solid ${C.accent};padding-bottom:2px;}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.6rem;border-radius:50px;font-weight:600;font-size:.9rem;cursor:pointer;border:none;transition:all .25s;text-decoration:none;font-family:inherit;}
.btn-primary{background:${C.accent};color:${C.navy};}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px ${C.accent}55;}
.btn-outline{background:transparent;border:1.5px solid ${C.accent};color:${C.accent};}
.btn-outline:hover{background:${C.accent}22;transform:translateY(-2px);}
.section{padding:110px 5% 80px;}
.section-label{font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:${C.accent};margin-bottom:.5rem;}
.section-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.8rem,4vw,3rem);line-height:1.15;margin-bottom:1.2rem;}
.section-sub{color:${C.muted};max-width:560px;line-height:1.7;}
.card{background:linear-gradient(135deg,${C.mid}44,${C.deep}88);border:1px solid ${C.accent}22;border-radius:16px;padding:1.6rem;transition:all .3s;backdrop-filter:blur(8px);}
.card:hover{border-color:${C.accent}66;transform:translateY(-4px);box-shadow:0 16px 40px ${C.accent}18;}
.tag{display:inline-block;padding:.3rem .8rem;border-radius:50px;font-size:.72rem;font-weight:600;letter-spacing:.05em;background:${C.accent}22;color:${C.accent};border:1px solid ${C.accent}44;}
.social-icon{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${C.mid};border:1px solid ${C.accent}33;cursor:pointer;transition:all .2s;text-decoration:none;color:${C.white};font-size:.8rem;font-weight:700;}
.social-icon:hover{background:${C.accent};color:${C.navy};transform:scale(1.15);}
.stat-num{font-family:'Orbitron',sans-serif;font-size:2.8rem;color:${C.accent};line-height:1;}
.grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;}
.grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;}
.breadcrumb{display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${C.muted};margin-bottom:2rem;}
.breadcrumb span{color:${C.accent};}
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

// ── tiny router ────────────────────────────────────────────────────────────
const RouterCtx = (typeof window !== "undefined") ? (() => {
  const { createContext } = require !== undefined ? { createContext: (v) => v } : {};
  return null;
})() : null;

// ── shared helpers ─────────────────────────────────────────────────────────
const Stars = ({ n = 80 }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className="star" style={{
        width: Math.random() * 2.5 + 1 + "px", height: Math.random() * 2.5 + 1 + "px",
        top: Math.random() * 100 + "%", left: Math.random() * 100 + "%",
        "--d": Math.random() * 4 + 2 + "s", "--delay": Math.random() * 4 + "s",
        opacity: Math.random() * 0.6 + 0.2,
      }} />
    ))}
  </div>
);

const SocialIcons = () => (
  <div style={{ display: "flex", gap: ".5rem", marginTop: ".8rem" }}>
    {[{ icon: "in", title: "LinkedIn", href: "#" }, { icon: "f", title: "Facebook", href: "#" }, { icon: "W", title: "WhatsApp", href: "https://wa.me/0750250978" }]
      .map(s => <a key={s.title} className="social-icon" href={s.href} title={s.title}>{s.icon}</a>)}
  </div>
);

const CountUp = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0; const step = target / 60;
        const t = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(start)); }, 20);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className="stat-num">{val.toLocaleString()}{suffix}</span>;
};

const PageHero = ({ title, sub, navigate }) => (
  <div style={{ background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${C.mid}88 0%, ${C.navy} 70%)`, padding: "140px 5% 60px", position: "relative", overflow: "hidden" }}>
    <Stars n={60} />
    <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
      <div className="breadcrumb">
        <button className="nav-link" onClick={() => navigate("home")} style={{ color: C.muted }}>Home</button>
        <span>/</span>
        <span>{title}</span>
      </div>
      <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1, marginBottom: ".8rem" }}>
        {title.split(" ").map((w, i) => <span key={i} style={{ color: i === title.split(" ").length - 1 ? C.accent : C.white }}>{w} </span>)}
      </h1>
      {sub && <p style={{ color: C.muted, fontSize: "1rem", maxWidth: 520 }}>{sub}</p>}
    </div>
  </div>
);

// ── NAV ────────────────────────────────────────────────────────────────────
const PAGES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "team", label: "Team" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "programs", label: "Programs" },
  { id: "services", label: "Services" },
  { id: "clubs", label: "Clubs" },
  { id: "contact", label: "Contact" },
];

function Nav({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: ".85rem 5%",
        background: scrolled ? C.navy + "f0" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.accent}22` : "none",
        transition: "all .3s",
      }}>
        {/* Logo */}
        <button onClick={() => navigate("home")} style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.2rem", color: C.accent, letterSpacing: ".1em", background: "none", border: "none", cursor: "pointer" }}>
          SKY<span style={{ color: C.gold }}>LAB</span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "1.6rem", alignItems: "center" }}>
          {PAGES.map(p => (
            <button key={p.id} className={`nav-link ${page === p.id ? "active" : ""}`} onClick={() => { navigate(p.id); setMenuOpen(false); }}>
              {p.label}
            </button>
          ))}
          <button className="btn btn-primary" onClick={() => navigate("contact")} style={{ padding: ".45rem 1.1rem", fontSize: ".8rem" }}>
            Enroll Now
          </button>
        </div>
      </nav>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ══════════════════════════════════════════════════════════════════════════
function PageHome({ navigate }) {
  return (
    <div className="page-wrap">
      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse 80% 60% at 60% 40%, ${C.mid}88 0%, ${C.navy} 70%)`,
        padding: "0 5%",
      }}>
        <Stars n={140} />
        {[220, 350, 500].map((r, i) => (
          <div key={i} style={{
            position: "absolute", right: "6%", top: "50%",
            width: r, height: r, border: `1px solid ${C.accent}${14 + i * 8}`,
            borderRadius: "50%", transform: "translateY(-50%)",
            animation: `spin ${20 + i * 12}s linear infinite`,
          }} />
        ))}
        <div style={{
          position: "absolute", right: "11%", top: "50%", transform: "translateY(-50%)",
          width: 170, height: 170, borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${C.accent}cc, ${C.mid})`,
          boxShadow: `0 0 70px ${C.accent}55`, animation: "float 6s ease-in-out infinite",
        }} />

        <div style={{ maxWidth: 700, position: "relative", zIndex: 2, paddingTop: "6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1.2rem" }}>
            <div style={{ width: 32, height: 2, background: C.accent }} />
            <span style={{ fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: C.accent }}>Sri Lanka's Future-Ready STEM Academy</span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2.4rem,6vw,4.5rem)", lineHeight: 1.1, marginBottom: "1.4rem" }}>
            Not Memorization.<br />
            <span style={{ background: `linear-gradient(90deg,${C.accent},${C.gold},${C.green})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>
              Hands-On Problem Solving.
            </span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: C.muted, lineHeight: 1.8, marginBottom: "2rem", maxWidth: 560 }}>
            We bring the advanced STEM exposure found in Colombo's elite schools straight to every student — village to city. Affordable. Equitable. Accessible.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2.2rem" }}>
            {["Critical Thinking","Creativity","Collaboration","Communication","Computational Thinking"].map(c => <span key={c} className="tag">{c}</span>)}
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => navigate("programs")}>🚀 Explore Programs</button>
            <button className="btn btn-outline" onClick={() => navigate("about")}>Learn More</button>
          </div>
          <div style={{ display: "flex", gap: "3rem", marginTop: "4rem", flexWrap: "wrap" }}>
            {[{ num: 240, suffix: "+", label: "Students Trained" }, { num: 80, suffix: "+", label: "Projects Built" }, { num: 3, suffix: "", label: "Expert Educators" }, { num: 7, suffix: "+", label: "STEM Clubs" }].map(s => (
              <div key={s.label}>
                <CountUp target={s.num} suffix={s.suffix} />
                <div style={{ fontSize: ".8rem", color: C.muted, marginTop: ".2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK NAV CARDS */}
      <section style={{ padding: "80px 5%", background: `linear-gradient(180deg,${C.navy},${C.deep})` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label">Explore SkyLab</div>
            <h2 className="section-title">Where Do You Want to <span style={{ color: C.accent }}>Go?</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
            {[
              { icon: "🏫", label: "About Us", page: "about", color: C.accent },
              { icon: "👥", label: "Our Team", page: "team", color: C.green },
              { icon: "⛰️", label: "Ecosystem", page: "ecosystem", color: C.gold },
              { icon: "🎓", label: "Programs", page: "programs", color: C.coral },
              { icon: "🏆", label: "Services", page: "services", color: "#c084fc" },
              { icon: "🌐", label: "Clubs", page: "clubs", color: "#86efac" },
              { icon: "📞", label: "Contact", page: "contact", color: C.accent },
            ].map(item => (
              <div key={item.label} className="card" onClick={() => navigate(item.page)}
                style={{ textAlign: "center", cursor: "pointer", borderColor: `${item.color}33` }}>
                <div style={{ fontSize: "2.2rem", marginBottom: ".6rem" }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: item.color, fontSize: ".9rem" }}>{item.label}</div>
                <div style={{ fontSize: ".72rem", color: C.muted, marginTop: ".3rem" }}>Explore →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS PREVIEW */}
      <section style={{ padding: "60px 5% 80px", background: C.deep }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What They <span style={{ color: C.accent }}>Say</span></h2>
          <div className="grid-3" style={{ marginTop: "2.5rem" }}>
            {[
              { name: "Fathima Rizna", role: "Student, Grade 9", text: "SkyLab changed how I think. Building a real robot was something I never imagined I'd do!" },
              { name: "Mohamed Farhan", role: "Parent of Grade 7 student", text: "My son loves every Saturday class. He's become more curious and independent." },
              { name: "Dilshan Fernando", role: "Parent of Grade 9 student", text: "My daughter built her first website at 14. That's the SkyLab effect." },
            ].map((f, i) => (
              <div key={i} className="card">
                <div style={{ color: C.gold, marginBottom: ".6rem" }}>★★★★★</div>
                <p style={{ fontSize: ".85rem", color: C.white, lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>"{f.text}"</p>
                <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{f.name}</div>
                <div style={{ fontSize: ".73rem", color: C.muted }}>{f.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: ABOUT
// ══════════════════════════════════════════════════════════════════════════
function PageAbout({ navigate }) {
  const cards = [
    { icon: "🔬", title: "Project-Based Learning", desc: "Students build real projects. Mistakes are the curriculum." },
    { icon: "🌍", title: "Bridging the Gap", desc: "From rural villages to metro cities — every child deserves world-class STEM." },
    { icon: "💡", title: "Think. Debug. Innovate.", desc: "We encourage analytical thinking, creative problem-solving, and bold innovation." },
    { icon: "🎯", title: "Job-Market Ready", desc: "Industry-aligned skills that prepare students for careers of tomorrow." },
  ];
  return (
    <div className="page-wrap">
      <PageHero title="About SkyLab" sub="A STEM Academy built on curiosity, creativity, and hands-on problem solving." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", marginBottom: "5rem" }}>
            <div>
              <div className="section-label">What is SkyLab?</div>
              <h2 className="section-title">Redefining <span style={{ color: C.accent }}>STEM Education</span></h2>
              <p className="section-sub" style={{ marginBottom: "1.4rem" }}>
                SkyLab is a STEM Academy powered by Project-Based Learning (PBL) — the opposite of rote education. Students explore, build, fail, fix, and launch. Every program is a launchpad.
              </p>
              <p className="section-sub">
                We believe every child — regardless of their zip code — has the potential to become an engineer, scientist, or innovator. Our mission is to make that transformation accessible to all.
              </p>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <button className="btn btn-primary" onClick={() => navigate("programs")}>View Programs →</button>
                <button className="btn btn-outline" onClick={() => navigate("team")}>Meet the Team</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {cards.map((c, i) => (
                <div key={i} className="card">
                  <div style={{ fontSize: "2.2rem", marginBottom: ".8rem" }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: ".4rem" }}>{c.title}</div>
                  <div style={{ fontSize: ".82rem", color: C.muted, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div style={{ padding: "3rem", borderRadius: 20, background: `linear-gradient(135deg,${C.mid}66,${C.deep})`, border: `1px solid ${C.accent}33`, textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌟</div>
            <div className="section-label" style={{ textAlign: "center" }}>Our Vision</div>
            <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", color: C.accent, marginBottom: "1rem" }}>
              "Rural Villages → Global Innovators"
            </h3>
            <p style={{ color: C.muted, maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
              Students in rural villages should have the same advanced STEM exposure as those in Colombo's top schools. SkyLab makes that vision a reality — making advanced education affordable, equitable and accessible to everyone.
            </p>
          </div>

          {/* Who We Are */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-label">Our Identity</div>
            <h2 className="section-title">Who <span style={{ color: C.accent }}>We Are</span></h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            {[
              { icon: "🛸", label: "STEM Educators", desc: "Certified educators with real-world experience in science, tech, engineering & math." },
              { icon: "🔭", label: "Astronomers & Engineers", desc: "Passionate professionals guiding students through physics, coding, robotics and beyond." },
              { icon: "🌱", label: "Community Builders", desc: "We build clubs, networks, and learning ecosystems that outlast any single course." },
            ].map((w, i) => (
              <div key={i} className="card" style={{ maxWidth: 300, textAlign: "left" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: ".7rem" }}>{w.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: ".4rem" }}>{w.label}</div>
                <div style={{ fontSize: ".82rem", color: C.muted, lineHeight: 1.6 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: TEAM
// ══════════════════════════════════════════════════════════════════════════
const TEAM = [
  { name: "Abdullah Mohamed Aathil", role: "Founder & STEM Educator", bg: `linear-gradient(135deg,${C.accent}55,${C.mid})`, emoji: "🔭", bio: "Former Demonstrator, University of Jaffna · BSc Special in Physics · Diploma in Astronomy", expertise: ["STEM Teaching","Physics","Astronomy","Robotics","Electronics","Electrical","Data Analysis","Tinkering"] },
  { name: "Ana. Al Iman", role: "IT Expert & Co-Founder", bg: `linear-gradient(135deg,${C.green}55,${C.mid})`, emoji: "💻", bio: "Founder of iSoft · Freelancer · BSc Computing & Information Systems, Sabaragamuwa University", expertise: ["STEM Teaching","Programming","Computer Hardware","Web Development","Computer Literacy","Content Creation","Digital Marketing"] },
  { name: "BM. Arafath", role: "Science Educator & Co-Founder", bg: `linear-gradient(135deg,${C.gold}55,${C.mid})`, emoji: "🌊", bio: "Founder of Blue Eco Minds · BTech in Aquaculture, Ocean University of Sri Lanka", expertise: ["STEM Teaching","Nature","Environmental Science","Agriculture","Aquaculture","Tinkering"] },
];

function PageTeam({ navigate }) {
  return (
    <div className="page-wrap">
      <PageHero title="Our Team" sub="The passionate educators and innovators behind SkyLab's mission." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-3" style={{ marginBottom: "5rem" }}>
            {TEAM.map((p, idx) => (
              <div key={idx} className="card" style={{ textAlign: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", margin: "0 auto 1.2rem", border: `2px solid ${C.accent}44`, boxShadow: `0 0 30px ${C.accent}22` }}>
                  {p.emoji}
                </div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: ".95rem", marginBottom: ".3rem" }}>{p.name}</div>
                <div style={{ color: C.accent, fontSize: ".78rem", marginBottom: ".7rem" }}>{p.role}</div>
                <div style={{ fontSize: ".78rem", color: C.muted, lineHeight: 1.7, marginBottom: "1rem" }}>{p.bio}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", justifyContent: "center", marginBottom: "1rem" }}>
                  {p.expertise.map(e => <span key={e} className="tag" style={{ fontSize: ".65rem" }}>{e}</span>)}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}><SocialIcons /></div>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div style={{ textAlign: "center", padding: "3rem", background: `linear-gradient(135deg,${C.mid}55,${C.deep})`, borderRadius: 20, border: `1px solid ${C.accent}33` }}>
            <div style={{ fontSize: "2rem", marginBottom: ".8rem" }}>🤝</div>
            <h3 style={{ fontFamily: "'Orbitron',sans-serif", color: C.accent, marginBottom: ".8rem" }}>Want to Join Our Team?</h3>
            <p style={{ color: C.muted, marginBottom: "1.5rem" }}>We're always looking for passionate STEM educators to join our mission.</p>
            <a href="https://wa.me/0750250978" className="btn btn-primary">📲 Contact Us on WhatsApp</a>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: ECOSYSTEM
// ══════════════════════════════════════════════════════════════════════════
function PageEcosystem({ navigate }) {
  const [active, setActive] = useState(null);
  const levels = [
    { icon: "🔥", label: "Bootcamp", sub: "Ignite the Passion to Learn", color: C.coral, y: 320, desc: "A one-month spark session to discover STEM. Students try coding, circuits, astronomy, robotics and more. The flame starts here." },
    { icon: "🧭", label: "Foundation", sub: "Explore Every Area", color: C.gold, y: 240, desc: "4 months of deep exploration across 5 thematic projects (Nemo, Wild Robot, WALL-E, Luna, Flash). Find what excites you." },
    { icon: "🛠️", label: "Build", sub: "Find & Develop Your Skills", color: C.green, y: 160, desc: "6 months to master your chosen STEM field. Go from curious student to junior-level practitioner with a real portfolio." },
    { icon: "🚀", label: "Expert", sub: "Job Market Ready", color: C.accent, y: 80, desc: "8 months of advanced training, mentorship, competitions, and industry networks. Graduate career-ready with a full portfolio." },
  ];
  return (
    <div className="page-wrap">
      <PageHero title="Our Ecosystem" sub="A mountain you climb — one level at a time. Each step unlocks new skills and opportunities." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Mountain */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <svg viewBox="0 0 700 420" style={{ width: "100%", maxWidth: 620, filter: "drop-shadow(0 0 40px #00d4ff18)" }}>
              <defs>
                <linearGradient id="mtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={C.mid} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <polygon points="350,28 640,400 60,400" fill="url(#mtGrad)" stroke={`${C.accent}33`} strokeWidth="1.5" />
              <polygon points="350,28 420,110 280,110" fill={`${C.white}18`} />
              {levels.map((lv, i) => {
                const isActive = active === i;
                return (
                  <g key={i} style={{ cursor: "pointer" }} onClick={() => setActive(active === i ? null : i)}>
                    <circle cx={350} cy={lv.y} r={isActive ? 26 : 18} fill={lv.color} stroke={C.navy} strokeWidth="3"
                      style={{ filter: isActive ? `drop-shadow(0 0 14px ${lv.color})` : "none", transition: "all .3s" }} />
                    <text x={350} y={lv.y + 5} textAnchor="middle" fontSize="13" fill={C.navy} fontWeight="bold">{i + 1}</text>
                    <text x={390} y={lv.y - 4} fontSize="13" fill={lv.color} fontWeight="700">{lv.label}</text>
                    <text x={390} y={lv.y + 12} fontSize="10" fill={C.muted}>{lv.sub}</text>
                    {i < levels.length - 1 && <line x1={350} y1={lv.y - 18} x2={350} y2={levels[i + 1].y + 18} stroke={`${lv.color}55`} strokeWidth="2" strokeDasharray="4,4" />}
                  </g>
                );
              })}
              <g style={{ animation: "bounce 2s ease-in-out infinite", transformOrigin: "350px 380px" }}>
                <text x="338" y="392" fontSize="24">🧗</text>
              </g>
            </svg>
          </div>

          {/* Level cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
            {levels.map((lv, i) => (
              <div key={i} className="card" onClick={() => setActive(active === i ? null : i)}
                style={{ cursor: "pointer", borderColor: active === i ? lv.color : `${C.accent}22`, boxShadow: active === i ? `0 0 24px ${lv.color}44` : "none", transition: "all .3s" }}>
                <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>{lv.icon}</div>
                <div style={{ fontWeight: 700, color: lv.color, marginBottom: ".3rem" }}>
                  {i + 1}. {lv.label}
                </div>
                <div style={{ fontSize: ".75rem", color: C.muted, marginBottom: ".6rem" }}>{lv.sub}</div>
                {active === i && <div style={{ fontSize: ".8rem", color: C.white, lineHeight: 1.7, borderTop: `1px solid ${lv.color}44`, paddingTop: ".7rem" }}>{lv.desc}</div>}
                {active !== i && <div style={{ fontSize: ".72rem", color: lv.color }}>Click to explore →</div>}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button className="btn btn-primary" onClick={() => navigate("programs")}>🎓 See All Programs</button>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: PROGRAMS
// ══════════════════════════════════════════════════════════════════════════
const PROGRAMS = {
  Bootcamp: { price: "LKR 2,000", duration: "1 Month", color: C.coral,
    items: [
      { name: "Junior Software Engineering", icon: "💻", deliverables: ["Mini App","HTML/CSS Page","Logic Game"] },
      { name: "Junior Astronomy", icon: "🔭", deliverables: ["Star Chart","Observation Log","Constellation Map"] },
      { name: "Junior Electrical Engineering", icon: "⚡", deliverables: ["LED Circuit","Simple Alarm","Breadboard Project"] },
      { name: "Robotics Bootcamp", icon: "🤖", deliverables: ["Line-Follower Bot","Sensor Project","Code Walkthrough"] },
      { name: "Content Creation", icon: "🎬", deliverables: ["Video Edit","Thumbnail Design","Mini Blog"] },
      { name: "Junior Aerospace", icon: "🚀", deliverables: ["Paper Rocket","Flight Log","Aerodynamics Poster"] },
      { name: "Junior Game Developers", icon: "🎮", deliverables: ["Scratch Game","Level Design Doc","Playtest Report"] },
    ]},
  Foundation: { price: "LKR 12,000", duration: "4 Months", color: C.gold,
    items: [
      { name: "Project Nemo", icon: "🐟", deliverables: ["Marine Report","Aqua Model","Eco Presentation"] },
      { name: "Project Wild Robot", icon: "🤖", deliverables: ["Autonomous Bot","Circuit Diagram","Code Portfolio"] },
      { name: "Project WALL-E", icon: "♻️", deliverables: ["Waste-Bot","Engineering Notebook","Demo Video"] },
      { name: "Project Luna", icon: "🌙", deliverables: ["Moon Model","Phase Log","Astronomy Report"] },
      { name: "Project Flash", icon: "⚡", deliverables: ["Speed Experiment","Data Charts","Science Fair Poster"] },
    ]},
  Build: { price: "LKR 30,000", duration: "6 Months", color: C.green,
    items: [
      { name: "Amateur Software Engineer", icon: "💻", deliverables: ["Full-Stack App","GitHub Portfolio","Tech Blog"] },
      { name: "Amateur Astronomer", icon: "🔭", deliverables: ["Research Paper","Observation Database","Astrophoto"] },
      { name: "Amateur Electrical Engineer", icon: "⚡", deliverables: ["PCB Design","Working Prototype","Technical Report"] },
      { name: "Amateur Robotics Engineer", icon: "🤖", deliverables: ["Autonomous Robot","ROS Intro","Competition Entry"] },
      { name: "Amateur Content Creator", icon: "🎬", deliverables: ["YouTube Channel","Brand Kit","Analytics Report"] },
      { name: "Amateur Aerospace Engineer", icon: "🚀", deliverables: ["Model Rocket","Flight Data","Safety Report"] },
      { name: "Amateur Game Developer", icon: "🎮", deliverables: ["Playable Game","Design Document","Itch.io Profile"] },
    ]},
  Expert: { price: "LKR 56,000", duration: "8 Months", color: C.accent,
    items: [
      { name: "Expert Software Engineer", icon: "💻", deliverables: ["SaaS Product","Open Source Contribution","LinkedIn Profile"] },
      { name: "Expert Astronomer", icon: "🔭", deliverables: ["Published Article","Conference Poster","Equipment Skills"] },
      { name: "Expert Electrical Engineer", icon: "⚡", deliverables: ["Smart Device","Hackathon Win","Patent Draft"] },
      { name: "Expert Robotics Engineer", icon: "🤖", deliverables: ["Competition Robot","Research Paper","Industry Network"] },
      { name: "Expert Content Creator", icon: "🎬", deliverables: ["Monetized Channel","Brand Deals","Digital Agency"] },
      { name: "Expert Aerospace Engineer", icon: "🚀", deliverables: ["High-Power Rocket","Simulation Report","Internship"] },
      { name: "Expert Game Developer", icon: "🎮", deliverables: ["Published Game","Press Kit","Studio Network"] },
    ]},
};

function PagePrograms({ navigate }) {
  const tabs = Object.keys(PROGRAMS);
  const [tab, setTab] = useState("Bootcamp");
  const [sel, setSel] = useState(0);
  const prog = PROGRAMS[tab];
  return (
    <div className="page-wrap">
      <PageHero title="Our Programs" sub="Four tiers designed to take every student from curious beginner to industry-ready expert." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Tier tabs */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button key={t} className="btn" onClick={() => { setTab(t); setSel(0); }}
                style={{ background: tab === t ? PROGRAMS[t].color : "transparent", color: tab === t ? C.navy : PROGRAMS[t].color, border: `1.5px solid ${PROGRAMS[t].color}` }}>
                {t}
              </button>
            ))}
          </div>

          {/* Info bar */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem", padding: "1rem 2rem", borderRadius: 12, background: `${prog.color}18`, border: `1px solid ${prog.color}44` }}>
            {[["💰", prog.price], ["📅", prog.duration], ["⏰", "Weekly · 2hrs · Flexible"], ["🎯", "Personalized Mentorship"]].map(([ic, v]) => (
              <div key={v} style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".88rem" }}>
                <span>{ic}</span><span style={{ color: prog.color, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Program blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(145px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {prog.items.map((item, i) => (
              <div key={i} className="card" onClick={() => setSel(i)} style={{ cursor: "pointer", textAlign: "center", borderColor: sel === i ? prog.color : `${C.accent}22`, boxShadow: sel === i ? `0 0 18px ${prog.color}44` : "none" }}>
                <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>{item.icon}</div>
                <div style={{ fontSize: ".8rem", fontWeight: 600, lineHeight: 1.4 }}>{item.name}</div>
              </div>
            ))}
          </div>

          {/* Deliverables panel */}
          {prog.items[sel] && (
            <div style={{ padding: "1.5rem 2rem", borderRadius: 16, background: `linear-gradient(135deg,${prog.color}18,${C.mid}44)`, border: `1px solid ${prog.color}55` }}>
              <div style={{ fontWeight: 700, marginBottom: ".8rem", color: prog.color }}>
                {prog.items[sel].icon} {prog.items[sel].name} — What You'll Build
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                {prog.items[sel].deliverables.map(d => (
                  <span key={d} className="tag" style={{ background: `${prog.color}22`, color: prog.color, borderColor: `${prog.color}55` }}>✓ {d}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button className="btn btn-primary" onClick={() => navigate("contact")}>📲 Enroll Now</button>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: SERVICES
// ══════════════════════════════════════════════════════════════════════════
function PageServices({ navigate }) {
  const sections = [
    { icon: "🎓", title: "Training & Career", color: C.accent, items: ["Personalized Training","Project Portfolio","Industry Endorsement","Hackathon & Olympiad Guidance","Internship Support","Article & Blog Publication","Professional Networking","Student Showcase"] },
    { icon: "🏭", title: "Field Trips", color: C.gold, items: ["Industry Visits","Start-up Tours","Planetarium Trips","University Visits","Arthur C. Clarke Institute","Agriculture Lands","Scuba Diving","Outdoor Learning"] },
    { icon: "🏆", title: "Competitions", color: C.green, items: ["SkyLab Hackathon","Global Competitions","SkyLab-Hosted Events","Science Olympiads"] },
    { icon: "🧠", title: "Student Consultation", color: C.coral, items: ["Career Path Consultation","Personalized Counseling","Progress Tracking","Goal Setting"] },
  ];
  const feedback = [
    { name: "Arun Shankar", role: "Student, Grade 8", text: "The astronomy bootcamp blew my mind. I can now identify stars and even track satellites!", rating: 5 },
    { name: "Zainab Yoosuf", role: "Student, Grade 10", text: "They actually let you make mistakes. That's where I learned the most.", rating: 5 },
    { name: "Priya Nanthakumar", role: "Parent of Grade 8 student", text: "Worth every rupee. The mentors genuinely care about every child's growth.", rating: 5 },
  ];
  return (
    <div className="page-wrap">
      <PageHero title="Student Services" sub="Beyond the classroom — a full ecosystem of support to help every student thrive." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-2" style={{ marginBottom: "4rem" }}>
            {sections.map(s => (
              <div key={s.title} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: "1.2rem" }}>
                  <div style={{ fontSize: "2rem" }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", color: s.color }}>{s.title}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {s.items.map(it => <span key={it} className="tag" style={{ background: `${s.color}15`, color: s.color, borderColor: `${s.color}44`, fontSize: ".7rem" }}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">What Students <span style={{ color: C.accent }}>Say</span></h2>
          </div>
          <div className="grid-3">
            {feedback.map((f, i) => (
              <div key={i} className="card">
                <div style={{ color: C.gold, marginBottom: ".6rem" }}>{"★".repeat(f.rating)}</div>
                <p style={{ fontSize: ".85rem", color: C.white, lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>"{f.text}"</p>
                <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{f.name}</div>
                <div style={{ fontSize: ".73rem", color: C.muted }}>{f.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: CLUBS
// ══════════════════════════════════════════════════════════════════════════
const CLUBS = [
  { icon: "📚", name: "Readers Club", color: C.accent, desc: "Physical & E-library, debate, communication, content creation, critics.", features: ["Library Access","Debates","Content Creation"] },
  { icon: "💡", name: "Innovators Club", color: C.gold, desc: "Maker space for innovators. Funding and equipment support provided.", features: ["Maker Space","Equipment Help","Funding Guidance"] },
  { icon: "🤖", name: "Robotics Club", color: C.green, desc: "Build, program, and compete. Maker space with full equipment access.", features: ["Maker Space","Competition Prep","Mentorship"] },
  { icon: "🔭", name: "Astro Club", color: "#c084fc", desc: "Telescopes, observation logs, star gazing nights and sky tours.", features: ["Equipment Access","Observation Logs","Night Sky Events"] },
  { icon: "✈️", name: "Aerospace Club", color: C.coral, desc: "Model rockets, gliders, drones — from concept to launch.", features: ["Rocket Builds","Maker Space","Launch Events"] },
  { icon: "🌱", name: "Agro Club", color: "#86efac", desc: "Seeds, soil, sustainability. Learn agriculture from root to table.", features: ["Seeds Provided","Field Learning","Sustainability"] },
];

function PageClubs({ navigate }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="page-wrap">
      <PageHero title="Student Clubs" sub="Join a club. Lead one. Build lasting networks and real skills together." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-3" style={{ marginBottom: "4rem" }}>
            {CLUBS.map((c, i) => (
              <div key={i} className="card" onClick={() => setSel(sel === i ? null : i)}
                style={{ cursor: "pointer", borderLeft: `3px solid ${c.color}`, borderColor: sel === i ? c.color : undefined, boxShadow: sel === i ? `0 0 20px ${c.color}33` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".8rem" }}>
                  <div style={{ fontSize: "1.8rem" }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, color: c.color }}>{c.name}</div>
                </div>
                <p style={{ fontSize: ".8rem", color: C.muted, lineHeight: 1.6, marginBottom: ".8rem" }}>{c.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: ".8rem" }}>
                  {c.features.map(f => <span key={f} className="tag" style={{ fontSize: ".65rem", background: `${c.color}18`, color: c.color, borderColor: `${c.color}44` }}>{f}</span>)}
                </div>
                {sel === i && (
                  <div style={{ borderTop: `1px solid ${c.color}33`, paddingTop: ".8rem", marginTop: ".4rem" }}>
                    <div style={{ fontSize: ".75rem", color: C.muted, marginBottom: ".6rem" }}>
                      <strong style={{ color: c.color }}>Club Body:</strong> President · Vice President · Secretary · Vice Secretary · Treasurer · Membership Coordinator · Volunteers
                    </div>
                  </div>
                )}
                <a href="https://wa.me/0750250978" target="_blank" rel="noreferrer"
                  className="btn btn-outline" onClick={e => e.stopPropagation()}
                  style={{ fontSize: ".75rem", padding: ".4rem 1rem", borderColor: c.color, color: c.color, marginTop: ".4rem" }}>
                  📲 Join via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ══════════════════════════════════════════════════════════════════════════
function PageContact({ navigate }) {
  const contacts = [
    { icon: "💬", label: "WhatsApp", value: "075 025 0978", href: "https://wa.me/0750250978", color: "#25d366" },
    { icon: "📞", label: "Call Us", value: "075 025 0978", href: "tel:0750250978", color: C.accent },
    { icon: "📘", label: "Facebook", value: "SkyLab STEM Academy", href: "#", color: "#1877f2" },
    { icon: "📸", label: "Instagram", value: "@skylab_stem", href: "#", color: "#e1306c" },
    { icon: "✉️", label: "Email", value: "info@skylab.lk", href: "mailto:info@skylab.lk", color: C.gold },
  ];
  return (
    <div className="page-wrap">
      <PageHero title="Contact Us" sub="Have questions? Want to enroll? We'd love to hear from you." navigate={navigate} />
      <section className="section" style={{ background: C.navy }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", justifyContent: "center", marginBottom: "4rem" }}>
            {contacts.map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", minWidth: 140, borderColor: `${c.color}44`, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem" }}>{c.icon}</div>
                  <div style={{ color: c.color, fontWeight: 700 }}>{c.label}</div>
                  <div style={{ fontSize: ".75rem", color: C.muted }}>{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Enroll CTA */}
          <div style={{ textAlign: "center", padding: "3rem", background: `linear-gradient(135deg,${C.mid}66,${C.deep})`, borderRadius: 24, border: `1px solid ${C.accent}44` }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚀</div>
            <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.6rem", color: C.accent, marginBottom: "1rem" }}>Ready to Launch Your Journey?</h3>
            <p style={{ color: C.muted, maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.8 }}>
              Contact us on WhatsApp to enroll in any program, join a club, or ask any question. We respond fast!
            </p>
            <a href="https://wa.me/0750250978" className="btn btn-primary" style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>
              📲 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════════════════
function Footer({ navigate }) {
  return (
    <footer style={{ padding: "3rem 5% 2rem", background: `linear-gradient(180deg,${C.deep},#050a1a)`, borderTop: `1px solid ${C.accent}22` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <button onClick={() => navigate("home")} style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", color: C.accent, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            SKY<span style={{ color: C.gold }}>LAB</span>
          </button>
          <div style={{ fontSize: ".8rem", color: C.muted, maxWidth: 240, lineHeight: 1.6, marginTop: ".5rem" }}>
            Making advanced STEM education affordable, equitable, and accessible to every student in Sri Lanka.
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: ".8rem", fontSize: ".85rem" }}>Quick Links</div>
          {PAGES.map(p => (
            <div key={p.id} style={{ marginBottom: ".3rem" }}>
              <button className="nav-link" onClick={() => navigate(p.id)} style={{ fontSize: ".8rem" }}>{p.label}</button>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: ".8rem", fontSize: ".85rem" }}>Contact</div>
          <div style={{ fontSize: ".8rem", color: C.muted, lineHeight: 2.2 }}>
            📞 075 025 0978<br />💬 WhatsApp: 075 025 0978<br />✉️ info@skylab.lk
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.accent}18`, paddingTop: "1.2rem", textAlign: "center", fontSize: ".75rem", color: C.muted }}>
        © 2025 SkyLab STEM Academy, Sri Lanka. All rights reserved. · Bridging the STEM Gap 🚀
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AI CHATBOT
// ══════════════════════════════════════════════════════════════════════════
function AIAssistant({ navigate }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "👋 Hi! I'm SkyBot. Ask me about programs, fees, clubs, or how to enroll!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are SkyBot, the friendly AI assistant for SkyLab STEM Academy in Sri Lanka. SkyLab offers project-based STEM education. Programs: Bootcamp (1 month, LKR 2000), Foundation (4 months, LKR 12000), Build (6 months, LKR 30000), Expert (8 months, LKR 56000). All weekly, 2 hours, flexible timing. Contact: WhatsApp 0750250978. Vision: affordable, equitable STEM for all — bridging rural and urban Sri Lanka. Be warm, enthusiastic, concise.`,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Please contact us on WhatsApp: 0750250978 😊" }]);
    } catch { setMsgs(prev => [...prev, { role: "assistant", content: "Oops! Contact us: WhatsApp 0750250978 😊" }]); }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000, width: 60, height: 60, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${C.accent},${C.green})`, fontSize: "1.6rem", cursor: "pointer", boxShadow: `0 8px 28px ${C.accent}66`, animation: open ? "none" : "pulse 2s infinite" }}>
        {open ? "✕" : "🤖"}
      </button>
      {open && (
        <div style={{ position: "fixed", bottom: "5.5rem", right: "2rem", zIndex: 999, width: 340, maxWidth: "90vw", height: 480, background: C.deep, border: `1px solid ${C.accent}44`, borderRadius: 20, display: "flex", flexDirection: "column", boxShadow: `0 20px 60px #00000066`, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.2rem", background: `linear-gradient(135deg,${C.mid},${C.deep})`, borderBottom: `1px solid ${C.accent}33` }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: ".9rem", color: C.accent }}>🤖 SkyBot</div>
            <div style={{ fontSize: ".72rem", color: C.muted }}>SkyLab AI Assistant</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", padding: ".7rem 1rem", borderRadius: 14, background: m.role === "user" ? `linear-gradient(135deg,${C.accent},${C.green})` : `${C.mid}cc`, color: m.role === "user" ? C.navy : C.white, fontSize: ".82rem", lineHeight: 1.6 }}>
                {m.content}
              </div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", padding: ".7rem 1rem", borderRadius: 14, background: `${C.mid}cc`, fontSize: ".8rem", color: C.muted }}>Thinking…</div>}
            <div ref={endRef} />
          </div>
          <div style={{ padding: ".8rem", borderTop: `1px solid ${C.accent}22`, display: "flex", gap: ".5rem" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about programs…"
              style={{ flex: 1, background: `${C.mid}66`, border: `1px solid ${C.accent}33`, borderRadius: 10, padding: ".55rem .9rem", color: C.white, fontSize: ".82rem", outline: "none" }} />
            <button onClick={send} disabled={loading} style={{ background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: 10, padding: ".55rem .9rem", color: C.navy, fontWeight: 700, cursor: "pointer" }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP — ROUTER
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home":       return <PageHome navigate={navigate} />;
      case "about":      return <PageAbout navigate={navigate} />;
      case "team":       return <PageTeam navigate={navigate} />;
      case "ecosystem":  return <PageEcosystem navigate={navigate} />;
      case "programs":   return <PagePrograms navigate={navigate} />;
      case "services":   return <PageServices navigate={navigate} />;
      case "clubs":      return <PageClubs navigate={navigate} />;
      case "contact":    return <PageContact navigate={navigate} />;
      default:           return <PageHome navigate={navigate} />;
    }
  };

  return (
    <>
      <Nav page={page} navigate={navigate} />
      <div key={page}>{renderPage()}</div>
      <AIAssistant navigate={navigate} />
    </>
  );
}
