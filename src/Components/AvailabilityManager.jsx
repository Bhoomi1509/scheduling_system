import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from 'react-redux';
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import DatePicker from './DatePicker';
import { generateTimeSlots } from '../utils/dateUtils';
import { addSlot, loadSlots } from '../redux/slices/availabilitySlice';

export default function AvailabilityManager() {
  const [date, setDate] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const initialValues = {
    startTime: '09:00',
    endTime: '09:00'
  };
  const schema = yup
  .object({
    date: yup
      .mixed() 
      .required("Please select a date")
      .test('is-valid-date', 'Please a select date', (value) => {
        return value && !isNaN(new Date(value).getTime());
      }),
    startTime: yup
      .string()
      .required("Start time is required")
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
    endTime: yup
      .string()
      .required("End time is required")
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)")
      .test(
        "is-greater",
        "End time must be after start time",
        function(endTime) {
          const { startTime, date } = this.parent;
          
          if (!date || !startTime || !endTime) return true;
          
          try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return true;
            
            const dateStr = dateObj.toISOString().split('T')[0];
            const startDateTime = new Date(`${dateStr}T${startTime}`);
            const endDateTime = new Date(`${dateStr}T${endTime}`);
            
            return endDateTime > startDateTime;
          } catch (e) {
            return true;
          }
        }
      )
  })
  .required();

  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        // defaultValues: initialValues
    })
    
    const slots = useSelector(state => state.availability.slots);
    const dispatch = useDispatch();

  useEffect(() => {
    const savedSlots = JSON.parse(localStorage.getItem('availability')) || [];
    dispatch(loadSlots(savedSlots));
  }, [dispatch]);

  const onSubmit = (data) => {
    const newSlot = {
      date:data?.date,
      startTime:data?.startTime,
      endTime: data?.endTime
    };

    dispatch(addSlot(newSlot));
    reset(initialValues)
  };

  const handleGenerateLink = () => {
    const linkId = `link_${Date.now()}`;
    setGeneratedLink(`${window.location.origin}/book/${linkId}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Availability</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <DatePicker name='date' register={register}  selected={date} onChange={setDate} />
            {errors.date && (
          <p className="text-red-600 ml-0">{errors.date.message}</p>
        )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <select
            {...register("startTime")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
            >
              {generateTimeSlots().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.startTime && (
          <p className="text-red-600 ml-0">{errors.startTime.message}</p>
        )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <select
            {...register("endTime")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
            >
              {generateTimeSlots().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.endTime && (
          <p className="text-red-600 ml-0">{errors.endTime.message}</p>
        )}
          </div>
        </div>
        
        <button
        type='submit'
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Availability
        </button>
      </div>
      </form>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Availability Slots</h2>
        
        {slots.length === 0 ? (
          <p className="text-gray-500">No availability slots added yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {slots.map((slot) => (
              <li key={slot.id} className="py-4 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{slot.date}</p>
                  <p className="text-sm text-gray-500">{slot.startTime} - {slot.endTime}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <button
          onClick={handleGenerateLink}
          disabled={slots.length === 0}
          className={`w-full md:w-auto font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            slots.length === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500'
          }`}
        >
          Generate Booking Link
        </button>
        
        {generatedLink && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your booking link:</label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">Share this link with people who need to book time with you</p>
          </div>
        )}
      </div>
    </div>
  );
}