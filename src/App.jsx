import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// 🔥 PASTE YOUR FIREBASE CONFIG HERE
// Get this from Firebase Console → Project Settings → Your Apps → Web app
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyB1hpkXvEQhcDHW7eM4Bw7PSUcRzxQjZIk",
  authDomain: "family-feud-70191.firebaseapp.com",
  projectId: "family-feud-70191",
  storageBucket: "family-feud-70191.firebasestorage.app",
  messagingSenderId: "1021845962297",
  appId: "1:1021845962297:web:b41bb66be0d888722257e8"
};

// ── Firebase init ─────────────────────────────────────────────────────────────
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

function gameRef(code) { return doc(db, "games", code); }
async function saveGame(code, data) { await setDoc(gameRef(code), { ...data, updatedAt: Date.now() }, { merge: true }); }
async function patchGame(code, patch) { await updateDoc(gameRef(code), { ...patch, updatedAt: Date.now() }); }

function useGameSync(code) {
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (!code) return;
    const unsub = onSnapshot(gameRef(code), snap => { if (snap.exists()) setGame(snap.data()); });
    return unsub;
  }, [code]);
  return game;
}

function generateCode() { return Math.random().toString(36).substring(2, 7).toUpperCase(); }

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#07071a", surface: "#10103a", surfaceAlt: "#16164a", border: "#252560",
  gold: "#f5c518", purple: "#7c3aed", red: "#dc2626", green: "#16a34a",
  text: "#ffffff", muted: "#7878aa",
};
const answerColors = ["#14532d","#164e63","#3b0764","#7c2d12","#1e3a5f"];

