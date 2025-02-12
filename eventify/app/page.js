'use client';
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Upload } from "lucide-react";
import { QRCode } from "react-qr-code";
import html2canvas from "html2canvas";

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const steps = ["Ticket Selection", "Attendee Details", "Your Ticket"];
  const [ticket, setTicket] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [ticketType, setTicketType] = useState('REGULAR ACCESS');
  const [activeIndex, setActiveIndex] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null); // State for image preview
  const [project, setProject] = useState("");
  const [isClient, setIsClient] = useState(false);

  const ticketOptions = [
    { type: 'REGULAR ACCESS', price: 'Free' },
    { type: 'VIP ACCESS', price: '$50' },
    { type: 'VVIP ACCESS', price: '$150' },
  ];

  const qrCodeData = JSON.stringify({
    fullName: ticket?.fullName,
    email: ticket?.email,
    ticketType: ticket?.ticketType,
    numberOfSeats: ticket?.numberOfSeats,
    event: "Techember Fest '25",
    location: "04 Rumens Road, Ikoyi, Lagos",
    date: "March 15, 2025 | 7:00 PM",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedData = JSON.parse(localStorage.getItem('conferenceFormData'));
      if (savedData) {
        setFullName(savedData.fullName);
        setEmail(savedData.email);
        setProject(savedData.project);
        setAvatarUrl(savedData.avatarUrl);
        setImage(savedData.avatarUrl); // Set image preview from saved data
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        'conferenceFormData',
        JSON.stringify({ fullName, email, avatarUrl, project })
      );
    }
  }, [fullName, email, project, avatarUrl, isClient]);

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      const newErrors = {};
      if (!fullName) newErrors.fullName = 'Full Name is required.';
      if (!project) newErrors.project = "Tell us about Your Project";
      if (!email) {
        newErrors.email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Invalid email format.';
      }
      if (!avatarUrl) newErrors.avatarUrl = 'Avatar URL is required.';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setTicket({
        fullName,
        email,
        avatarUrl,
        ticketType: ticketOptions[activeIndex]?.type || 'REGULAR ACCESS',
        numberOfSeats,
      });

      setStep(2);
      setErrors({});
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set the image preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result); // Set the image preview URL
    };
    reader.readAsDataURL(file); // Convert file to data URL

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
      setAvatarUrl(data.secure_url); // Set the Cloudinary URL
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ ...errors, avatarUrl: 'Failed to upload image.' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleAvatarUpload({ target: { files: [file] } });
    }
  };

  const downloadTicket = () => {
    const ticketElement = document.getElementById("ticket");
    if (ticketElement) {
      const images = ticketElement.getElementsByTagName("img");
      let loadedImages = 0;

      Array.from(images).forEach((img) => {
        if (img.complete) {
          loadedImages++;
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
              captureTicket();
            }
          };
        }
      });

      if (loadedImages === images.length) {
        captureTicket();
      }
    }
  };

  const captureTicket = () => {
    const ticketElement = document.getElementById("ticket");
    html2canvas(ticketElement, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "Techember_Ticket.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const bookAnotherTicket = () => {
    setStep(0);
    setTicket(null);
    setFullName("");
    setEmail("");
    setAvatarUrl("");
    setProject("");
    setNumberOfSeats(1);
    setActiveIndex(null);
    setImage(null); // Reset image preview
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-[#0F252B] p-4 sm:p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          {steps[step]}
        </h2>
        <div className="w-full flex mb-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`h-1 w-1/3 ${i <= step ? "bg-blue-400" : "bg-gray-600"} mx-1 rounded-full`}
            ></div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="border border-[#0E464F] rounded-2xl p-4">
            {step === 0 && (
              <div>
                <div className="text-center text-white bg-[linear-gradient(135deg,#0E464F_20%,#07373F_30%)] border-[#0E464F] border-2 rounded-md w-full mx-auto my-4 p-4 sm:p-7">
                  <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl">Techember Fest &quot; 25</h1>
                  <p className="text-sm sm:text-base mt-2">
                    Join us for an unforgettable experience at <br /> Techember Fest! Secure your spot now.
                  </p>
                  <p className="text-sm sm:text-base mt-2">📍 Lagos Nigeria || March 15, 2025 | 7:00 PM</p>
                </div>

                <div className="border-2 border-[#07373F] rounded-md my-3 w-full md:w-[70%] mx-auto" />

                <div className="p-4">
                  <div className="my-2">
                    <h1 className="font-semibold text-lg sm:text-xl md:text-2xl text-white">Select Ticket Type:</h1>
                  </div>

                  <div className="grid border border-[#0E464F] rounded-2xl p-4 grid-cols-1 sm:grid-cols-2 gap-4">
                    {ticketOptions.map((ticket, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`border-2 cursor-pointer flex justify-between items-center p-4 rounded-md ${activeIndex === index ? 'bg-[#197686] text-white border-[#197686]' : 'border-[#0E464F] text-white'}`}
                      >
                        <div>
                          <p className="text-sm sm:text-base">{ticket.type}</p>
                          <h1 className="text-xs sm:text-sm">20 Left</h1>
                        </div>
                        <h1 className="border border-[#2BA4B9] rounded-md bg-[#0E464F] px-3 py-1 sm:px-4 sm:py-2 text-white text-sm sm:text-base">
                          {ticket.price}
                        </h1>
                      </div>
                    ))}
                  </div>

                  <div className="my-4">
                    <div className="my-2">
                      <h1 className="font-semibold text-lg sm:text-xl md:text-2xl text-white">Number Of Tickets</h1>
                    </div>
                    <select
                      value={numberOfSeats}
                      onChange={(e) => setNumberOfSeats(Number(e.target.value))}
                      className="border border-[#07373F] rounded-md px-4 py-2 w-full mx-auto block text-white bg-transparent focus:border-[#07373F] focus:ring-0"
                    >
                      <option value={1} className="bg-[#0F252B] text-white">1</option>
                      <option value={2} className="bg-[#0F252B] text-white">2</option>
                      <option value={3} className="bg-[#0F252B] text-white">3</option>
                      <option value={4} className="bg-[#0F252B] text-white">4</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row border py-2 rounded-lg border-[#07373f] justify-center gap-4 sm:gap-10 items-center my-6">
                    <button className="border-2 rounded-md py-2 px-8 sm:px-14 border-[#24A0B5] text-[#24A0B5] w-full sm:w-auto">
                      Cancel
                    </button>
                    <button
                      onClick={nextStep}
                      className="border-[#24A0B5] bg-[#24A0B5] border rounded-md py-2 px-8 sm:px-14 text-white w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="border border-[#0E464F] my-3 rounded-2xl px-2">
                  <h3 className="text-white mb-4 my-5">Upload Profile Photo</h3>
                  <div
                    className="mb-4 flex items-center justify-center border-[#0E464F] bg-[#0E464F] mx-auto w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-3xl border-2 p-6 text-white text-center cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    {image ? (
                      <Image src={image} alt="Uploaded" className="w-32 h-32 object-cover rounded-full" width={32} height={32} />
                    ) : (
                      <p>Drag & Drop or Click to <br /> Upload</p>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div className="border-2 border-[#07373F] rounded-md my-3 w-full md:w-[90%] mx-auto" />
                <label className="text-white" htmlFor="fullName">Enter Your Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg mt-4 mb-4 bg-transparent text-white border-[#07373F] focus:border-[#07373F] focus:outline-none border-2"
                  aria-describedby={errors.fullName ? "fullNameError" : undefined}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p id="fullNameError" className="text-red-500 text-sm mt-1">
                    {errors.fullName}
                  </p>
                )}
                <label className="text-white" htmlFor="email">Enter Your email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="hello@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg mt-4 mb-4 bg-transparent text-white border-[#07373F] focus:border-[#07373F] focus:outline-none border-2"
                  aria-describedby={errors.email ? "emailError" : undefined}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p id="emailError" className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
                <label className="text-white" htmlFor="project">Enter About the Project</label>
                <input
                  type="text"
                  id="project"
                  required
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full h-[100px] rounded-lg mt-4 mb-4 bg-transparent text-white border-[#07373F] focus:border-[#07373F] focus:outline-none border-2"
                  aria-describedby={errors.project ? "projectError" : undefined}
                  aria-invalid={!!errors.project}
                />
                {errors.project && (
                  <p id="projectError" className="text-red-500 text-sm mt-1">
                    {errors.project}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row border py-2 rounded-lg border-[#07373f] justify-center gap-4 sm:gap-10 items-center my-6">
                  <button className="border-2 rounded-md py-2 px-8 sm:px-14 border-[#24A0B5] text-[#24A0B5] w-full sm:w-auto">
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="border-[#24A0B5] bg-[#24A0B5] border rounded-md py-2 px-8 sm:px-14 text-white w-full sm:w-auto"
                  >
                    Get My Free Ticket
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-white">
                <div className="justify-center text-center">
                  <h1 className="font-bold text-[30px]">Your Ticket Is Booked!</h1>
                  <p className="font-semibold text-[15px] mt-4">
                    You can download or check your email for a copy
                  </p>
                </div>
                <div id="ticket" className="border-[2px] border-white bg-[#0E464F] rounded-lg p-6 mt-11 flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex-shrink-0">
                    <QRCode
                      value={JSON.stringify(ticket)}
                      size={200}
                      bgColor="#0E464F"
                      fgColor="#FFFFFF"
                      level="Q"
                    />
                  </div>
                  <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="font-bold text-2xl mb-2">Techember Fest &quot; 25</h1>
                    <p className="text-lg mb-2">📍 04 Rumens Road, Ikoyi, Lagos</p>
                    <p className="text-lg mb-4">📅 March 15, 2025 | 7:00 PM</p>
                    <div className="flex items-center justify-center sm:justify-start">
                      {avatarUrl && (
                        <Image
                          src={avatarUrl}
                          alt="User Avatar"
                          width={100}
                          height={100}
                          className="rounded-full"
                          crossOrigin="anonymous"
                        />
                      )}
                      <div className="ml-4">
                        <p className="text-lg font-semibold">{ticket?.fullName}</p>
                        <p className="text-sm">{ticket?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={downloadTicket}
                    className="bg-[#24A0B5] text-white px-6 py-2 rounded-md"
                  >
                    Download Ticket
                  </button>
                  <button
                    onClick={bookAnotherTicket}
                    className="bg-[#07373F] text-white px-6 py-2 rounded-md"
                  >
                    Book Another Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}