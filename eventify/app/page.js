'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [step, setStep] = useState(1); // Track the current step
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1); // Track the number of seats
  const [ticketType, setTicketType] = useState('REGULAR ACCESS'); // Track the ticket type

  const ticketOptions = [
    { type: 'REGULAR ACCESS', price: 'Free' },
    { type: 'VIP ACCESS', price: '$50' },
    { type: 'VVIP ACCESS', price: '$150' },
    { type: 'GOLD', price: '$1000' },
  ];

  // Load saved form data from localStorage on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('conferenceFormData'));
      if (savedData) {
        setFullName(savedData.fullName);
        setEmail(savedData.email);
        setAvatarUrl(savedData.avatarUrl);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'conferenceFormData',
        JSON.stringify({ fullName, email, avatarUrl })
      );
    }
  }, [fullName, email, avatarUrl]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Full Name is required.';
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!avatarUrl) newErrors.avatarUrl = 'Avatar URL is required.';

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, generate the ticket and move to Step 3
    setTicket({
      fullName,
      email,
      avatarUrl,
      ticketType: ticketOptions[activeIndex]?.type || 'REGULAR ACCESS',
      numberOfSeats,
    });
    setStep(3); // Move to Step 3 (Ticket Generation)
    setErrors({});
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'eventify');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dkkmf0xgn/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setAvatarUrl(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ ...errors, avatarUrl: 'Failed to upload image.' });
    }
  };

  return (
    <section className="border-2 mx-4 md:mx-[280px] mt-10 md:mt-20 w-auto md:w-[60%] border-blue-100 rounded-md">
      {/* Step 1: Ticket Selection */}
      {step === 1 && (
        <div>
          <div className="text-center text-white bg-blue-400 border rounded-md w-full md:w-[75%] mx-auto my-4 p-5">
            <h1 className="font-bold text-2xl md:text-[40px]">Techember Fest &quot; 25</h1>
            <p className="text-sm md:text-[15px] mt-2">
              Join us for an unforgettable experience at <br /> Techember Fest! Secure your spot now.
            </p>
            <p className="text-sm md:text-base mt-2">📍 Lagos Nigeria || March 15, 2025 | 7:00 PM</p>
          </div>

          <div className="border-2 border-blue-100 rounded-md my-3 w-full md:w-[70%] mx-auto" />

          <div className="p-4">
            <div className="my-2">
              <h1 className="font-semibold text-lg md:text-[20px]">Select Ticket Type:</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ticketOptions.map((ticket, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`border-2 cursor-pointer flex justify-between items-center p-4 rounded-md ${
                    activeIndex === index ? 'bg-blue-400 text-white' : 'border-blue-100'
                  }`}
                >
                  <div>
                    <p className="text-sm md:text-base">{ticket.type}</p>
                    <h1 className="text-xs md:text-sm">20 Left</h1>
                  </div>
                  <h1 className="border rounded-md bg-blue-600 px-3 py-1 md:px-5 md:py-2 text-white text-sm md:text-base">
                    {ticket.price}
                  </h1>
                </div>
              ))}
            </div>

            <div className="my-4">
              <div className="my-2">
                <h1 className="font-semibold text-lg md:text-[20px]">Number Of Tickets</h1>
              </div>
              <select
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-[75%] mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-10 items-center my-6">
              <button className="border-2 rounded-md py-2 px-8 md:px-14 border-blue-100 text-blue-300 w-full md:w-auto">
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="border-blue-600 bg-blue-600 border rounded-md py-2 px-8 md:px-14 text-white w-full md:w-auto"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Form */}
      {step === 2 && (
        <div className="p-6">
          <h1 className="font-bold text-2xl md:text-[40px] text-center mb-6">Conference Registration</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.fullName ? 'border-red-500' : ''
                }`}
                aria-describedby="fullNameError"
              />
              {errors.fullName && (
                <p id="fullNameError" className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                aria-describedby="emailError"
              />
              {errors.email && (
                <p id="emailError" className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium">
                Avatar Upload
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarUpload}
                className={`w-full p-2 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.avatarUrl ? 'border-red-500' : ''
                }`}
                aria-describedby="avatarError"
              />
              {errors.avatarUrl && (
                <p id="avatarError" className="text-red-500 text-sm mt-1">
                  {errors.avatarUrl}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="border-2 rounded-md py-2 px-8 md:px-14 border-blue-100 text-blue-300 hover:bg-blue-100 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="border-blue-600 bg-blue-600 border rounded-md py-2 px-8 md:px-14 text-white hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Ticket Generation */}
      {step === 3 && (
        <div className="p-6">
          <div className="mt-8 p-6 border-2 border-blue-100 rounded-md bg-white shadow-lg">
            <h2 className="font-bold text-xl text-[40px] text-blue-500 mb-4 text-center">Techember Fest &quot; 25</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left Side: Avatar Image */}
              <div className="flex-shrink-0">
                <Image
                  src={ticket.avatarUrl}
                  alt="User Avatar"
                  width={120} // Default size for larger screens
                  height={120}
                  className="rounded-full w-20 h-20 md:w-32 md:h-32" // Smaller size for mobile
                />
              </div>

              {/* Right Side: Ticket Details */}
              <div className="flex flex-col space-y-2 text-center md:text-left">
                <div>
                  <strong>Attendee:</strong>
                  <p className="text-gray-700">{ticket.fullName}</p>
                </div>
                <div>
                  <strong>Ticket Type:</strong>
                  <p className="text-gray-700">{ticket.ticketType}</p>
                </div>
                <div>
                  <strong>Number of Seats:</strong>
                  <p className="text-gray-700">{ticket.numberOfSeats}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setStep(2)}
              className="border-2 rounded-md py-2 px-8 md:px-14 border-blue-100 text-blue-300 hover:bg-blue-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(1)}
              className="border-blue-600 bg-blue-600 border rounded-md py-2 px-8 md:px-14 text-white hover:bg-blue-700 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      )}
    </section>
  );
}