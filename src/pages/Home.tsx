
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import HomeNavBar from "@/components/HomeNavBar";
import { useParking } from "@/context/parking";

const Home = () => {
  const { theme } = useParking();

  useEffect(() => {
    // Reveal sections on scroll
    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => el.classList.add("opacity-0"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    hiddenElements.forEach((el) => observer.observe(el));

    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <HomeNavBar />

      {/* Hero Section */}
      <section id="hero" className={`min-h-screen flex flex-col items-center justify-center text-center px-4 relative ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-5xl font-bold mb-6 reveal-on-scroll ${theme === "dark" ? "text-red-500" : "text-red-900"}`}>ParkEase</h1>
          <p className={`text-2xl mb-8 reveal-on-scroll font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            Modern parking management solution for efficient vehicle tracking and space optimization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-on-scroll">
            <Button asChild size="lg" className={theme === "dark" ? "bg-purple-600" : "bg-purple-700"}>
              <Link to="/login">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("features")}
              className={theme === "dark" ? "border-gray-600 text-gray-300" : ""}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
          <Button variant="ghost" size="icon" onClick={() => scrollToSection("features")}>
            <ChevronDown className={`h-10 w-10 cursor-pointer ${theme === "dark" ? "text-red-500" : "text-primary"}`} />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 min-h-screen flex flex-col items-center justify-center ${theme === "dark" ? "bg-indigo-900" : "bg-indigo-200"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 text-center reveal-on-scroll ${theme === "dark" ? "text-gray-200" : ""}`}>Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Real-time Tracking",
                description:
                  "Monitor all parking spaces in real-time with accurate vehicle entry and exit tracking.",
                icon: "📍",
              },
              {
                title: "Smart Reservations",
                description:
                  "Allow customers to reserve parking spots in advance to ensure availability.",
                icon: "🗓️",
              },
              {
                title: "Analytics Dashboard",
                description:
                  "Comprehensive analytics and reporting tools to optimize parking operations.",
                icon: "📊",
              },
              {
                title: "Secure Access",
                description: "Ensure authorized entry with role-based access controls.",
                icon: "🔐",
              },
              {
                title: "Fast Check-in",
                description: "Reduce wait times with QR-based or license-plate check-in.",
                icon: "⚡",
              },
              {
                title: "Cloud Synced",
                description: "Access the system from anywhere with real-time cloud sync.",
                icon: "🌐",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`opacity-0 reveal-on-scroll flex items-start rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${
                  theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white"
                }`}
              >
                {/* Icon Container */}
                <div className="text-4xl mr-6 select-none">{feature.icon}</div>

                {/* Text Content */}
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-green-400" : "text-primary text-green-900"
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-base leading-relaxed ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 px-4 min-h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-slate-900" : "bg-white"
      }`}>
        <div className="max-w-6xl mx-auto text-red-900">
          <h2 className={`text-4xl font-bold mb-12 text-center reveal-on-scroll relative inline-block after:block after:h-1 after:bg-primary after:w-16 after:mx-auto after:mt-2 ${
            theme === "dark" ? "text-red-400" : ""
          }`}>
            How It Works
          </h2>

          <div className="space-y-16">
            {[
              {
                title: "Vehicle Entry",
                description:
                  "Attendants record vehicle details upon entry, assigning available parking slots automatically.",
              },
              {
                title: "Space Management",
                description:
                  "System optimizes parking space allocation based on vehicle size and duration of stay.",
              },
              {
                title: "Payment Processing",
                description:
                  "Automated fee calculation based on parking duration, with multiple payment options.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center opacity-0 reveal-on-scroll transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary hover: ring-green-100/30 rounded-xl p-4 group ${
                  theme === "dark" ? "hover:bg-slate-800" : ""
                }`}
              >
                {/* Visual Number Block */}
                <div className={`flex-1 h-64 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-400 ${
                  theme === "dark" ? "bg-gradient-to-br from-primary/20 to-primary/10" : "bg-gradient-to-br from-primary/10 to-primary/5"
                }`}>
                  <span className={`text-6xl font-extrabold drop-shadow-sm ${
                    theme === "dark" ? "text-primary/60" : "text-primary/40"
                  }`}>
                    {index + 1}
                  </span>
                </div>

                {/* Step Text Content */}
                <div className="flex-1 transition-all duration-300 ease-in-out">
                  <h3 className={`text-2xl font-bold mb-4 group-hover:text-primary transition-colors ${
                    theme === "dark" ? "text-green-400" : "text-green-900"
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-lg ${
                    theme === "dark" ? "text-gray-300 group-hover:text-gray-200" : "text-gray-700 group-hover:text-gray-900"
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className={`relative h-96 py-20 px-4 min-h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-gradient-to-r from-red-900/70 to-indigo-900/70 text-white" : "bg-gradient-to-r from-red-900 to-indigo-600 text-white"
      }`}>
        <div className="max-w-4xl mx-auto text-center opacity-0 reveal-on-scroll transition-all duration-700">
          <h2 className={`text-4xl font-bold mb-6 ${
            theme === "dark" ? "text-gray-200" : "text-slate-900"
          }`}>Ready to optimize your parking management?</h2>
          <p className={`text-xl mb-8 ${
            theme === "dark" ? "text-gray-300" : "text-slate-500"
          }`}>
            Join thousands of facilities worldwide using ParkEase to streamline their operations.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/login">Sign In Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
