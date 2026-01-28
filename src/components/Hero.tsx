import { Link } from "react-router-dom";
import { ArrowRight, Star, Smartphone, Headphones, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import mstarLogo from "@/assets/mstar-logo.png";

const Hero = () => {
  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center pt-24 md:pt-32 pb-12 md:pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-mstar-gold/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6">
              <Star className="h-3 w-3 md:h-4 md:w-4 text-accent fill-accent" />
              <span className="text-accent text-xs md:text-sm font-medium">We are the Quality</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4 md:mb-6">
              Welcome to{" "}
              <span className="text-gradient font-display">M STAR</span>
              <br />
              <span className="text-primary-foreground">MOBILE</span>
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/70 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
              Your trusted destination for the latest smartphones and mobile accessories. 
              Stay connected with the best in mobile technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-10 text-base">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <a href="#contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-10 text-base bg-white text-mstar-black hover:bg-white/90 font-semibold">
                  Contact Us
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-mstar-gray/20">
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent">10+</div>
                <div className="text-xs md:text-sm text-primary-foreground/60">Top Brands</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent">500+</div>
                <div className="text-xs md:text-sm text-primary-foreground/60">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent">5K+</div>
                <div className="text-xs md:text-sm text-primary-foreground/60">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Logo & Features */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-75" />
              
              {/* Logo Display */}
              <div className="relative bg-mstar-black/50 backdrop-blur-sm border border-mstar-gray/20 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-deep">
                <img 
                  src={mstarLogo} 
                  alt="MStar Mobile" 
                  className="w-40 md:w-64 h-auto animate-float"
                />
              </div>

              {/* Floating Cards - Hidden on small mobile */}
              <div className="hidden sm:flex absolute -top-4 -left-4 bg-card rounded-xl md:rounded-2xl p-3 md:p-4 shadow-elegant animate-float delay-100">
                <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              </div>
              <div className="hidden sm:flex absolute -bottom-4 -right-4 bg-card rounded-xl md:rounded-2xl p-3 md:p-4 shadow-elegant animate-float delay-200">
                <Headphones className="h-6 w-6 md:h-8 md:w-8 text-mstar-gold" />
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-8 bg-card rounded-2xl p-4 shadow-elegant animate-float delay-300">
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
