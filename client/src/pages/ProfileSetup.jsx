import { useState  } from "react";
import { useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import {
  User,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Target,
  CheckCircle,
  Rocket,
  X,
  LayoutDashboard
} from "lucide-react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Link } from "react-router-dom";
export default function ProfileSetup() {
  const [index, setIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
 const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
        setIsEdit(true);
        //setLoading(false);
        return;
      }

    const res = await fetch("http://localhost:8000/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setIsEdit(true);
      return;
    }

    const data = await res.json();

    if (data?.profile) {
      setFormData(data?.profile?.data || {});
      setIsEdit(false);
    } else {
      
      setIsEdit(true);
    }
  } catch (err) {
    console.log(err);
    setIsEdit(true);
  }
};
useEffect(() => {
  const local = localStorage.getItem("profile");

  if (local) {
    setFormData(JSON.parse(local));
    setIsEdit(false);
  }

  // then try backend
  fetchProfile();
}, []);

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);
    const res = await fetch("http://localhost:8000/api/profile/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role:
          index === 0
            ? "student"
            : index === 1
            ? "professional"
            : "worker",
        data: formData,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Save failed ❌");
      return;
    }

    // ✅ IMPORTANT: update state with saved data
    setFormData(data.profile.data || formData);

    setShowSuccess(true);
    setIsEdit(false);

  } catch (err) {
    console.log(err);
  }
};

  const handlers = useSwipeable({
    onSwipedLeft: () => index < 2 && setIndex(index + 1),
    onSwipedRight: () => index > 0 && setIndex(index - 1),
    trackMouse: true,
  });

  if (!isEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f0f1a] to-black text-white relative">
        
        {/* SUCCESS NOTIFICATION */}
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
             <div className="w-full max-w-lg bg-[#0a101f] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 blur-[60px]" />
                
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                   <Rocket size={40} className="animate-bounce" />
                </div>

                <div className="space-y-4">
                   <h3 className="text-3xl font-black tracking-tight text-white uppercase italic">Profile Initialized!</h3>
                   <p className="text-white/40 font-medium leading-relaxed">
                     Your professional vector has been saved. We've updated your recommendations based on your new skills.
                   </p>
                </div>

                <div className="w-full pt-4 space-y-3 px-6">
                   <Link 
                     to="/dashboard"
                     className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10"
                   >
                     Enter Dashboard
                     <LayoutDashboard size={16} />
                 </Link>
                 <button 
                   onClick={() => setShowSuccess(false)}
                   className="w-full py-3.5 bg-white/5 text-white/50 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all font-bold border border-white/5"
                 >
                   Stay on Profile
                 </button>
              </div>
           </div>
        </div>
      )}

        <div className="w-[800px] p-6 rounded-3xl bg-white/5 border border-white/10">

          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

          <div className="grid grid-cols-2 gap-4">

            {Object.entries(formData || {}).map(([key, value]) => (
              <div key={key} className="bg-white/5 p-3 rounded-xl">
                <p className="text-gray-400 text-xs">{key}</p>
                <p>{value || "-"}</p>
              </div>
            ))}

          </div>

          <button
            onClick={() => setIsEdit(true)}
            className="mt-6 w-full bg-yellow-500 py-3 rounded-xl"
          >
            Edit Profile
          </button>

        </div>
      </div>
    );
  }

  // function LocationInput({ value, onChange }) {
  // const [autocomplete, setAutocomplete] = useState(null);

  // const onLoad = (autoC) => setAutocomplete(autoC);

  // const onPlaceChanged = () => {
  //   if (autocomplete) {
  //     const place = autocomplete.getPlace();
  //     const address = place.formatted_address;
  //     onChange(address);
  //   }
  // };

  const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // optional: store file or name
  setFormData((prev) => ({
    ...prev,
    resume: file,
  }));

  console.log("Uploaded:", file);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f0f1a] to-black text-white">

      <div
        {...handlers}
        className="w-[800px] max-w-[95%] h-[680px] max-h-[92vh] rounded-3xl p-6 
        bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
      >

        {/* TABS */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
          {["Student", "Professional", "Worker"].map((tab, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`flex-1 py-2 rounded-lg text-sm transition
                ${index === i
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "text-gray-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SLIDER */}
        <div
          className="flex transition-transform duration-500 h-[calc(100%-70px)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >

          {/* STUDENT */}
          <FormWrapper title="Student Profile" onSubmit={handleSubmit}>
            <Full><Input icon={<User />} value={formData.name} placeholder="Full Name" onChange={(e)=>handleChange("name",e.target.value)} /></Full>

            <Input icon={<Phone />} value={formData.phone} placeholder="Phone" onChange={(e)=>handleChange("phone",e.target.value)} />
            <Input icon={<MapPin />} value={formData.location} placeholder="Location" onChange={(e)=>handleChange("location",e.target.value)} />

            <Full><Input icon={<GraduationCap />} value={formData.college} placeholder="College" onChange={(e)=>handleChange("college",e.target.value)} /></Full>

            <Input icon={<BookOpen />} value={formData.degree} placeholder="Degree" onChange={(e)=>handleChange("degree",e.target.value)} />

            <Select options={["Year","1st","2nd","3rd","4th"]} onChange={(v)=>handleChange("year",v)} />

            <Full><Input icon={<Target />} value={formData.interests} placeholder="Interests" onChange={(e)=>handleChange("interests",e.target.value)} /></Full>
            <Full><Input icon={<Target />} value={formData.skills} placeholder="Skills (comma separated)" onChange={(e)=>handleChange("skills",e.target.value)} /></Full>
            <Full><Input icon={<Target />} value={formData.goal} placeholder="Career Goal" onChange={(e)=>handleChange("goal",e.target.value)} /></Full>

            <Full>
              <label className="text-sm text-gray-400 mb-1">Upload Resume </label>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                onChange={(e) => handleFileUpload(e)}
              />
            </Full>

          </FormWrapper>

          


          {/* PROFESSIONAL */}
          <FormWrapper title="Professional Profile" onSubmit={handleSubmit}>
            <Full><Input icon={<User />} value={formData.name} placeholder="Full Name" onChange={(e)=>handleChange("name",e.target.value)} /></Full>

            <Input icon={<Phone />} value={formData.phone} placeholder="Phone" onChange={(e)=>handleChange("phone",e.target.value)} />
            <Input icon={<MapPin />} value={formData.location} placeholder="Location" onChange={(e)=>handleChange("location",e.target.value)} />

            <Full><Input icon={<BookOpen />} value={formData.lang} placeholder="Language" onChange={(e)=>handleChange("lang",e.target.value)} /></Full>

            <Input icon={<BookOpen />} value={formData.role} placeholder="Role" onChange={(e)=>handleChange("role",e.target.value)} />
            <Input icon={<Target />} value={formData.exp} placeholder="Experience" onChange={(e)=>handleChange("exp",e.target.value)} />

            <Full><Input icon={<BookOpen />} value={formData.company} placeholder="Company" onChange={(e)=>handleChange("company",e.target.value)} /></Full>

            <Full><Input icon={<Target />} value={formData.skills} placeholder="Skills" onChange={(e)=>handleChange("skills",e.target.value)} /></Full>

            <Input icon={<Target />} value={formData.salary} placeholder="Salary" onChange={(e)=>handleChange("salary",e.target.value)} />

            <Select options={["Career Goal","Switch","Growth"]} onChange={(v)=>handleChange("goal",v)} />

            <Full>
              <label className="text-sm text-gray-400 mb-1">Upload Resume (Optional)</label>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                onChange={(e) => handleFileUpload(e)}
              />
            </Full>

          </FormWrapper>

          {/* WORKER */}
          <FormWrapper title="Worker Profile" onSubmit={handleSubmit}>
            <Full><Input icon={<User />} value={formData.name} placeholder="Full Name" onChange={(e)=>handleChange("name",e.target.value)} /></Full>

            <Input icon={<Phone />} value={formData.phone} placeholder="Phone" onChange={(e)=>handleChange("phone",e.target.value)} />
            <Input icon={<MapPin />} value={formData.location} placeholder="Location" onChange={(e)=>handleChange("location",e.target.value)} />

            <Full><Input icon={<BookOpen />} value={formData.lang} placeholder="Language" onChange={(e)=>handleChange("lang",e.target.value)} /></Full>

            <Select value={formData.skill}  options={["Skill Type","Electrician","Driver","Plumber"]} onChange={(v)=>handleChange("skill",v)} />
            <Select  value={formData.exp} options={["Experience","Beginner","Intermediate","Expert"]} onChange={(v)=>handleChange("exp",v)} />

            <Full><Input icon={<Target />} value={formData.skills} placeholder="Skills" onChange={(e)=>handleChange("skills",e.target.value)} /></Full>

            <Input icon={<BookOpen />} value={formData.tools} placeholder="Tools" onChange={(e)=>handleChange("tools",e.target.value)} />

            <Select value={formData.work} options={["Work Type","Daily","Contract","Full-time"]} onChange={(v)=>handleChange("work",v)} />

            <Full><Input icon={<MapPin />} value={formData.radius} placeholder="Work Radius" onChange={(e)=>handleChange("radius",e.target.value)} /></Full>

            <Full><input type="file" className="input" /></Full>
          </FormWrapper>

        </div>
      </div>

      {/* 🔥 SCROLLBAR + INPUT STYLE */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7c3aed, #3b82f6);
          border-radius: 10px;
        }

        .input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 12px;
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          color: #d1d5db;
          font-size: 14px;
        }

        .input:focus {
          outline: none;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}

/* WRAPPER */
function FormWrapper({ title, children, onSubmit }) {
  return (
    <div className="min-w-full px-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="flex-1 overflow-y-auto pr-2 custom-scroll min-h-0">
        <div className="grid grid-cols-2 gap-4">{children}</div>
      </div>

      <div className="pt-4 bg-gradient-to-t from-black/40">
        <button onClick={onSubmit} className="w-full bg-green-500 py-3 rounded-xl font-semibold">
          Save Profile
        </button>
      </div>
    </div>
  );
}

function Full({ children }) {
  return <div className="col-span-2">{children}</div>;
}

function Input({ icon, value, placeholder, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
      <div className="text-gray-400">{icon}</div>
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        className="bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
      />
    </div>
  );
}

/* 🔥 CUSTOM SELECT */
function Select({ options,value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value  || ""}
        onChange={(e)=>onChange(e.target.value)}
        className="input appearance-none pr-8"
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        ▼
      </div>
    </div>
  );
}

