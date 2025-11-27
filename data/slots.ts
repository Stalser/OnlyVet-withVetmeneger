// data/slots.ts

export type SlotStatus = "free" | "booked" | "hold";

export type Slot = {
  id: string;
  doctorId: string;
  start: string; // ISO-строка
  end: string;   // ISO-строка
  status: SlotStatus;
};

// Моковое расписание — просто примеры для UI
export const slots: Slot[] = [
  // Эльвин — "elvin"
  {
    id: "slot-elvin-1",
    doctorId: "elvin",
    start: "2025-02-10T18:30:00+03:00",
    end: "2025-02-10T19:00:00+03:00",
    status: "free",
  },
  {
    id: "slot-elvin-2",
    doctorId: "elvin",
    start: "2025-02-11T11:00:00+03:00",
    end: "2025-02-11T11:30:00+03:00",
    status: "free",
  },
  {
    id: "slot-elvin-3",
    doctorId: "elvin",
    start: "2025-02-11T19:00:00+03:00",
    end: "2025-02-11T19:30:00+03:00",
    status: "free",
  },

  // Диана — "diana"
  {
    id: "slot-diana-1",
    doctorId: "diana",
    start: "2025-02-10T16:00:00+03:00",
    end: "2025-02-10T16:30:00+03:00",
    status: "free",
  },
  {
    id: "slot-diana-2",
    doctorId: "diana",
    start: "2025-02-12T10:00:00+03:00",
    end: "2025-02-12T10:30:00+03:00",
    status: "free",
  },

  // Олег — "oleg"
  {
    id: "slot-oleg-1",
    doctorId: "oleg",
    start: "2025-02-09T14:00:00+03:00",
    end: "2025-02-09T14:30:00+03:00",
    status: "free",
  },
  {
    id: "slot-oleg-2",
    doctorId: "oleg",
    start: "2025-02-10T20:00:00+03:00",
    end: "2025-02-10T20:30:00+03:00",
    status: "free",
  },
];
