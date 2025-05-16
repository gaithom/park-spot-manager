
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import HomeNavBar from "@/components/HomeNavBar";

const Home = () => {
  useEffect(() => {
    // Initialize all sections to be invisible
    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => {
      el.classList.add("opacity-0");
    });

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

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      
      // Ensure the element is visible after scrolling
      setTimeout(() => {
        const revealElements = element.querySelectorAll(".reveal-on-scroll");
        revealElements.forEach(el => {
          el.classList.add("animate-fade-in");
          el.classList.remove("opacity-0");
        });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavBar />
      
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-primary">ParkEase</h1>
          <p className="text-xl mb-8">
            Modern parking management solution for efficient vehicle tracking and space optimization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            className="rounded-full p-2" 
            onClick={() => scrollToSection("features")}
          >
            <ChevronDown className="h-10 w-10 text-primary cursor-pointer" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-muted"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Tracking",
                description:
                  "Monitor all parking spaces in real-time with accurate vehicle entry and exit tracking.",
              },
              {
                title: "Smart Reservations",
                description:
                  "Allow customers to reserve parking spots in advance to ensure availability.",
              },
              {
                title: "Analytics Dashboard",
                description:
                  "Comprehensive analytics and reporting tools to optimize parking operations.",
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
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
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
                } gap-8 items-center opacity-0 reveal-on-scroll transition-all duration-700`}
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center opacity-0 reveal-on-scroll transition-all duration-700">
          <h2 className="text-4xl font-bold mb-6">Ready to optimize your parking management?</h2>
          <p className="text-xl mb-8">
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
