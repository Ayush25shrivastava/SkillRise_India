import { useState, useEffect } from "react";
import StudentForm from "../components/StudentForm";
import ProfessionalForm from "../components/ProfessionalForm";
import WorkerForm from "../components/WorkerForm";
import { createProfile } from "../services/profileService";
import Stepper from "../components/Stepper";

import { useNavigate, useLocation  } from "react-router-dom";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
//   const totalFields = 8;
// const filled = Object.values(user.profile || {}).filter(Boolean).length;

// const completion = Math.round((filled / totalFields) * 100);
//{/* <p className="mt-4">Profile Completion: {completion}%</p> */}
  const handleSubmit = async () => {
  try {
    const email = localStorage.getItem("email"); // or decode from token

    await createProfile({
      email,
      userType,
      ...formData,
    });
    navigate("/profile/dashboard"); // 🔥 redirect
    alert("Profile Saved ✅");
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (location.state) {
    const user = location.state;

    setUserType(user.userType);
    setFormData({ ...user.profile, name: user.name, location: user.location });
    setStep(2);
  }
}, [location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      <div className="w-[600px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <Stepper step={step} />
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center mb-6">
              Who are you?
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {["student", "professional", "worker"].map((type) => (
                <div
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`p-4 rounded-xl cursor-pointer text-center border 
                  ${userType === type ? "border-blue-400 bg-blue-500/20" : "border-white/20"}`}
                >
                  {type.toUpperCase()}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-purple-600 py-2 rounded-lg"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
  <>
    {userType === "student" && (
      <StudentForm formData={formData} setFormData={setFormData} />
    )}
    {userType === "professional" && (
      <ProfessionalForm formData={formData} setFormData={setFormData} />
    )}
    {userType === "worker" && (
      <WorkerForm formData={formData} setFormData={setFormData} />
    )}

    <div className="flex gap-4 mt-6">
      <button
        onClick={() => setStep(1)}
        className="w-1/2 bg-gray-500 py-2 rounded-lg"
      >
        Back
      </button>

      <button
        onClick={handleSubmit}
        className="w-1/2 bg-green-500 py-2 rounded-lg"
      >
        Submit Profile
      </button>
    </div>
  </>
)}
      </div>
    </div>
  );
}