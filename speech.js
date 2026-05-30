(function() {
  const synth = window.speechSynthesis;
  let dutchVoice = null;

  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices();
    dutchVoice =
      voices.find(v => v.lang === "nl-NL") ||
      voices.find(v => (v.lang || "").toLowerCase().startsWith("nl")) ||
      voices.find(v => /dutch|nederlands/i.test(v.name)) ||
      null;
  }

  if (synth) {
    pickVoice();
    synth.addEventListener?.("voiceschanged", pickVoice);
    setTimeout(pickVoice, 300);
    setTimeout(pickVoice, 1000);
  }

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’`]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function distance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[m][n];
  }

  function similarity(a, b) {
    const x = normalize(a);
    const y = normalize(b);
    if (!x || !y) return 0;
    const max = Math.max(x.length, y.length);
    return Math.max(0, 1 - distance(x, y) / max);
  }

  window.ReadySpeech = {
    speak(text, opts = {}) {
      if (!synth || !text) return false;
      try {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "nl-NL";
        if (dutchVoice) utterance.voice = dutchVoice;
        utterance.rate = opts.rate ?? 0.86;
        utterance.pitch = opts.pitch ?? 1;
        synth.speak(utterance);
        return true;
      } catch {
        return false;
      }
    },
    listen({ onStart, onResult, onError, onEnd } = {}) {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        onError?.("Speech recognition is not available in this browser.");
        return null;
      }
      const recognition = new Recognition();
      recognition.lang = "nl-NL";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.onstart = () => onStart?.();
      recognition.onerror = event => onError?.(event.error || "Speech recognition failed.");
      recognition.onend = () => onEnd?.();
      recognition.onresult = event => {
        const alternatives = Array.from(event.results[0] || []).map(r => r.transcript);
        onResult?.(alternatives);
      };
      recognition.start();
      return recognition;
    },
    similarity,
    normalize
  };
})();
