import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import HomeNavBar from "@/components/HomeNavBar";

const Home = () => {
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

  const [activeSection, setActiveSection] = useState("hero");

  const handleScroll = () => {
    const sections = ["hero", "features", "how-it-works", "cta"];
    const currentIndex = sections.indexOf(activeSection);
    const nextSection = sections[currentIndex + 1];
    if (nextSection) {
      setActiveSection(nextSection);
      scrollToSection(nextSection);
    }
  };

  return (
<div className="min-h-screen flex flex-col overflow-x-hidden">
  <HomeNavBar />

  {/* Hero Section */}
  <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative bg-slate-900 text-gray-50">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-primary reveal-on-scroll">ParkEase</h1>
      <p className="text-xl mb-8 reveal-on-scroll">
        Modern parking management solution for efficient vehicle tracking and space optimization
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-on-scroll">
        <Button asChild size="lg" className="bg-primary">
          <Link to="/login">Get Started</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => scrollToSection("features")}
        >
          Learn More
        </Button>
      </div>
    </div>
    <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full p-2 scroll-button"
        onClick={handleScroll}
      >
        <ChevronDown className="h-10 w-10 text-primary cursor-pointer" />
      </Button>
    </div>
  </section>
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold mb-12 text-center reveal-on-scroll">Key Features</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          title: "Real-time Tracking",
          description: "Monitor all parking spaces in real-time with accurate vehicle entry and exit tracking.",
        },
        {
          title: "Smart Reservations",
          description: "Allow customers to reserve parking spots in advance to ensure availability.",
        },
        {
          title: "Analytics Dashboard",
          description: "Comprehensive analytics and reporting tools to optimize parking operations.",
        },
      ].map((feature, index) => (
        <Card key={index} className="opacity-0 reveal-on-scroll transition-all duration-700 delay-300">
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  {/* Key Features Section End */}
  <section id="features" className="max-w-6xl mx-auto py-20">
    <h2 className="text-4xl font-bold mb-12 text-center reveal-on-scroll">Key Features</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          title: "Real-time Tracking",
          description: "Monitor all parking spaces in real-time with accurate vehicle entry and exit tracking.",
        },
        {
          title: "Smart Reservations",
          description: "Allow customers to reserve parking spots in advance to ensure availability.",
        },
        {
          title: "Analytics Dashboard",
          description: "Comprehensive analytics and reporting tools to optimize parking operations.",
        },
      ].map((feature, index) => (
        <Card key={index} className="opacity-0 reveal-on-scroll transition-all duration-700 delay-300">
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
  {/* How It Works Section Start */}
  <section id="how-it-works" className="max-w-6xl mx-auto py-20">
    <h2 className="text-4xl font-bold mb-12 text-center reveal-on-scroll">How It Works</h2>
    <div className="space-y-16">
      {[
        {
          title: "Vehicle Entry",
          description: "Attendants record vehicle details upon entry, assigning available parking slots automatically.",
        },
        {
          title: "Space Management",
          description: "System optimizes parking space allocation based on vehicle size and duration of stay.",
        },
        {
          title: "Payment Processing",
          description: "Automated fee calculation based on parking duration, with multiple payment options.",
        },
      ].map((step, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center opacity-0 reveal-on-scroll transition-all duration-700`}
        >
          <div className="flex-1 bg-muted h-64 rounded-lg flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">{index + 1}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-lg">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
  </div>
  );
}

export default Home;