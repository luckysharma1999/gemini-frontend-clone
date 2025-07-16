import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { FcGoogle } from "react-icons/fc";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  country: z.string().min(1, "Select country"),
  phone: z.string().min(10, "Phone number too short"),
  otp: z.string().optional(),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otpSent, setOtpSent] = useState(false);
  const [countries, setCountries] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    const user = localStorage.getItem("user");

    if (isAuth && user) {
      navigate("/app");
    }
  }, []);
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((res) => {
        const data = res.data
          .map((c) => ({
            name: c.name.common,
            code: c.idd?.root + (c.idd?.suffixes?.[0] || ""),
          }))
          .filter((c) => c.code)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(data);
      })
      .catch(() => toast.error("Failed to load country codes"));
  }, []);

  const onSubmit = (data) => {
    if (!otpSent) {
      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      localStorage.setItem("generatedOtp", generatedOtp);
      toast.success(`OTP sent: ${generatedOtp}`);
      setOtpSent(true);
    } else {
      const storedOtp = localStorage.getItem("generatedOtp");

      if (data.otp === storedOtp) {
        toast("Verifying", { autoClose: 2000 });
        setTimeout(() => {
          const userData = {
            name: data.name,
            country: data.country,
            phone: data.phone,
          };
          localStorage.setItem("isAuth", "true");
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.removeItem("generatedOtp");
          dispatch(loginSuccess(userData));
          toast.success("OTP verified. Login successful.");
          navigate("/app");
        }, 3000);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)?.[0]?.message;
    if (firstError) toast.error(firstError);
  };

  return (
    <div className="-full max-w-sm mx-auto mt-24  text-white flex flex-col content-center justify-center ">
      <h2 className="text-3xl font-bold text-neutral-400 mb-4 self-center flex items-center gap-2">
        Gemini Clone.....
        <FcGoogle />
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-full max-w-sm mx-auto mt-24 flex flex-col gap-4 bg-neutral-800 p-6 rounded-2xl shadow-lg text-white"
      >
        <h2 className="text-2xl font-semibold text-center">Login with OTP</h2>

        <input
          type="text"
          placeholder="Enter your name"
          {...register("name")}
          className="p-2 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          {...register("country")}
          className="p-2 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.name} value={c.code}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Phone number"
          {...register("phone")}
          className="p-2 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            {...register("otp")}
            className="p-2 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <button
          type="submit"
          className="bg-neutral-800 hover:bg-neutral-950 transition-all p-2 rounded font-semibold text-white"
        >
          {otpSent ? "Verify OTP" : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default Login;
