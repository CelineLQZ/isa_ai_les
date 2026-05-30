const { useEffect, useMemo, useState } = React;

const PALETTES = {
  delft: {
    cream: "#FBF8F1", paper: "#FFFFFF", paper2: "#F0EDE3", line: "#E2DDD0",
    ink: "#1A2540", soft: "#5A6680", faint: "#9AA4BC",
    brand: "#1E5BA8", brandInk: "#FFFFFF", keep: "#2A7D5C", warn: "#B0432F", accent: "#D4A437"
  },
  meadow: {
    cream: "#FFFFFF", paper: "#FAFAF7", paper2: "#F0F0E8", line: "#E2E2D6",
    ink: "#1F2937", soft: "#5B6373", faint: "#9CA3AF",
    brand: "#2F8E49", brandInk: "#FFFFFF", keep: "#2F8E49", warn: "#D84A4A", accent: "#E6A919"
  },
  coral: {
    cream: "#17182E", paper: "#232643", paper2: "#303454", line: "#3B4064",
    ink: "#F5F2EE", soft: "#BFC2DA", faint: "#7E829E",
    brand: "#FF7E70", brandInk: "#2B0D09", keep: "#45D6C0", warn: "#FF6B85", accent: "#FFD166"
  }
};

function Icon({ name, size = 18 }) {
  const paths = {
    House: <><path d="m3 10.5 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></>,
    BookOpen: <><path d="M12 7v14"/><path d="M3 5.5A3.5 3.5 0 0 1 6.5 2H12v19H6.5A3.5 3.5 0 0 0 3 17.5z"/><path d="M21 5.5A3.5 3.5 0 0 0 17.5 2H12v19h5.5a3.5 3.5 0 0 1 3.5-3.5z"/></>,
    Mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></>,
    MicOff: <><path d="m2 2 20 20"/><path d="M9 9v3a3 3 0 0 0 5.1 2.1"/><path d="M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M19 10v2a7 7 0 0 1-.9 3.4"/><path d="M5 10v2a7 7 0 0 0 9.7 6.48"/><path d="M12 19v3"/></>,
    ListChecks: <><path d="m3 7 2 2 4-4"/><path d="M11 7h10"/><path d="m3 17 2 2 4-4"/><path d="M11 17h10"/></>,
    Volume2: <><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></>,
    ChevronRight: <path d="m9 18 6-6-6-6"/>,
    ChevronLeft: <path d="m15 18-6-6 6-6"/>,
    Bookmark: <path d="M6 3h12v18l-6-4-6 4z"/>,
    SquareCheckBig: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/></>,
    Check: <path d="m5 12 5 5L20 7"/>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths[name] || null}
  </svg>;
}

function keyOf(item) {
  return item.key;
}

function flattenLessons() {
  return window.LESSONS.flatMap(lesson =>
    lesson.parts.flatMap(part =>
      part.items.map((item, index) => ({
        ...item,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        partId: part.id,
        partTitle: part.title,
        partLabel: part.label,
        key: `${lesson.id}:${part.id}:${index}:${item.nl}`
      }))
    )
  );
}

