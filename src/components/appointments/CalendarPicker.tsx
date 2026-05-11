import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarPickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  availableSlots: string[];
  isDateAvailable?: (date: Date) => boolean;
}

export default function CalendarPicker({ 
  selectedDate, 
  onDateSelect, 
  selectedTime, 
  onTimeSelect,
  availableSlots,
  isDateAvailable
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const today = startOfToday();

  const changeMonth = (offset: number) => {
    setDirection(offset);
    setCurrentMonth(prev => offset > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            disabled={isSameMonth(currentMonth, today)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 20 : -20,
        opacity: 0
      }),
      center: {
        x: 0,
        opacity: 1
      },
      exit: (direction: number) => ({
        x: direction > 0 ? -20 : 20,
        opacity: 0
      })
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, today);
        const isSelected = isSameDay(day, new Date(selectedDate || today));
        const hasSlots = !isDisabled && isDateAvailable?.(day);

        days.push(
          <button
            key={day.toString()}
            type="button"
            disabled={isDisabled}
            onClick={() => onDateSelect(format(cloneDay, 'yyyy-MM-dd'))}
            className={cn(
              "h-12 w-full flex items-center justify-center rounded-2xl text-sm font-bold transition-all relative group",
              isDisabled ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-blue-50",
              isSelected && !isDisabled ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 scale-105 z-10" : 
              hasSlots ? "bg-emerald-50 text-emerald-700 ring-2 ring-transparent hover:ring-emerald-200" : ""
            )}
          >
            <span>{format(day, 'd')}</span>
            {hasSlots && !isSelected && (
              <div className="absolute top-2 right-2 w-1 h-1 bg-emerald-500 rounded-full" />
            )}
            {isSameDay(day, today) && !isSelected && (
              <div className="absolute bottom-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
            )}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2 mb-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="relative h-[300px] sm:h-[320px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentMonth.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-x-0 top-0"
          >
            {rows}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderSlots = () => {
    if (!selectedDate) return null;

    return (
      <div className="border-t border-gray-100 pt-10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2.5">
            <div className="bg-blue-50 p-2 rounded-xl">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-md font-bold text-gray-900 uppercase tracking-tight">Available Slots</h4>
          </div>
          <span className="text-xs font-bold text-gray-400">GMT +01:00</span>
        </div>

        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onTimeSelect(slot)}
                className={cn(
                  "py-4 rounded-2xl text-sm font-bold transition-all border-2",
                  selectedTime === slot
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]"
                    : "bg-white border-gray-100 text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-orange-500 mb-3" />
            <p className="text-sm font-bold text-orange-900">No slots available for this day</p>
            <p className="text-xs text-orange-600/70 font-medium mt-1">Please select another date on the calendar</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderSlots()}
    </div>
  );
}
