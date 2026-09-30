import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, MapPin, Phone, Clock } from "lucide-react";

import { Logo } from "@/components/brand/Logo";

const productLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
];

const accountLinks = [
  { name: "Sign in", to: "/login" },
  { name: "Create an account", to: "/register" },
  { name: "Open dashboard", to: "/dashboard" },
];

const contactInfo = [
  { icon: MapPin, text: "Nakuru, Kenya" },
  { icon: Phone, text: "+254 798 600 033", href: "tel:+254798600033" },
  { icon: Mail, text: "support@parkease.com", href: "mailto:support@parkease.com" },
  { icon: Clock, text: "Mon – Fri, 09:00 – 18:00" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-surface-sunken">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Parking operations software for facilities that need every bay,
              ticket and shilling accounted for.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://www.linkedin.com/in/michael-gaitho-99b02a355/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:border-strong hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/gaithom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:border-strong hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              {contactInfo.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} ParkEase. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href="https://github.com/gaithom"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Michael Gaitho
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
