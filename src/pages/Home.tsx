import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, CalendarClock, ParkingSquare } from "lucide-react";

import { useParking } from "@/context/parking";
import type { ParkingSlot } from "@/types";
import Footer from "@/components/Footer";
import MarketingHeader from "@/components/layout/MarketingHeader";
import ParkingLotMap from "@/components/parking/ParkingLotMap";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const capabilities = [
  {
    title: "Live facility map",
    description: "Every bay's state, updated as vehicles move.",
    icon: ParkingSquare,
  },
  {
    title: "Reservations",
    description: "Hold a bay and take the fee up front.",
    icon: CalendarClock,
  },
  {
    title: "Automatic charges",
    description: "Fees from dwell time, totalled into revenue.",
    icon: Banknote,
  },
];

const steps = [
  { title: "Record the entry", description: "Plate and type. Next free bay assigned." },
  { title: "Track the stay", description: "Dwell time runs on every screen." },
  { title: "Release and charge", description: "Fee calculated, visit written to the ledger." },
];

/*
  A representative facility for the product shot. Real occupancy starts at zero
  on a fresh install, so the landing page would otherwise show an empty lot.
  This is a screenshot, and is not labelled as live data.
*/
const demoPlates = [
  "KDA 442M",
  "KBZ 119X",
  "KCN 806T",
  "KAQ 573J",
  "KDJ 218P",
  "KBY 950L",
  "KCF 337R",
  "KDG 764A",
];
const demoTypes = ["Sedan", "SUV", "Truck", "Motorcycle"];
const occupiedBays = new Set([1, 2, 5, 6, 9, 12, 13, 17, 18, 21, 24, 25, 28, 29]);
const reservedBays = new Set([4, 15, 27]);

const useDemoSlots = (): ParkingSlot[] =>
  useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const slotNumber = index + 1;
        const isOccupied = occupiedBays.has(slotNumber);

        return {
          slotNumber,
          isOccupied,
          isReserved: reservedBays.has(slotNumber),
          vehicle: isOccupied
            ? {
                regNumber: demoPlates[index % demoPlates.length],
                vehicleType: demoTypes[index % demoTypes.length],
                entryTime: null,
              }
            : null,
        };
      }),
    []
  );

const Home = () => {
  const { user } = useParking();
  const demoSlots = useDemoSlots();

  const primaryCta = user.isLoggedIn
    ? { label: "Open dashboard", to: "/dashboard" }
    : { label: "Get started", to: "/register" };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-blueprint opacity-50 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]"
        />

        <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span aria-hidden="true" className="h-px w-5 bg-brass" />
              Parking operations software
            </p>

            <h1 className="mt-4 text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Every bay accounted for,{" "}
              <span className="text-primary">every shift.</span>
            </h1>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link to={primaryCta.to}>
                  {primaryCta.label}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Product shot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="overflow-hidden rounded-xl border bg-card shadow-raised">
              <div className="flex items-center justify-between gap-3 border-b bg-surface-sunken px-4 py-3">
                <span className="text-2xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Facility map
                </span>
                <span className="text-xs text-muted-foreground">
                  <span data-numeric className="font-semibold text-foreground">
                    47
                  </span>
                  % full
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <ParkingLotMap slots={demoSlots} size="sm" perRow={10} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────── */}
      <section id="features" className="border-b py-16">
        <div className="container">
          <SectionLabel index="01">Capabilities</SectionLabel>

          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.06 }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary shadow-control">
                  <capability.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold">
                  {capability.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b bg-surface-sunken py-16">
        <div className="container">
          <SectionLabel index="02">How it works</SectionLabel>

          <motion.h2
            {...fadeUp}
            className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Three steps, start to settled
          </motion.h2>

          <div className="relative mt-10">
            {/* Hairline joining the steps on wide screens. */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-5 hidden border-t border-dashed border-strong lg:block"
            />

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.08 }}
                  className="relative"
                >
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-card font-mono text-sm font-semibold text-primary shadow-xs">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground lg:pr-8">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 text-primary-foreground sm:px-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.13]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
            <div
              aria-hidden="true"
              className="stripes-hazard-light pointer-events-none absolute inset-x-0 top-0 h-1.5"
            />

            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground sm:text-3xl">
                  Try it with the demo account
                </h2>
                <p className="mt-2 text-base text-primary-foreground/75">
                  Walk a vehicle from entry to receipt in under a minute.
                </p>
              </div>

              <Button asChild size="lg" variant="secondary" className="shrink-0">
                <Link to={user.isLoggedIn ? "/dashboard" : "/login"}>
                  {user.isLoggedIn ? "Open dashboard" : "Sign in"}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
