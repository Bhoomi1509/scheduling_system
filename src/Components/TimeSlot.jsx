export default function TimeSlot({ slot, selected, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`py-2 px-3 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          selected
            ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {slot.startTime} - {slot.endTime}
      </button>
    );
  }