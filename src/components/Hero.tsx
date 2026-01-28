import { Link } from "react-router-dom";
import { ArrowRight, Star, Smartphone, Headphones, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import mstarLogo from "@/assets/mstar-logo.png";

const Hero = () => {
  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mstar-gold/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-accent text-sm font-medium">We are the Quality</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Welcome to{" "}
              <span className="text-gradient font-display">M STAR</span>
              <br />
              <span className="text-primary-foreground">MOBILE</span>
            </h1>

            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Your trusted destination for the latest smartphones and mobile accessories. 
              Stay connected with the best in mobile technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/dashboard">
                <Button variant="accent" size="xl">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#contact">
                <Button size="xl" className="bg-white text-mstar-black hover:bg-white/90 font-semibold">
                  Contact Us
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-mstar-gray/20">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-accent">10+</div>
                <div className="text-sm text-primary-foreground/60">Top Brands</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-accent">500+</div>
                <div className="text-sm text-primary-foreground/60">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-accent">5K+</div>
                <div className="text-sm text-primary-foreground/60">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Logo & Features */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-75" />
              
              {/* Logo Display */}
              <div className="relative bg-mstar-black/50 backdrop-blur-sm border border-mstar-gray/20 rounded-3xl p-12 shadow-deep">
                <img 
                  src={mstarLogo} 
                  alt="MStar Mobile" 
                  className="w-64 h-auto animate-float"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card rounded-2xl p-4 shadow-elegant animate-float delay-100">
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl p-4 shadow-elegant animate-float delay-200">
                <Headphones className="h-8 w-8 text-mstar-gold" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-card rounded-2xl p-4 shadow-elegant animate-float delay-300">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
