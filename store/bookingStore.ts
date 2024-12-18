import { create } from 'zustand';

interface BookingStore {
  selectedDates: {
    checkIn: string | null;
    checkOut: string | null;
  };
  setSelectedDates: (checkIn: string | null, checkOut: string | null) => void;
  clearSelectedDates: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedDates: {
    checkIn: null,
    checkOut: null,
  },
  setSelectedDates: (checkIn, checkOut) =>
    set({ selectedDates: { checkIn, checkOut } }),
  clearSelectedDates: () =>
    set({ selectedDates: { checkIn: null, checkOut: null } }),
}));