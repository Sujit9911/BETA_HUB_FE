import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import publicAxios from "../../api/publicAxios";
import { useTheme } from "../../context/ThemeContext";

import betaLogo from "../../assets/logo.png";
import collegeLogo from "../../assets/college-logo.png";
import principalPhoto from "../../assets/principal-sachin-sakhare.png";
import swatiPhoto from "../../assets/faculty-swati-deshmukh.png";
import anjaliPhoto from "../../assets/faculty-anjali-bhatlawande.png";
import harshadaPhoto from "../../assets/faculty-harshada-burande.png";
import sampadaPhoto from "../../assets/faculty-sampada-tavse.png";

export default function Landing() {
  const [events, setEvents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [years, setYears] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroText, setHeroText] = useState(0);

  const { theme, toggleTheme } = useTheme();

  const heroMessages = [
    "Learn • Build • Lead • Connect",
    "Explore • Create • Innovate • Inspire",
    "Technical • Cultural • Professional",
    "Students • Alumni • Faculty • Community",
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [eventsRes, alumniRes, yearsRes] = await Promise.all([
          publicAxios.get("/events"),
          publicAxios.get("/alumni"),
          publicAxios.get("/team/years"),
        ]);

        setEvents(eventsRes.data);
        setAlumni(alumniRes.data.slice(0, 6));

        const sortedYears = [...yearsRes.data].sort().reverse();
        setYears(sortedYears);

        if (sortedYears.length > 0) {
          const teamRes = await publicAxios.get(
            `/team/year/${sortedYears[0]}`
          );
          setTeam(teamRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroText((prev) => (prev + 1) % heroMessages.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Events", value: events.length },
    { label: "Team", value: team.length },
    { label: "Alumni", value: alumni.length },
    { label: "Years", value: years.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* =========================
          Navbar
      ========================== */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src={collegeLogo}
              alt="MMCOE"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 transition-transform duration-200 hover:scale-105"
            />

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />

            <img
              src={betaLogo}
              alt="BETA"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 transition-transform duration-200 hover:scale-105"
            />

            <span className="font-bold text-slate-900 dark:text-white ml-1 tracking-tight">
              BETA
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a
              href="#pulse"
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Pulse
            </a>

            <a
              href="#journey"
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Journey
            </a>

            <a
              href="#team"
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Team
            </a>

            <a
              href="#alumni"
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Alumni
            </a>

            <a
              href="#contact"
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-400 hover:scale-105 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <Link
              to="/login"
              className="bg-blue-800 hover:bg-blue-700 hover:-translate-y-0.5 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm shadow-blue-800/20"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* =========================
          Hero
      ========================== */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950" />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-300/20 dark:bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200/20 dark:bg-blue-800/10 blur-3xl rounded-full pointer-events-none" />

        <div className="absolute top-40 -right-20 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-800/10 blur-3xl rounded-full pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.018] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-16 sm:pb-20 text-center">

          <div className="flex items-center justify-center gap-4 mb-6">

            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />

              <img
                src={collegeLogo}
                alt="MMCOE"
                className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-2"
              />
            </div>

            <div className="h-12 w-px bg-slate-300 dark:bg-slate-700" />

            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />

              <img
                src={betaLogo}
                alt="BETA"
                className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-2"
              />
            </div>

          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-[-0.01em] text-slate-950 dark:text-white">
            BETA
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Bench for Electronics and Telecommunication Association
          </p>

          <div className="h-8 mt-5 mb-8 flex items-center justify-center overflow-hidden">
            <p
              key={heroText}
              className="text-blue-700 dark:text-blue-400 font-semibold text-base sm:text-lg animate-[heroFade_0.6s_ease-out]"
            >
              {heroMessages[heroText]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">

            <a
              href="#pulse"
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 hover:-translate-y-1 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-700/20 hover:shadow-xl hover:shadow-blue-700/30"
            >
              Explore BETA
            </a>

            <a
              href="#team"
              className="w-full sm:w-auto border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-300 font-semibold px-7 py-3 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 hover:-translate-y-1 transition-all duration-200"
            >
              Meet the Team
            </a>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">

            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-3 hover:-translate-y-1.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-900/5 dark:hover:shadow-blue-900/10 transition-all duration-300"
              >
                <div className="absolute inset-x-6 top-0 h-px bg-blue-500/0 group-hover:bg-blue-500/60 transition-colors duration-300" />

                <p className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {loading ? "…" : `${s.value}+`}
                </p>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest mt-1">
                  {s.label}
                </p>
              </div>
            ))}

          </div>

          <div className="mt-14 flex justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.35)]" />
          </div>

        </div>
      </section>

      {/* =========================
          Events
      ========================== */}
      <section
        id="pulse"
        className="max-w-6xl mx-auto px-6 py-14 sm:py-16"
      >
        <div className="text-center mb-10">

          <p className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400" />
            What's On
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Events
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Technical, cultural, and workshop events from BETA
          </p>

        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-400">
            No events yet — stay tuned!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-200"
              >

                <div className="h-36 sm:h-32 bg-slate-100 dark:bg-slate-800 overflow-hidden">

                  {event.photos?.[0]?.photoUrl ? (
                    <img
                      src={event.photos[0].photoUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-slate-300 dark:text-slate-700 group-hover:scale-105 transition-transform duration-300">
                      📅
                    </div>
                  )}

                </div>

                <div className="p-4">

                  <span className="inline-block text-[11px] font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full mb-2">
                    {event.category}
                  </span>

                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(event.eventDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                </div>
              </div>
            ))}

          </div>
        )}
      </section>

      {/* =========================
          Faculty
      ========================== */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16 sm:py-20 overflow-hidden">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <p className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400" />
              Guided By
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Institutional Leadership
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
              The mentors and leaders supporting BETA's journey.
            </p>

          </div>

          {/* Principal */}
          <div className="max-w-4xl mx-auto mb-12">

            <div className="group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="grid md:grid-cols-[260px_1fr] items-stretch">

                <div className="h-64 md:h-auto overflow-hidden bg-slate-200 dark:bg-slate-700">

                  <img
                    src={principalPhoto}
                    alt="Dr. Sachin Sakhare"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                </div>

                <div className="p-7 md:p-9 flex flex-col justify-center">

                  <span className="inline-flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400" />
                    Principal
                  </span>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                    Dr. Sachin Sakhare
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                    Institutional leadership and guidance for the BETA community
                    and its students.
                  </p>

                </div>

              </div>
            </div>

          </div>

          {/* Faculty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              {
                name: "Ms. Swati N. Deshmukh",
                role: "Vice Principal (Administration)",
                photo: swatiPhoto,
              },
              {
                name: "Dr. Anjali S. Bhatlawande (Solanke)",
                role: "HOD, E&TC",
                photo: anjaliPhoto,
              },
              {
                name: "Ms. Harshada N. Burande",
                role: "BETA Faculty Coordinator",
                photo: harshadaPhoto,
              },
              {
                name: "Ms. Sampada S. Tavse",
                role: "BETA Faculty Coordinator",
                photo: sampadaPhoto,
              },
            ].map((person) => (
              <div
                key={person.name}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-300"
              >

                <div className="w-2.5 h-2.5 rounded-full bg-blue-700 dark:bg-blue-400 mx-auto mb-3 ring-4 ring-white dark:ring-slate-900" />

                <div className="h-56 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">

                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                </div>

                <div className="min-h-[65px]">

                  <p className="font-semibold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                    {person.name}
                  </p>

                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-1.5">
                    {person.role}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =========================
          About MMCOE
      ========================== */}
      <section className="max-w-4xl mx-auto px-6 py-14 sm:py-16">

        <div className="group bg-gradient-to-br from-blue-800 to-blue-900 dark:from-blue-950 dark:to-slate-900 rounded-3xl p-8 sm:p-10 text-center border border-blue-900/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">

          <img
            src={collegeLogo}
            alt="MMCOE"
            className="h-16 w-16 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/20 group-hover:scale-105 transition-transform duration-300"
          />

          <h2 className="text-2xl font-bold text-white mb-2">
            About MMCOE
          </h2>

          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            BETA operates under the Electronics & Telecommunication department
            at Marathwada Mitra Mandal's College of Engineering, Pune.
          </p>

          <a
            href="https://mmcoe.edu.in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center bg-white text-blue-800 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
          >
            Visit MMCOE Official Site ↗
          </a>

        </div>
      </section>

      {/* =========================
          Journey
      ========================== */}
      {years.length > 0 && (
        <section
          id="journey"
          className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16"
        >

          <div className="max-w-4xl mx-auto px-6">

            <div className="text-center mb-12">

              <p className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-500" />
                Our Story
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                The BETA Journey
              </h2>

            </div>

            <div className="relative pl-8">

              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />

              {years.map((year, i) => (
                <div
                  key={year}
                  className="relative pb-8 last:pb-0 group"
                >

                  <div
                    className={`absolute -left-8 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 transition-transform duration-200 group-hover:scale-125 ${
                      i === 0
                        ? "bg-blue-700"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />

                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                    {year}{" "}
                    {i === 0 && (
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400 ml-1">
                        ● Current
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Core committee active, organizing events and driving BETA
                    forward.
                  </p>

                </div>
              ))}

              <div className="relative group">

                <div className="absolute -left-8 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 bg-amber-500 flex items-center justify-center group-hover:scale-125 transition-transform duration-200" />

                <p className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  2026
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  BETA Digital Hub launches — bringing everything online.
                </p>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* =========================
          Team
      ========================== */}
      <section
        id="team"
        className="max-w-6xl mx-auto px-6 py-14 sm:py-16"
      >

        <div className="text-center mb-10">

          <p className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400" />
            The People
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Meet the Team
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {years[0]
              ? `Core committee, ${years[0]}`
              : "Core committee"}
          </p>

        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : team.length === 0 ? (
          <p className="text-center text-slate-400">
            Team roster coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">

            {team.map((m) => {
              const initials = m.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={m.id}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-center hover:border-blue-300 dark:hover:border-blue-800 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-200"
                >

                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt={m.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 flex items-center justify-center text-base font-bold mx-auto mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      {initials}
                    </div>
                  )}

                  <p className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                    {m.name}
                  </p>

                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-0.5">
                    {m.designation}
                  </p>

                </div>
              );
            })}

          </div>
        )}
      </section>

      {/* =========================
          Alumni
      ========================== */}
      <section
        id="alumni"
        className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-10">

            <p className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-500" />
              Where BETA Goes
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Our Alumni Network
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {loading
                ? ""
                : `${alumni.length}+ graduates, building careers across the industry`}
            </p>

          </div>

          {loading ? (
            <p className="text-center text-slate-400">Loading...</p>
          ) : alumni.length === 0 ? (
            <p className="text-center text-slate-400">
              Alumni network coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">

              {alumni.map((a) => {
                const initials = a.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={a.id}
                    className="group bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-center hover:bg-white dark:hover:bg-slate-900 hover:border hover:border-slate-200 dark:hover:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  >

                    {a.photoUrl ? (
                      <img
                        src={a.photoUrl}
                        alt={a.name}
                        className="w-12 h-12 rounded-full object-cover mx-auto mb-2 group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm font-bold mx-auto mb-2 group-hover:scale-105 transition-transform duration-200">
                        {initials}
                      </div>
                    )}

                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                      {a.name}
                    </p>

                    <p className="text-[11px] text-slate-400 truncate">
                      {a.company || "—"}
                    </p>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* =========================
          Final CTA
      ========================== */}
      <section className="max-w-3xl mx-auto px-6 py-14 sm:py-16 text-center">

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Ready to be part of BETA?
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Log in to access the full BETA Digital Hub — events, templates, and
          more.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center bg-blue-800 hover:bg-blue-700 hover:-translate-y-0.5 text-white font-semibold px-7 sm:px-8 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-800/25"
        >
          Sign in to BETA Hub →
        </Link>

      </section>

      {/* =========================
          Contact
      ========================== */}
      <section
        id="contact"
        className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16"
      >

        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-10">

            <p className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400" />
              Get In Touch
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Connect with BETA
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              Stay connected with BETA MMCOE through our official social
              channels or reach out to us directly.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/beta-mmcoe"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">

                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.3ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 20.45H7.1V8.99H3.54v11.46ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
                </svg>

              </div>

              <div className="text-left min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  LinkedIn
                </p>

                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  BETA MMCOE
                </p>
              </div>

              <span className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-600 transition-colors">
                ↗
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/beta_mmcoe/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">

                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-none stroke-current"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>

              </div>

              <div className="text-left min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Instagram
                </p>

                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  @beta_mmcoe
                </p>
              </div>

              <span className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-600 transition-colors">
                ↗
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:beta@mmcoe.edu.in"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">

                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-none stroke-current"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>

              </div>

              <div className="text-left min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Email
                </p>

                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate">
                  beta@mmcoe.edu.in
                </p>
              </div>

              <span className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-600 transition-colors">
                ↗
              </span>
            </a>

          </div>

        </div>
      </section>

      {/* =========================
          Footer
      ========================== */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">

        <div className="flex items-center justify-center gap-3 mb-3">

          <img
            src={collegeLogo}
            alt="MMCOE"
            className="h-6 w-6 rounded-full object-cover hover:scale-110 transition-transform duration-200"
          />

          <img
            src={betaLogo}
            alt="BETA"
            className="h-6 w-6 rounded-full object-cover hover:scale-110 transition-transform duration-200"
          />

        </div>

        <p className="text-sm text-slate-400 dark:text-slate-600 text-center px-6">
          © 2026 BETA — MMCOE, Pune. Bench for Electronics and Telecommunication
          Association.
        </p>

        <div className="flex items-center justify-center gap-5 mt-4">

          <a
            href="https://www.linkedin.com/in/beta-mmcoe"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
          >
            LinkedIn
          </a>

          <span className="text-slate-300 dark:text-slate-700">
            •
          </span>

          <a
            href="https://www.instagram.com/beta_mmcoe/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
          >
            Instagram
          </a>

          <span className="text-slate-300 dark:text-slate-700">
            •
          </span>

          <a
            href="mailto:beta@mmcoe.edu.in"
            className="text-xs font-medium text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
          >
            Email
          </a>

        </div>

      </footer>

    </div>
  );
}