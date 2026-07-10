import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Stethoscope, Activity, MessageCircle, Filter, Heart, ChevronDown,
  ArrowRight, ShieldCheck,
} from "lucide-react";

/* Swap these src values with your own images — everywhere an <img> tag
   appears below is a placeholder ready for your real photo/illustration. */
const doctors = [
  {
    id: 1, name: "Dr. Priya Sharma", specialty: "Gynecologist", category: "gynecologist",
    qualification: "MBBS, DGO", experience: "12+ years experience",
    languages: "English, Hindi", slotDate: "July 12, 2026", slotTime: "11:00 AM",
    img: "/assets/doctor.jpg",
  },
  {
    id: 2, name: "Dr. Ananya Verma", specialty: "Gynecologist", category: "gynecologist",
    qualification: "MBBS, MS (OBG)", experience: "9+ years experience",
    languages: "English, Hindi, Punjabi", slotDate: "July 12, 2026", slotTime: "02:00 PM",
    img: "/assets/doctor1.jpg",
  },
  {
    id: 3, name: "Dr. Neha Batra", specialty: "Endocrinologist", category: "endocrinologist",
    qualification: "MD (Endocrinology)", experience: "10+ years experience",
    languages: "English, Hindi", slotDate: "July 15, 2026", slotTime: "10:30 AM",
    img: "/assets/doctor2.jpg",
  },
  {
    id: 4, name: "Dr. Ritu Malhotra", specialty: "Endocrinologist", category: "endocrinologist",
    qualification: "DM (Endocrinology)", experience: "14+ years experience",
    languages: "English, Hindi, Gujarati", slotDate: "July 15, 2026", slotTime: "03:30 PM",
    img: "/assets/doctor3.jpg",
  },
  {
    id: 5, name: "Ms. Kavya Mehra", specialty: "Counselor", category: "counselor",
    qualification: "MA Psychology", experience: "7+ years experience",
    languages: "English, Hindi", slotDate: "July 18, 2026", slotTime: "11:00 AM",
    img: "/assets/doctor4.jpg",
  },
  {
    id: 6, name: "Ms. Simran Kaur", specialty: "Counselor", category: "counselor",
    qualification: "MA Psychology", experience: "6+ years experience",
    languages: "English, Hindi, Punjabi", slotDate: "July 18, 2026", slotTime: "04:00 PM",
    img: "/assets/doctor2.jpg",
  },
];

const tabs = [
  { key: "all", label: "All Doctors", icon: Users },
  { key: "gynecologist", label: "Gynecologists", icon: Stethoscope },
  { key: "endocrinologist", label: "Endocrinologists", icon: Activity },
  { key: "counselor", label: "Counselors", icon: MessageCircle },
];

const specialtyStyle = {
  Gynecologist: "bg-pink-100 text-pink-600",
  Endocrinologist: "bg-purple-100 text-purple-600",
  Counselor: "bg-purple-100 text-purple-600",
};

function DoctorCard({ doc, favorited, onToggleFavorite }) {
  const navigate = useNavigate();

  // This is the hand-off: whatever we pass in `state` here is exactly what
  // BookingConfirm.jsx reads via useLocation().state on the other side.
  const bookConsultation = () => {
    navigate("/booking-confirm", {
      state: {
        doctor: {
          name: doc.name,
          specialty: doc.specialty,
          img: doc.img,
        },
        date: doc.slotDate,
        time: doc.slotTime,
      },
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
      <div className="flex items-start gap-4">
        <img
          src={doc.img}
          alt={doc.name}
          className="w-16 h-16 rounded-full object-cover bg-pink-50 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-semibold text-purple-900 text-base">{doc.name}</h3>
            <button onClick={() => onToggleFavorite(doc.id)} className="text-purple-300 flex-shrink-0">
              <Heart size={20} fill={favorited ? "#F0609A" : "none"} className={favorited ? "text-pink-500" : ""} />
            </button>
          </div>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${specialtyStyle[doc.specialty]}`}>
            {doc.specialty}
          </span>
          <p className="text-sm text-purple-900 font-medium mt-2 mb-0">{doc.qualification}</p>
          <p className="text-sm text-purple-400 mt-0">{doc.experience}</p>
          <p className="text-xs text-purple-400">Languages: {doc.languages}</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-purple-400 block mb-1.5">Available Slots</label>
        <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-pink-100 bg-pink-50/40 text-sm text-purple-800 font-medium">
          <span>{doc.slotDate} <span className="text-purple-300 mx-1">•</span> {doc.slotTime}</span>
          <ChevronDown size={16} className="text-purple-400" />
        </button>
      </div>

      <button
        onClick={bookConsultation}
        className="w-full mt-4 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 shadow hover:opacity-90 active:scale-[0.99] transition"
      >
        Book Consultation <ArrowRight size={17} />
      </button>
    </div>
  );
}

export default function Doctors() {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const filteredDoctors = useMemo(
    () => (activeTab === "all" ? doctors : doctors.filter((d) => d.category === activeTab)),
    [activeTab]
  );

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-purple-950 pb-10">
      {/* Top bar */}
     <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-2 flex items-center justify-between">
  {/* Left side: Your Logo in a circle */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-200 shadow-sm flex-shrink-0">
      <img 
        src="/assets/logo.jpg" // Yahan apni image ka path daalein
        alt="HerWellness Logo" 
        className="w-full h-full object-cover"
      />
    </div>
    <span className="font-serif font-semibold text-lg text-purple-900">
      HerCare
    </span>
  </div>
</div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-6 sm:p-8 flex items-center justify-between gap-5 mb-6 mt-2 overflow-hidden flex-wrap sm:flex-nowrap">
          <img
            src="/assets/doctor.jpg"
            alt="Doctor illustration"
            className="w-36 h-36 sm:w-44 sm:h-44 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-[220px]">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-purple-900 mb-2">
              Find Your <span className="text-pink-500">Care Partner</span>
            </h1>
            <p className="text-sm sm:text-base text-purple-700/80 leading-snug max-w-md">
              Book a consultation with trusted experts who care for you.
            </p>
          </div>
          <img
            src="/assets/sethoscope.jpg"
            alt=""
            aria-hidden="true"
            className="hidden md:block w-20 h-20 object-contain flex-shrink-0"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition ${
                  activeTab === key
                    ? "text-pink-600 border-pink-500"
                    : "text-purple-400 border-transparent hover:text-purple-600"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-pink-100 bg-white text-sm font-semibold text-purple-700 shadow-sm">
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Doctor cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doc={doc} favorited={favorites.includes(doc.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>

        {/* Footer trust banner */}
        <div className="rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-6 flex items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-600 flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="font-serif font-semibold text-purple-900 m-0">All doctors are verified professionals.</p>
            <p className="text-sm text-purple-600/80 m-0">Your health is in safe hands.</p>
          </div>
        </div>
      </div>
    </div>
  );
}