function partList() {
  return window.LESSONS.flatMap(lesson =>
    lesson.parts.map(part => ({
      ...part,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      count: part.items.length
    }))
  );
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function applyPalette(id) {
  const palette = PALETTES[id] || PALETTES.delft;
  const root = document.documentElement;
  Object.entries(palette).forEach(([key, value]) => root.style.setProperty(`--${key}`, value));
}

function usePersistentState() {
  const [state, setState] = useState(() => window.ReadyStore.get());
  useEffect(() => window.ReadyStore.set(state), [state]);
  return [state, setState];
}

function Shell({ route, setRoute, children, palette, setPalette }) {
  return <div className="app-root">
    <div className="topbar">
      <button className="brand-lockup" type="button" onClick={() => setRoute("home")} aria-label="Home">
        <span className="flag">NL</span>
        <span>Dutch Ready</span>
      </button>
      <div className="top-actions">
        <select className="palette-select" value={palette} onChange={e => setPalette(e.target.value)} aria-label="Theme">
          <option value="delft">Delft</option>
          <option value="meadow">Meadow</option>
          <option value="coral">Coral</option>
        </select>
      </div>
    </div>
    <main className="screen">{children}</main>
    <nav className="bottom-nav">
      {[
        ["home", "Home", "House"],
        ["study", "Study", "BookOpen"],
        ["test", "Test", "Mic"],
        ["list", "My List", "ListChecks"]
      ].map(([id, label, icon]) => (
        <button key={id} className={route === id ? "active" : ""} type="button" onClick={() => setRoute(id)}>
          <Icon name={icon} size={19} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  </div>;
}

function Home({ items, parts, state, setRoute, setActivePart }) {
  const savedCount = state.saved.length;
  const todoCount = state.todo.length;
  const doneCount = state.done.length;
  return <>
    <section className="hero-panel">
      <div>
        <p className="eyebrow">Lesson 4B</p>
        <h1>Practice Dutch out loud.</h1>
        <p className="hero-copy">Study key phrases, listen to Dutch pronunciation, and test by speaking.</p>
      </div>
      <button className="round-play" type="button" onClick={() => window.ReadySpeech.speak("Hoe laat is het?")} aria-label="Play sample">
        <Icon name="Volume2" size={24} />
      </button>
    </section>

    <section className="stats-grid">
      <div className="stat"><strong>{items.length}</strong><span>Items</span></div>
      <div className="stat"><strong>{savedCount}</strong><span>Saved</span></div>
      <div className="stat"><strong>{todoCount}</strong><span>To do</span></div>
      <div className="stat"><strong>{doneCount}</strong><span>Done</span></div>
    </section>

    <section className="mode-list">
      <ActionCard icon="BookOpen" title="Study" desc="Listen, repeat, save, and mark items." onClick={() => setRoute("study")} />
      <ActionCard icon="Mic" title="Pronunciation Test" desc="Read Dutch aloud and get a match score." onClick={() => setRoute("test")} />
      <ActionCard icon="ListChecks" title="My List" desc="Review saved phrases and your to-do queue." onClick={() => setRoute("list")} />
    </section>

    <section>
      <Header title="Parts" />
      <div className="part-grid">
        {parts.map(part => (
          <button key={part.id} className="part-tile" type="button" onClick={() => { setActivePart(part.id); setRoute("study"); }}>
            <span>{part.title}</span>
            <strong>{part.label}</strong>
            <em>{part.count} items</em>
          </button>
        ))}
      </div>
    </section>
  </>;
}

function ActionCard({ icon, title, desc, onClick }) {
  return <button className="mode-card" type="button" onClick={onClick}>
    <span className="glyph"><Icon name={icon} size={23} /></span>
    <span className="mode-copy"><strong>{title}</strong><em>{desc}</em></span>
    <Icon name="ChevronRight" size={20} />
  </button>;
}

function Header({ title, right }) {
  return <div className="section-head"><h2>{title}</h2>{right}</div>;
}

function PartTabs({ parts, activePart, setActivePart }) {
  return <div className="tabs">
    <button className={activePart === "all" ? "active" : ""} type="button" onClick={() => setActivePart("all")}>All</button>
    {parts.map(part => (
      <button key={part.id} className={activePart === part.id ? "active" : ""} type="button" onClick={() => setActivePart(part.id)}>
        {part.title}
      </button>
    ))}
  </div>;
}

function Study({ items, parts, activePart, setActivePart, state, updateItemState }) {
  const visible = activePart === "all" ? items : items.filter(item => item.partId === activePart);
  const grouped = parts
    .filter(part => activePart === "all" || part.id === activePart)
    .map(part => ({ ...part, items: visible.filter(item => item.partId === part.id) }))
    .filter(part => part.items.length);

  return <>
    <Header title="Study" right={<span className="count-pill">{visible.length} items</span>} />
    <PartTabs parts={parts} activePart={activePart} setActivePart={setActivePart} />
    <div className="study-list">
      {grouped.map(part => (
        <section key={part.id} className="part-section">
          <div className="part-heading">
            <span>{part.title}</span>
            <strong>{part.label}</strong>
          </div>
          {part.items.map(item => <StudyCard key={keyOf(item)} item={item} state={state} updateItemState={updateItemState} />)}
        </section>
      ))}
    </div>
  </>;
}

function StudyCard({ item, state, updateItemState }) {
  const saved = state.saved.includes(item.key);
  const todo = state.todo.includes(item.key);
  const done = state.done.includes(item.key);
  return <article className={`study-card ${done ? "done" : ""}`}>
    <div className="card-main">
      <button className="audio-btn" type="button" onClick={() => window.ReadySpeech.speak(item.nl)} aria-label="Play pronunciation">
        <Icon name="Volume2" size={20} />
      </button>
      <div className="phrase-copy">
        <h3>{item.nl}</h3>
        <p>{item.en}</p>
        <span>{item.type} · {item.partTitle}</span>
      </div>
    </div>
    <div className="card-actions">
      <button className={saved ? "mini active" : "mini"} type="button" onClick={() => updateItemState(item.key, "saved")} aria-label="Save">
        <Icon name="Bookmark" size={17} /> Save
      </button>
      <button className={todo ? "mini active todo" : "mini"} type="button" onClick={() => updateItemState(item.key, "todo")} aria-label="Add to to-do">
        <Icon name="SquareCheckBig" size={17} /> To do
      </button>
      <button className={done ? "mini active done" : "mini"} type="button" onClick={() => updateItemState(item.key, "done")} aria-label="Mark done">
        <Icon name="Check" size={17} /> Done
      </button>
    </div>
  </article>;
}

function Test({ items, parts, activePart, setActivePart, state, setState }) {
  const pool = useMemo(() => {
    const base = activePart === "all" ? items : items.filter(item => item.partId === activePart);
    return shuffle(base).slice(0, Math.min(12, base.length));
  }, [items, activePart]);
  const [index, setIndex] = useState(0);
  const [list, setList] = useState(pool);
  const [listKey, setListKey] = useState(`${activePart}:${pool.map(x => x.key).join("|")}`);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ pass: 0, retry: 0 });

  useEffect(() => {
    const next = shuffle(activePart === "all" ? items : items.filter(item => item.partId === activePart)).slice(0, 12);
    setList(next);
    setListKey(`${activePart}:${next.map(x => x.key).join("|")}`);
  }, [items, activePart]);

  useEffect(() => {
    setIndex(0);
    setResult(null);
    setScore({ pass: 0, retry: 0 });
  }, [listKey]);

  const item = list[index];
  const done = index >= list.length;

  function startListening() {
    if (!item) return;
    setResult(null);
    window.ReadySpeech.listen({
      onStart: () => setListening(true),
      onEnd: () => setListening(false),
      onError: message => {
        setListening(false);
        setResult({ transcript: "", score: 0, message });
      },
      onResult: alternatives => {
        const best = alternatives
          .map(text => ({ text, score: window.ReadySpeech.similarity(item.nl, text) }))
          .sort((a, b) => b.score - a.score)[0] || { text: "", score: 0 };
        const passed = best.score >= 0.72;
        setResult({
          transcript: best.text,
          score: Math.round(best.score * 100),
          passed,
          message: passed ? "Good match" : "Try again"
        });
        setScore(s => ({ pass: s.pass + (passed ? 1 : 0), retry: s.retry + (passed ? 0 : 1) }));
        if (passed) {
          setState(prev => ({
            ...prev,
            done: Array.from(new Set([...prev.done, item.key])),
            todo: prev.todo.filter(key => key !== item.key),
            testHistory: [{ key: item.key, score: Math.round(best.score * 100), date: new Date().toISOString() }, ...prev.testHistory].slice(0, 30)
          }));
        }
      }
    });
  }

  if (!list.length) {
    return <>
      <Header title="Test" />
      <EmptyState icon="MicOff" title="No items here" desc="Pick another part or add Lesson 4B content first." />
    </>;
  }

  if (done) {
    const total = score.pass + score.retry;
    const pct = total ? Math.round(score.pass / total * 100) : 0;
    const restart = () => {
      setList(shuffle(activePart === "all" ? items : items.filter(x => x.partId === activePart)).slice(0, 12));
      setIndex(0);
      setResult(null);
      setScore({ pass: 0, retry: 0 });
    };
    return <section className="test-done">
      <div className="score-ring" style={{ "--p": `${pct}%` }}><strong>{pct}%</strong><span>match</span></div>
      <h2>Session complete</h2>
      <p>{score.pass} passed · {score.retry} to retry</p>
      <button className="primary-btn" type="button" onClick={restart}>Start again</button>
    </section>;
  }

  return <>
    <Header title="Test" right={<span className="count-pill">{index + 1}/{list.length}</span>} />
    <PartTabs parts={parts} activePart={activePart} setActivePart={setActivePart} />
    <section className="test-card">
      <p className="eyebrow">Read this out loud</p>
      <h2>{item.nl}</h2>
      <p>{item.en}</p>
      <div className="test-controls">
        <button className="secondary-btn" type="button" onClick={() => window.ReadySpeech.speak(item.nl)}>
          <Icon name="Volume2" size={19} /> Listen
        </button>
        <button className={listening ? "primary-btn recording" : "primary-btn"} type="button" onClick={startListening} disabled={listening}>
          <Icon name="Mic" size={19} /> {listening ? "Listening..." : "Speak"}
        </button>
      </div>
      {result && <div className={result.passed ? "result pass" : "result retry"}>
        <strong>{result.message}</strong>
        <span>{result.score}%</span>
        {result.transcript && <em>Heard: {result.transcript}</em>}
        {!result.transcript && <em>{result.message}</em>}
      </div>}
    </section>
    <div className="step-row">
      <button className="secondary-btn" type="button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
        <Icon name="ChevronLeft" size={18} /> Back
      </button>
      <button className="primary-btn" type="button" onClick={() => { setResult(null); setIndex(index + 1); }}>
        Next <Icon name="ChevronRight" size={18} />
      </button>
    </div>
  </>;
}

function MyList({ items, state, updateItemState }) {
  const saved = items.filter(item => state.saved.includes(item.key));
  const todo = items.filter(item => state.todo.includes(item.key));
  const done = items.filter(item => state.done.includes(item.key));
  const [tab, setTab] = useState("todo");
  const current = tab === "saved" ? saved : tab === "done" ? done : todo;
  return <>
    <Header title="My List" right={<span className="count-pill">{current.length}</span>} />
    <div className="tabs three">
      <button className={tab === "todo" ? "active" : ""} type="button" onClick={() => setTab("todo")}>To do</button>
      <button className={tab === "saved" ? "active" : ""} type="button" onClick={() => setTab("saved")}>Saved</button>
      <button className={tab === "done" ? "active" : ""} type="button" onClick={() => setTab("done")}>Done</button>
    </div>
    {current.length ? (
      <div className="study-list compact">
        {current.map(item => <StudyCard key={item.key} item={item} state={state} updateItemState={updateItemState} />)}
      </div>
    ) : (
      <EmptyState icon="ListChecks" title="Nothing yet" desc="Save items or add them to your to-do list while studying." />
    )}
  </>;
}

function EmptyState({ icon, title, desc }) {
  return <section className="empty-state">
    <span><Icon name={icon} size={34} /></span>
    <h2>{title}</h2>
    <p>{desc}</p>
  </section>;
}

function App() {
  const items = useMemo(flattenLessons, []);
  const parts = useMemo(partList, []);
  const [state, setState] = usePersistentState();
  const [route, setRoute] = useState("home");
  const [activePart, setActivePart] = useState(state.activePart || "all");
  const [palette, setPalette] = useState(() => localStorage.getItem("dutch-ready.palette") || "delft");

  useEffect(() => {
    applyPalette(palette);
    localStorage.setItem("dutch-ready.palette", palette);
  }, [palette]);

  useEffect(() => {
    setState(prev => ({ ...prev, activePart }));
  }, [activePart]);

  function updateItemState(key, bucket) {
    setState(prev => {
      const has = prev[bucket].includes(key);
      const next = { ...prev, [bucket]: has ? prev[bucket].filter(x => x !== key) : [...prev[bucket], key] };
      if (bucket === "done" && !has) next.todo = next.todo.filter(x => x !== key);
      return next;
    });
  }

  let content;
  if (route === "study") {
    content = <Study items={items} parts={parts} activePart={activePart} setActivePart={setActivePart} state={state} updateItemState={updateItemState} />;
  } else if (route === "test") {
    content = <Test items={items} parts={parts} activePart={activePart} setActivePart={setActivePart} state={state} setState={setState} />;
  } else if (route === "list") {
    content = <MyList items={items} state={state} updateItemState={updateItemState} />;
  } else {
    content = <Home items={items} parts={parts} state={state} setRoute={setRoute} setActivePart={setActivePart} />;
  }

  return <Shell route={route} setRoute={setRoute} palette={palette} setPalette={setPalette}>{content}</Shell>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
