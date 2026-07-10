import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flower2, Check, CalendarCheck, Clock, Stethoscope, ArrowLeft, Heart, Sparkles } from "lucide-react";

// Fallback placeholder photo path — replace with your own default image.
const DEFAULT_DOCTOR_IMG = "/doctors/placeholder.png";

function DetailRow({ icon, label, value, last }) {
  return (
    <div className={`flex items-center gap-3 py-3.5 ${!last ? "border-b border-pink-50" : ""}`}>
      <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-sm text-slate-400 w-20 shrink-0">{label}</p>
      <p className="text-sm font-bold text-violet-900">{value}</p>
    </div>
  );
}

export default function BookingConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Data handed off from Doctors.jsx's navigate("/booking-confirmed", { state: {...} }).
  // Falls back to a demo doctor if this page is opened directly without state.
  const doctor = state?.doctor ?? { name: "Dr. Priya Sharma", specialty: "Gynecologist", img: DEFAULT_DOCTOR_IMG };
  const date = state?.date ?? "July 12, 2026";
  const time = state?.time ?? "11:00 AM";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Flower2 className="w-6 h-6 text-pink-500" fill="currentColor" />
          <span className="text-xl font-extrabold text-violet-900 tracking-tight">HerWellness</span>
        </div>

        <div className="bg-gradient-to-b from-pink-50/60 to-white rounded-3xl border border-pink-100 p-6 sm:p-8">
          {/* success icon */}
          <div className="relative flex flex-col items-center text-center mb-2">
            <Sparkles className="absolute -top-1 left-6 w-4 h-4 text-pink-300" />
            <Sparkles className="absolute top-2 right-4 w-3 h-3 text-violet-300" />
            <Sparkles className="absolute top-10 right-10 w-2.5 h-2.5 text-violet-300" />

            <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-200">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-violet-900">
              Appointment <span className="text-pink-500">booked!</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-xs">
              Your consultation has been successfully scheduled. We're here to support your wellness journey.
            </p>
          </div>

          {/* appointment details card */}
          <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-pink-500" />
              </div>
              <h2 className="font-bold text-violet-900 text-sm">Appointment Details</h2>
            </div>

            <div className="flex items-center gap-3 pb-4 mb-1 border-b border-pink-50">
              <img
                src={doctor.img || DEFAULT_DOCTOR_IMG}
                alt={doctor.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-100"
              />
              <div>
                <p className="font-bold text-violet-900 text-sm">{doctor.name}</p>
                <span className="inline-block text-[11px] font-semibold text-pink-600 bg-pink-100 px-2.5 py-0.5 rounded-full mt-1">
                  {doctor.specialty}
                </span>
              </div>
            </div>

            <DetailRow
              icon={<CalendarCheck className="w-4 h-4 text-pink-500" />}
              label="Date"
              value={date}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4 text-violet-600" />}
              label="Time"
              value={time}
            />
            <DetailRow
              icon={<Stethoscope className="w-4 h-4 text-violet-600" />}
              label="Specialty"
              value={doctor.specialty}
              last
            />
          </div>

          {/* buttons */}
          <button className="w-full mt-5 border-2 border-violet-200 text-violet-700 font-semibold text-sm py-3 rounded-full flex items-center justify-center gap-2 hover:bg-violet-50 transition-colors">
            <CalendarCheck className="w-4 h-4" /> Add to Calendar
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-md shadow-pink-200 hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          {/* reminder note */}
          <div className="flex items-center gap-4 bg-pink-50 rounded-2xl p-4 mt-6">
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold text-violet-900 leading-snug">
                We've sent a reminder to help you stay on track!
              </p>
              <p className="text-xs text-slate-500 mt-1">
                You'll receive a reminder before your appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}