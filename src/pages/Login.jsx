import { useState } from "react";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const res = await API.post("/auth/login", formData);
      console.log("khlklkhlh");
      console.log("jgjggk", res.data); //دي صح
      console.log("jgjggkhghgfhgfh", res.data.data.token); //دي غلط بس بعملهم الاتنين للتجارب

      // localStorage.setItem("token", res.data); //دي صح
      localStorage.setItem("token", res.data.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      setError("Invalid Email Or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100  dark:bg-h
    zinc-900"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100  dark:bg-zinc-900 w-full max-w-md p-8 rounded-3xl shadow-lg "
      >
        <h1 className="text-4xl font-black text-center mb-8">
          Laundry Dashboard
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-4 rounded-2xl mb-5 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-4 rounded-2xl mb-5 outline-none"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-[#5B3DF5] text-white py-4 rounded-2xl"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        {/* Demo Account */}

        <button
          type="button"
          onClick={() => setShowDemo(!showDemo)}
          className="mt-4 text-sm text-[#5B3DF5] hover:underline"
        >
          {showDemo ? "Hide Demo Credentials" : "Show Demo Credentials"}
        </button>

        {showDemo && (
          <div className="mt-3 p-4 border rounded-xl bg-gray-50 text-black">
            <p>
              <strong>Email:</strong> info@laundry.com
            </p>
            <p>
              <strong>Password:</strong> 12345678
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
