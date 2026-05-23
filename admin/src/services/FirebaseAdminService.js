import backend from "../backend.js";

class FirebaseAdminService {
  static async initialize() {
    try {
      console.log("Initializing Admin backend...");
      await backend.initialize();
      console.log("Backend initialized");
      return true;
    } catch (err) {
      console.error("Backend initialization failed", err);
      return false;
    }
  }

  static async testConnection() {
    return backend.testConnection();
  }

  static async getPrograms() {
    try {
      const progs = await backend.getPrograms();
      return progs || [];
    } catch (err) {
      console.error("Error getting programs from backend", err);
      return [];
    }
  }

  static async addProgram(programData) {
    return backend.addProgram(programData);
  }

  static async updateProgram(programId, programData) {
    return backend.updateProgram(programId, programData);
  }

  static async deleteProgram(programId) {
    return backend.deleteProgram(programId);
  }
}

export default FirebaseAdminService;
