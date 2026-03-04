import { create } from 'zustand';

const useRamazanStore = create((set) => ({
  terminalLogs: [
    { id: 0, text: '[SİSTEM]: Qlobal AI Girişi Təsdiqləndi', time: new Date().toLocaleTimeString() },
    { id: 1, text: '[SİSTEM]: Ramazan Roulette Rejimi Aktivdir...', time: new Date().toLocaleTimeString() }
  ],
  logIdCounter: 2,
  addLog: (message) => set((state) => {
    // Keep only the last 50 logs to prevent memory bloat
    const newLogs = [...state.terminalLogs, { id: state.logIdCounter, text: message, time: new Date().toLocaleTimeString() }];
    if (newLogs.length > 50) newLogs.shift();
    return {
      terminalLogs: newLogs,
      logIdCounter: state.logIdCounter + 1
    };
  }),
}));

export default useRamazanStore;
