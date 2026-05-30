(function() {
  const ROOT = "dutch-ready.";

  function load(key, fallback) {
    try {
      const value = localStorage.getItem(ROOT + key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(ROOT + key, JSON.stringify(value));
    } catch {}
  }

  window.ReadyStore = {
    get() {
      return load("state", {
        saved: [],
        todo: [],
        done: [],
        testHistory: [],
        activePart: "all"
      });
    },
    set(state) {
      save("state", state);
    }
  };
})();
