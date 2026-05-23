// Simple local backend adapter for admin UI (storage via localStorage)
const STORAGE_KEYS = {
  PROGRAMS: "elm_programs",
  KEYNOTES: "elm_keynote_speakers",
};

const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("backend.read error", e);
    return [];
  }
};

const write = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("backend.write error", e);
  }
};

const generateId = () => `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const backend = {
  async initialize() {
    await wait(50);
    return true;
  },

  async testConnection() {
    await wait(50);
    return true;
  },

  // Programs
  async getPrograms() {
    await wait(80);
    return read(STORAGE_KEYS.PROGRAMS);
  },

  async addProgram(program) {
    await wait(80);
    const programs = read(STORAGE_KEYS.PROGRAMS);
    const id = generateId();
    const now = new Date().toISOString();
    const newProg = { id, ...program, createdAt: now, updatedAt: now };
    programs.push(newProg);
    write(STORAGE_KEYS.PROGRAMS, programs);
    return newProg;
  },

  async updateProgram(id, data) {
    await wait(80);
    const programs = read(STORAGE_KEYS.PROGRAMS);
    const idx = programs.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Program not found");
    programs[idx] = { ...programs[idx], ...data, updatedAt: new Date().toISOString() };
    write(STORAGE_KEYS.PROGRAMS, programs);
    return true;
  },

  async deleteProgram(id) {
    await wait(80);
    const programs = read(STORAGE_KEYS.PROGRAMS).filter((p) => p.id !== id);
    write(STORAGE_KEYS.PROGRAMS, programs);
    return true;
  },

  // Keynote speakers
  async getKeynoteSpeakers() {
    await wait(60);
    return read(STORAGE_KEYS.KEYNOTES);
  },

  async addKeynoteSpeaker(data) {
    await wait(80);
    const list = read(STORAGE_KEYS.KEYNOTES);
    const id = generateId();
    const now = new Date().toISOString();
    const newItem = { id, ...data, createdAt: now, updatedAt: now };
    list.push(newItem);
    write(STORAGE_KEYS.KEYNOTES, list);
    return newItem;
  },

  async updateKeynoteSpeaker(id, data) {
    await wait(80);
    const list = read(STORAGE_KEYS.KEYNOTES);
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Speaker not found");
    list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
    write(STORAGE_KEYS.KEYNOTES, list);
    return true;
  },

  async deleteKeynoteSpeaker(id) {
    await wait(80);
    const list = read(STORAGE_KEYS.KEYNOTES).filter((s) => s.id !== id);
    write(STORAGE_KEYS.KEYNOTES, list);
    return true;
  },
};

export default backend;
