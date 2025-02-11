'use client'
import { useState } from "react";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [step, setStep] = useState(1);

  const ticketOptions = [
    { type: "REGULAR ACCESS", price: "Free" },
    { type: "VIP ACCESS", price: "$50" },
    { type: "VVIP ACCESS", price: "$150" },
    { type: "GOLD", price: "$1000" },
  ];

  return (
    <section className="border-2 mx-4 md:mx-[280px] mt-10 md:mt-20 w-auto md:w-[60%] border-blue-100 rounded-md">
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
                    activeIndex === index ? "bg-blue-400 text-white" : "border-blue-100"
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
              <select className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-[75%] mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
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
      {step === 2 && (
        <div>
          <h1>Form Goes Here</h1>
          {/* Add your form content here */}
          <button
            onClick={() => setStep(1)} // Move back to step 1 (ticket selection)
            className="border-2 rounded-md py-2 px-8 md:px-14 border-blue-100 text-blue-300 w-full md:w-auto"
          >
            Back
          </button>
        </div>
      )}
    </section>
  );
}