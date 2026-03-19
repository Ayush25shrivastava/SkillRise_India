import Silk from "@/components/silk";
import { useNavigate } from "react-router-dom";
import TextType from "@/components/TextType";

export default function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* BACKGROUND ANIMATION */}
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#1a3165"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* CONTENT */}
      <div className="relative flex flex-col items-center justify-center h-full text-center px-6 text-white">

        

        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-3 bg-blue text-white-bold rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>

      </div>

    </div>
  );
}