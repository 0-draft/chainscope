import { AnimatePresence, motion } from "motion/react";
import { type CSSProperties, Fragment, useCallback, useEffect, useState } from "react";
import { brands, stageAccents, stageBrands, stageCmds, stageIcons } from "../lib/brands";
import { type Incident, incidents } from "../lib/incidents";
import { type Stage, stages } from "../lib/stages";

type Slide =
  | { kind: "title" }
  | { kind: "premise" }
  | { kind: "pipeline" }
  | { kind: "stage-intro"; idx: number }
  | { kind: "stage-attack"; idx: number }
  | { kind: "stage-defense"; idx: number }
  | { kind: "recap" };

const slides: Slide[] = [
  { kind: "title" },
  { kind: "premise" },
  { kind: "pipeline" },
  ...incidents.flatMap((_, idx) => [
    { kind: "stage-intro" as const, idx },
    { kind: "stage-attack" as const, idx },
    { kind: "stage-defense" as const, idx },
  ]),
  { kind: "recap" },
];

export default function Deck() {
  const [step, setStep] = useState(0);

  const advance = useCallback(() => {
    setStep((s) => Math.min(s + 1, slides.length - 1));
  }, []);
  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);
  const restart = useCallback(() => {
    setStep(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        back();
      } else if (e.key === "r" || e.key === "R") {
        restart();
      } else if (e.key === "Home") {
        e.preventDefault();
        setStep(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setStep(slides.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back, restart]);

  const slide = slides[step];

  return (
    <div className="deck">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="deck-stage"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <SlideView slide={slide} />
        </motion.div>
      </AnimatePresence>

      <div className="hud">
        <span className="hud-brand">
          <LogoMark className="hud-logo" />
          chainscope
        </span>
        <span className="hud-sep">·</span>
        <span className="hud-pos">
          {String(step + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <span className="hud-sep">·</span>
        <span className="hud-keys">
          <kbd>space</kbd> next <kbd>←</kbd> back <kbd>r</kbd> restart
        </span>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${((step + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SlideView({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "title":
      return <TitleSlide />;
    case "premise":
      return <PremiseSlide />;
    case "pipeline":
      return <PipelineSlide />;
    case "stage-intro":
      return <StageIntroSlide incident={incidents[slide.idx]} />;
    case "stage-attack":
      return <AttackSlide incident={incidents[slide.idx]} />;
    case "stage-defense":
      return <DefenseSlide incident={incidents[slide.idx]} />;
    case "recap":
      return <RecapSlide />;
  }
}

function TitleSlide() {
  return (
    <div className="slide slide-title">
      <LogoMark className="title-logo" />
      <p className="title-mark">chainscope</p>
      <h1 className="title-h">
        the supply chain,
        <br />
        in six surfaces.
      </h1>
      <p className="title-sub">
        a visual explainer.
        <br />
        press <kbd>space</kbd> to advance.
      </p>
    </div>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M6 18 V6 H18" />
        <path d="M46 6 H58 V18" />
        <path d="M58 46 V58 H46" />
        <path d="M18 58 H6 V46" />
      </g>
      <path
        d="M16 24 H48 V40 H16"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx={16} cy={24} r={4} fill="#f05032" />
      <circle cx={32} cy={24} r={4} fill="#cb3837" />
      <circle cx={48} cy={24} r={4} fill="#2088ff" />
      <circle cx={48} cy={40} r={4} fill="#2196f3" />
      <circle cx={32} cy={40} r={4} fill="#2496ed" />
      <circle cx={16} cy={40} r={4} fill="#326ce5" />
    </svg>
  );
}

function PremiseSlide() {
  return (
    <div className="slide slide-premise">
      <p className="kicker">the premise</p>
      <h2 className="lede">
        your code is mostly
        <br />
        <span className="hot">other people's code.</span>
      </h2>
      <ul className="bullets">
        <li>
          <span className="bullet-num">06</span> stages from keyboard to kubelet.
        </li>
        <li>
          <span className="bullet-num">06</span> real attacks (2020 → 2026).
        </li>
        <li>
          <span className="bullet-num">06</span> defenses you can audit today.
        </li>
      </ul>
    </div>
  );
}

function PipelineSlide() {
  return (
    <div className="slide slide-pipeline">
      <p className="kicker">the pipeline</p>
      <h2 className="lede small">every artifact passes through six hands.</h2>
      <PipelineRow activeIdx={-1} />
      <p className="caption">
        own any one of these and you own the artifact.
        <br />
        the user cannot tell the difference by looking.
      </p>
    </div>
  );
}

function StageIntroSlide({ incident }: { incident: Incident }) {
  const idx = stages.findIndex((s) => s.id === incident.stageId);
  return (
    <div className="slide slide-stage-intro">
      <p className="stage-mark">
        <span className="stage-mark-num">{incident.num}</span>
        <span className="stage-mark-sep"> · </span>
        <span className="stage-mark-label">{incident.stageLabel}</span>
      </p>
      <h2 className="question">{incident.question}</h2>
      <PipelineRow activeIdx={idx} />
    </div>
  );
}

function AttackSlide({ incident }: { incident: Incident }) {
  return (
    <div className="slide slide-attack">
      <div className="slot-head">
        <span className="slot-stage">
          {incident.num} · {incident.stageLabel}
        </span>
        <span className="slot-tag tag-attack">attack</span>
      </div>
      <h2 className="slot-name">
        <span className="hot">{incident.attackName}</span>
      </h2>
      <p className="slot-date">{incident.attackDate}</p>
      <Terminal lines={incident.attackArtifact} variant="attack" />
      <p className="slot-blurb">{incident.attackOneLine}</p>
    </div>
  );
}

function DefenseSlide({ incident }: { incident: Incident }) {
  return (
    <div className="slide slide-defense">
      <div className="slot-head">
        <span className="slot-stage">
          {incident.num} · {incident.stageLabel}
        </span>
        <span className="slot-tag tag-defense">defense</span>
      </div>
      <h2 className="slot-name">
        <span className="cool">{incident.defenseName}</span>
      </h2>
      <Terminal lines={incident.defenseArtifact} variant="defense" />
      <p className="slot-blurb">{incident.defenseOneLine}</p>
      <ul className="links">
        {incident.links.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer noopener">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecapSlide() {
  return (
    <div className="slide slide-recap">
      <p className="kicker">recap</p>
      <h2 className="lede small">six surfaces, six anchors, six controls.</h2>
      <table className="recap-table">
        <thead>
          <tr>
            <th>stage</th>
            <th>attack</th>
            <th>defense</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.stageId}>
              <td className="recap-stage">
                {i.num} · {i.stageLabel.toLowerCase()}
              </td>
              <td className="recap-attack">{i.attackName}</td>
              <td className="recap-defense">{i.defenseName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="caption">
        attacker has to defeat all six.
        <br />
        defender keeps any one of them honest.
      </p>
      <p className="caption coda">
        press <kbd>r</kbd> to restart · long-form at <a href="article">/article</a>
      </p>
    </div>
  );
}

function PipelineRow({ activeIdx }: { activeIdx: number }) {
  const tile = (i: number, area: string) => (
    <PipelineTile
      key={`tile-${i}`}
      stage={stages[i]}
      isActive={i === activeIdx}
      isPast={activeIdx >= 0 && i < activeIdx}
      gridArea={area}
    />
  );
  return (
    <div className="pipeline-grid">
      {tile(0, "t1")}
      <Connector dir="h-fwd" active={activeIdx >= 1} gridArea="c12" />
      {tile(1, "t2")}
      <Connector dir="h-fwd" active={activeIdx >= 2} gridArea="c23" />
      {tile(2, "t3")}
      <Connector dir="v-down" active={activeIdx >= 3} gridArea="c34" />
      {tile(3, "t4")}
      <Connector dir="h-rev" active={activeIdx >= 4} gridArea="c45" />
      {tile(4, "t5")}
      <Connector dir="h-rev" active={activeIdx >= 5} gridArea="c56" />
      {tile(5, "t6")}
    </div>
  );
}

function PipelineTile({
  stage,
  isActive,
  isPast,
  gridArea,
}: {
  stage: Stage;
  isActive: boolean;
  isPast: boolean;
  gridArea: string;
}) {
  const accent = stageAccents[stage.id] ?? "#888888";
  const Icon = stageIcons[stage.id];
  const cmd = stageCmds[stage.id] ?? "";
  const ids = stageBrands[stage.id] ?? [];

  return (
    <motion.div
      className={`tile cell-${gridArea}${isActive ? " active" : ""}${isPast ? " past" : ""}`}
      style={{ "--accent": accent } as CSSProperties}
      data-num={stage.num}
      animate={{ y: isActive ? -3 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {Icon && <Icon className="tile-icon" size={26} strokeWidth={1.6} aria-hidden="true" />}
      <div className="tile-head">
        <span className="tile-num">{stage.num}</span>
        <span className="tile-name">{stage.label.toLowerCase()}</span>
      </div>
      <code className="tile-cmd">{cmd}</code>
      <div className="tile-brands">
        {ids.map((id) => {
          const b = brands[id];
          if (!b) return null;
          return (
            <span
              key={id}
              className="brand-chip"
              title={b.name}
              style={
                {
                  "--brand": b.color,
                  "--brand-fg": b.fg ?? "#ffffff",
                } as CSSProperties
              }
            >
              {b.abbr}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

function Connector({
  active,
  dir,
  gridArea,
}: {
  active: boolean;
  dir: "h-fwd" | "h-rev" | "v-down";
  gridArea: string;
}) {
  let dotAnim: Record<string, (string | number)[]>;
  if (dir === "h-fwd") {
    dotAnim = { x: ["-30%", "130%"], opacity: [0, 1, 1, 0] };
  } else if (dir === "h-rev") {
    dotAnim = { x: ["130%", "-30%"], opacity: [0, 1, 1, 0] };
  } else {
    dotAnim = { y: ["-30%", "130%"], opacity: [0, 1, 1, 0] };
  }
  return (
    <div
      className={`connector connector-${dir} cell-${gridArea}${active ? " active" : ""}`}
      aria-hidden="true"
    >
      <span className="connector-line" />
      <motion.span
        className="connector-dot"
        animate={dotAnim}
        transition={{
          duration: 1.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function Terminal({ lines, variant }: { lines: readonly string[]; variant: "attack" | "defense" }) {
  return (
    <pre className={`terminal terminal-${variant}`}>
      {lines.map((line) => (
        <code className="terminal-line" key={line}>
          {line}
        </code>
      ))}
    </pre>
  );
}
