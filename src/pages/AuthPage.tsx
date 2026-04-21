import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Smartphone } from "lucide-react";
import mstarLogo from "@/assets/mstar-logo.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gender: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    } else {
      if (!form.full_name || !form.phone || !form.address || !form.city) {
        toast({ title: "Missing Info", description: "Please fill all required fields.", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, {
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        gender: form.gender,
      });
      if (error) {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome to MStar! 🌟", description: "Your account has been created." });
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={mstarLogo} alt="MStar Mobile" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-primary-foreground/60 text-sm mt-1">
            {isLogin ? "Sign in to access your dashboard" : "Fill in your details to get started"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-deep space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                <Input
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={(e) => updateForm("full_name", e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone Number *</label>
                <Input
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Address *</label>
                <Input
                  placeholder="Your full address"
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">City *</label>
                  <Input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">State</label>
                  <Input
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Pincode</label>
                  <Input
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={(e) => updateForm("pincode", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => updateForm("gender", e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateForm("password", e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-accent hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-primary-foreground/40 text-xs mt-6">
          Powered by Dami AI
        </p>
      </div>
    </div>
  );
};

export default AuthPage;