const S = {
  app: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center" },
  header: { width: "100%", background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `3px solid ${C.gold}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" },
  logo: { fontSize: "1.3rem", fontWeight: 900, letterSpacing: "0.06em", color: C.gold, textTransform: "uppercase" },
  page: { width: "100%", maxWidth: "480px", padding: "20px 16px", boxSizing: "border-box", flex: 1 },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "18px", marginBottom: "14px" },
  title: { fontSize: "1.6rem", fontWeight: 900, color: C.gold, marginBottom: "4px", textAlign: "center" },
  sub: { fontSize: "0.85rem", color: C.muted, textAlign: "center", marginBottom: "18px" },
  label: { fontSize: "0.7rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" },
  input: { width: "100%", background: C.bg, border: `2px solid ${C.border}`, borderRadius: "8px", color: C.text, padding: "11px 13px", fontSize: "1rem", boxSizing: "border-box", outline: "none", marginBottom: "9px" },
  btn: (v = "primary") => ({
    width: "100%", padding: "13px", borderRadius: "10px", border: "none", cursor: "pointer",
    fontSize: "0.92rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px",
    background: v === "primary" ? C.gold : v === "danger" ? C.red : v === "success" ? C.green : v === "purple" ? C.purple : v === "ghost" ? "transparent" : C.surfaceAlt,
    color: v === "primary" ? C.bg : "#fff",
    border: v === "ghost" ? `1px solid ${C.border}` : "none",
  }),
  codeDisplay: { fontSize: "2.8rem", fontWeight: 900, letterSpacing: "0.25em", color: C.gold, textAlign: "center", background: C.surfaceAlt, borderRadius: "12px", padding: "16px", marginBottom: "10px", fontFamily: "monospace" },
  scoreBoard: { display: "flex", gap: "10px", marginBottom: "14px" },
  scoreCard: (active) => ({ flex: 1, background: active ? C.surfaceAlt : C.surface, border: `2px solid ${active ? C.gold : C.border}`, borderRadius: "12px", padding: "11px", textAlign: "center" }),
  scoreTeam: { fontSize: "0.7rem", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" },
  scoreNum: { fontSize: "1.9rem", fontWeight: 900, color: C.gold },
  qBox: { background: C.surfaceAlt, border: `2px solid ${C.gold}`, borderRadius: "12px", padding: "15px", textAlign: "center", marginBottom: "14px", fontSize: "1rem", fontWeight: 700, lineHeight: 1.45 },
  tile: (revealed, rank) => ({ display: "flex", alignItems: "center", background: revealed ? (answerColors[rank] || "#1e3a5f") : C.surfaceAlt, border: `2px solid ${revealed ? "transparent" : C.border}`, borderRadius: "10px", padding: "12px 15px", marginBottom: "7px", transition: "all 0.35s ease", minHeight: "52px" }),
  rank: { width: "28px", height: "28px", borderRadius: "50%", background: C.gold, color: C.bg, fontWeight: 900, fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "11px", flexShrink: 0 },
  strikeRow: { display: "flex", gap: "8px", justifyContent: "center", marginBottom: "11px" },
  strikeBox: (on) => ({ width: "38px", height: "38px", borderRadius: "8px", background: on ? C.red : C.surfaceAlt, border: `2px solid ${on ? C.red : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 900, transition: "all 0.25s" }),
  divider: { border: "none", borderTop: `1px solid ${C.border}`, margin: "14px 0" },
  badge: (color = C.gold) => ({ background: color, color: color === C.gold ? C.bg : "#fff", borderRadius: "6px", padding: "3px 9px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }),
  tag: { display: "inline-block", background: C.surfaceAlt, color: C.muted, borderRadius: "6px", padding: "2px 8px", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  spinner: { width: "30px", height: "30px", border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "20px auto" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOST VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function HostView() {
  const [step, setStep] = useState("setup");
  const [teams, setTeams] = useState(["Team 1", "Team 2"]);
  const [questions, setQuestions] = useState([]);
  const [gameCode, setGameCode] = useState(null);
  const [addingQ, setAddingQ] = useState(false);
  const [customQ, setCustomQ] = useState({ question: "", answers: [{ text: "", points: "" }] });

  const game = useGameSync(gameCode);

  const startLobby = async () => {
    const code = generateCode();
    await saveGame(code, {
      code, phase: "lobby",
      teams: teams.map((name, i) => ({ name, score: 0, id: i })),
      questions, currentQ: 0, strikes: 0, revealedAnswers: [], activeTeam: 0, playerCount: 0,
    });
    setGameCode(code);
    setStep("lobby");
  };

  const startGame = () => patchGame(gameCode, { phase: "round", currentQ: 0, strikes: 0, revealedAnswers: [], activeTeam: 0 });

  const revealAnswer = (i) => {
    if (!game || game.revealedAnswers.includes(i)) return;
    const revealed = [...game.revealedAnswers, i];
    const pts = game.questions[game.currentQ].answers[i].points;
    const updatedTeams = game.teams.map((t, ti) => ti === game.activeTeam ? { ...t, score: t.score + pts } : t);
    patchGame(gameCode, { revealedAnswers: revealed, teams: updatedTeams });
  };

  const addStrike = () => patchGame(gameCode, { strikes: Math.min((game?.strikes || 0) + 1, 3) });
  const switchTeam = () => patchGame(gameCode, { activeTeam: (game.activeTeam + 1) % game.teams.length });

  const nextQuestion = () => {
    const next = game.currentQ + 1;
    if (next >= game.questions.length) { patchGame(gameCode, { phase: "final" }); setStep("final"); }
    else patchGame(gameCode, { currentQ: next, strikes: 0, revealedAnswers: [], activeTeam: (game.activeTeam + 1) % game.teams.length });
  };

  const saveCustomQ = () => {
    const filled = customQ.answers.filter(a => a.text && a.points);
    if (!customQ.question || filled.length < 2) return;
    const sorted = [...filled].sort((a, b) => Number(b.points) - Number(a.points));
    setQuestions(p => [...p, { question: customQ.question, answers: sorted.map(a => ({ text: a.text, points: Number(a.points) })) }]);
    setCustomQ({ question: "", answers: [{ text: "", points: "" }] });
    setAddingQ(false);
  };

  const currentQuestion = game?.questions?.[game?.currentQ];

  // SETUP
  if (step === "setup") return (
    <div style={S.page}>
      <div style={{ ...S.title, marginBottom: "2px" }}>Host Setup</div>
      <div style={S.sub}>Add your teams and questions, then open the lobby</div>

      <div style={S.card}>
        <div style={S.label}>Teams</div>
        {teams.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px", alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? C.gold : C.purple, flexShrink: 0 }} />
            <input style={{ ...S.input, flex: 1, marginBottom: 0 }} value={t}
              onChange={e => setTeams(teams.map((x, j) => j === i ? e.target.value : x))} />
            {teams.length > 2 && (
              <button onClick={() => setTeams(teams.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            )}
          </div>
        ))}
        {teams.length < 6 && (
          <button style={{ ...S.btn("ghost"), marginTop: "4px" }} onClick={() => setTeams([...teams, `Team ${teams.length + 1}`])}>+ Add Team</button>
        )}
      </div>

      <div style={S.card}>
        <div style={S.label}>Questions ({questions.length})</div>
        {questions.length === 0 && <div style={{ color: C.muted, fontSize: "0.85rem", textAlign: "center", padding: "6px 0 10px" }}>No questions yet — add one below</div>}
        {questions.map((q, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: "0.85rem", color: "#ccc", flex: 1, lineHeight: 1.4 }}>{q.question}</span>
            <button onClick={() => setQuestions(questions.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: C.red, cursor: "pointer", marginLeft: "8px", fontSize: "1rem" }}>✕</button>
          </div>
        ))}

        <hr style={S.divider} />

        {!addingQ ? (
          <button style={S.btn("secondary")} onClick={() => setAddingQ(true)}>✏️ Add Question</button>
        ) : (
          <div>
            <div style={S.label}>Question</div>
            <input style={S.input} placeholder="Name something people do on vacation…"
              value={customQ.question} onChange={e => setCustomQ({ ...customQ, question: e.target.value })} />
            <div style={S.label}>Answers & Points (highest points first)</div>
            {customQ.answers.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "7px", marginBottom: "6px" }}>
                <input style={{ ...S.input, flex: 3, marginBottom: 0 }} placeholder={`Answer ${i + 1}`}
                  value={a.text} onChange={e => setCustomQ({ ...customQ, answers: customQ.answers.map((x, j) => j === i ? { ...x, text: e.target.value } : x) })} />
                <input style={{ ...S.input, flex: 1, marginBottom: 0 }} placeholder="Pts" type="number"
                  value={a.points} onChange={e => setCustomQ({ ...customQ, answers: customQ.answers.map((x, j) => j === i ? { ...x, points: e.target.value } : x) })} />
              </div>
            ))}
            {customQ.answers.length < 8 && (
              <button style={{ ...S.btn("ghost"), marginBottom: "8px" }}
                onClick={() => setCustomQ({ ...customQ, answers: [...customQ.answers, { text: "", points: "" }] })}>+ Add Answer</button>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ ...S.btn("success"), flex: 1 }} onClick={saveCustomQ}>Save Question</button>
              <button style={{ ...S.btn("ghost"), flex: 1 }} onClick={() => { setAddingQ(false); setCustomQ({ question: "", answers: [{ text: "", points: "" }] }); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <button style={S.btn("primary")} onClick={startLobby} disabled={questions.length === 0 || teams.length < 2}>
        Open Lobby →
      </button>
    </div>
  );

  // LOBBY
  if (step === "lobby") return (
    <div style={S.page}>
      <div style={S.title}>Waiting Room</div>
      <div style={S.sub}>Share this code — players enter it on their phones</div>
      <div style={S.codeDisplay}>{gameCode}</div>
      <div style={{ ...S.sub, marginBottom: "16px" }}>Players visit this same URL → tap "Join as Player" → enter code</div>
      <div style={S.card}>
        <div style={S.label}>Teams</div>
        {teams.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "7px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? C.gold : C.purple }} />
            <span style={{ fontWeight: 600 }}>{t}</span>
          </div>
        ))}
        <hr style={S.divider} />
        <div style={{ textAlign: "center", color: C.muted, fontSize: "0.85rem" }}>
          {game?.playerCount || 0} player{game?.playerCount !== 1 ? "s" : ""} connected
        </div>
      </div>
      <div style={S.card}>
        <div style={S.label}>Game Info</div>
        <div style={{ color: "#ccc", fontSize: "0.9rem" }}>{questions.length} questions · {teams.length} teams</div>
      </div>
      <button style={S.btn("primary")} onClick={startGame}>Start Game →</button>
      <button style={S.btn("ghost")} onClick={() => setStep("setup")}>← Edit Setup</button>
    </div>
  );

  // ROUND
  if ((step === "lobby" || step === "round") && game?.phase === "round" && currentQuestion) return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={S.tag}>Q {game.currentQ + 1} / {game.questions.length}</span>
        <span style={S.badge()}>HOST</span>
      </div>
      <div style={S.scoreBoard}>
        {game.teams.map((t, i) => (
          <div key={i} style={S.scoreCard(i === game.activeTeam)}>
            <div style={S.scoreTeam}>{t.name}</div>
            <div style={S.scoreNum}>{t.score}</div>
          </div>
        ))}
      </div>
      <div style={S.qBox}>{currentQuestion.question}</div>
      <div style={{ ...S.label, marginBottom: "10px" }}>
        Active: <span style={{ color: C.gold }}>{game.teams[game.activeTeam]?.name}</span>
        <span style={{ color: C.muted }}> — tap an answer to reveal &amp; award points</span>
      </div>
      {currentQuestion.answers.map((a, i) => {
        const revealed = game.revealedAnswers.includes(i);
        return (
          <div key={i} style={{ ...S.tile(revealed, i), cursor: revealed ? "default" : "pointer" }} onClick={() => revealAnswer(i)}>
            <div style={S.rank}>{i + 1}</div>
            <div style={{ flex: 1, fontWeight: 600 }}>{revealed ? a.text : "Tap to reveal"}</div>
            {revealed && <div style={{ fontWeight: 900, fontSize: "1.1rem", color: C.gold }}>{a.points}</div>}
          </div>
        );
      })}
      <hr style={S.divider} />
      <div style={S.strikeRow}>{[0,1,2].map(i => <div key={i} style={S.strikeBox(i < game.strikes)}>✕</div>)}</div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <button style={{ ...S.btn("danger"), flex: 1, marginBottom: 0 }} onClick={addStrike}>✕ Strike</button>
        <button style={{ ...S.btn("secondary"), flex: 1, marginBottom: 0 }} onClick={switchTeam}>⇄ Switch Team</button>
      </div>
      <button style={S.btn("primary")} onClick={nextQuestion}>
        {game.currentQ + 1 >= game.questions.length ? "End Game →" : "Next Question →"}
      </button>
    </div>
  );

  // FINAL
  if (step === "final" || game?.phase === "final") return (
    <div style={S.page}>
      <div style={{ textAlign: "center", marginTop: "16px", marginBottom: "20px" }}>
        <div style={{ fontSize: "3rem" }}>🏆</div>
        <div style={S.title}>Game Over!</div>
        <div style={S.sub}>Final Scores</div>
      </div>
      {game?.teams?.slice().sort((a, b) => b.score - a.score).map((t, i) => (
        <div key={i} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.4rem" }}>{["🥇","🥈","🥉"][i] || "🏅"}</span>
            <span style={{ fontWeight: 700 }}>{t.name}</span>
          </div>
          <span style={{ fontSize: "2rem", fontWeight: 900, color: C.gold }}>{t.score}</span>
        </div>
      ))}
      <button style={S.btn("primary")} onClick={() => { setStep("setup"); setGameCode(null); setQuestions([]); }}>New Game</button>
    </div>
  );

  return <div style={S.page}><div style={S.spinner} /></div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function PlayerView() {
  const [pStep, setPStep] = useState("join");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [teamIdx, setTeamIdx] = useState(null);
  const [gameCode, setGameCode] = useState(null);

  const game = useGameSync(gameCode);

  useEffect(() => {
    if (!game) return;
    if (game.phase === "final") setPStep("final");
    else if (game.phase === "round") setPStep("game");
  }, [game?.phase]);

  const joinGame = async () => {
    try {
      const snap = await getDoc(gameRef(code.toUpperCase()));
      if (!snap.exists()) { setError("Game not found. Check your code."); return; }
      const g = snap.data();
      await patchGame(code.toUpperCase(), { playerCount: (g.playerCount || 0) + 1 });
      setGameCode(code.toUpperCase());
      setPStep("lobby");
      setError("");
    } catch { setError("Couldn't connect. Try again."); }
  };

  const currentQuestion = game?.questions?.[game?.currentQ];

  // JOIN
  if (pStep === "join") return (
    <div style={S.page}>
      <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "24px" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "10px" }}>🎮</div>
        <div style={S.title}>Join Game</div>
        <div style={S.sub}>Enter the 5-letter code your host is showing</div>
      </div>
      <div style={S.card}>
        <input style={{ ...S.input, fontSize: "1.6rem", textAlign: "center", letterSpacing: "0.25em", textTransform: "uppercase" }}
          placeholder="XXXXX" maxLength={5} value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }} />
        {error && <div style={{ color: C.red, fontSize: "0.85rem", textAlign: "center", marginBottom: "8px" }}>{error}</div>}
        <button style={S.btn("primary")} onClick={joinGame} disabled={code.length < 5}>Join →</button>
      </div>
    </div>
  );

  // LOBBY
  if (pStep === "lobby") return (
    <div style={S.page}>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>⏳</div>
        <div style={S.title}>Waiting for Host</div>
        <div style={S.sub}>The game will start soon. Pick your team!</div>
      </div>
      <div style={S.card}>
        <div style={S.label}>I'm on…</div>
        {game?.teams?.map((t, i) => (
          <button key={i} style={{ ...S.btn(i === teamIdx ? "primary" : "ghost"), marginBottom: "7px" }}
            onClick={() => setTeamIdx(i)}>{t.name}</button>
        ))}
        {teamIdx === null && <div style={{ color: C.muted, fontSize: "0.82rem", textAlign: "center" }}>Tap your team above</div>}
      </div>
      <div style={{ textAlign: "center", color: C.muted, fontSize: "0.82rem" }}>
        {game?.playerCount || 0} player{game?.playerCount !== 1 ? "s" : ""} in lobby
      </div>
    </div>
  );

  // GAME
  if (pStep === "game" && game && currentQuestion) return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={S.tag}>Q {game.currentQ + 1} / {game.questions.length}</span>
        {teamIdx !== null && <span style={S.badge(C.purple)}>{game.teams[teamIdx]?.name}</span>}
      </div>
      <div style={S.scoreBoard}>
        {game.teams.map((t, i) => (
          <div key={i} style={S.scoreCard(i === game.activeTeam)}>
            <div style={S.scoreTeam}>{t.name}</div>
            <div style={S.scoreNum}>{t.score}</div>
          </div>
        ))}
      </div>
      <div style={S.qBox}>{currentQuestion.question}</div>
      {game.strikes > 0 && (
        <div style={S.strikeRow}>{[0,1,2].map(i => <div key={i} style={S.strikeBox(i < game.strikes)}>✕</div>)}</div>
      )}
      {currentQuestion.answers.map((a, i) => {
        const revealed = game.revealedAnswers.includes(i);
        return (
          <div key={i} style={S.tile(revealed, i)}>
            <div style={S.rank}>{i + 1}</div>
            <div style={{ flex: 1, fontWeight: 600 }}>{revealed ? a.text : "???"}</div>
            {revealed && <div style={{ fontWeight: 900, fontSize: "1.1rem", color: C.gold }}>{a.points}</div>}
          </div>
        );
      })}
      <div style={{ textAlign: "center", color: C.muted, fontSize: "0.82rem", marginTop: "12px" }}>
        {teamIdx !== null && game.activeTeam === teamIdx ? "🎯 Your team is up!" : `Waiting for ${game.teams[game.activeTeam]?.name}…`}
      </div>
    </div>
  );

  // FINAL
  if (pStep === "final") return (
    <div style={S.page}>
      <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
        <div style={{ fontSize: "3rem" }}>🏆</div>
        <div style={S.title}>Game Over!</div>
        <div style={S.sub}>Final Scores</div>
      </div>
      {game?.teams?.slice().sort((a, b) => b.score - a.score).map((t, i) => (
        <div key={i} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.4rem" }}>{["🥇","🥈","🥉"][i] || "🏅"}</span>
            <span style={{ fontWeight: 700 }}>{t.name}</span>
          </div>
          <span style={{ fontSize: "2rem", fontWeight: 900, color: C.gold }}>{t.score}</span>
        </div>
      ))}
      <button style={S.btn("ghost")} onClick={() => { setPStep("join"); setCode(""); setGameCode(null); setTeamIdx(null); }}>Play Again</button>
    </div>
  );

  return <div style={S.page}><div style={S.spinner} /></div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState(null);
  return (
    <div style={S.app}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input:focus { border-color: #f5c518 !important; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        button { transition: opacity 0.15s; }
      `}</style>
      <div style={S.header}>
        <div style={S.logo}>⭐ Family Feud</div>
        {mode && <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "0.8rem" }}>← Back</button>}
        {mode === "host" && <span style={S.badge()}>Host</span>}
        {mode === "player" && <span style={S.badge(C.purple)}>Player</span>}
      </div>
      {mode === null && (
        <div style={{ ...S.page, display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ fontSize: "4.5rem", marginBottom: "10px" }}>⭐</div>
            <div style={{ ...S.title, fontSize: "2.2rem" }}>Family Feud</div>
            <div style={S.sub}>Live trivia for your event</div>
          </div>
          <button style={S.btn("primary")} onClick={() => setMode("host")}>🎙️ I'm the Host</button>
          <button style={S.btn("secondary")} onClick={() => setMode("player")}>🎮 Join as Player</button>
        </div>
      )}
      {mode === "host" && <HostView />}
      {mode === "player" && <PlayerView />}
    </div>
  );
}
