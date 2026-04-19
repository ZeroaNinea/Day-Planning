import { Energy } from './energy.alias';

export type TimeSlot = {
  start: number; // In minutes.
  end: number;
  energy: Energy;
};
