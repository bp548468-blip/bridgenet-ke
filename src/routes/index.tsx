import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  FileCheck2,
  HeartHandshake,
  Home,
  Hospital,
  MapPin,
  MessageCircle,
  Network,
  Send,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import {
  findJob,
  findTrial,
  matchJobs,
  offerText,
  trialCatalog,
  type JobCategory,
  type JobMatch,
} from "@/lib/matching";
import { useMemo, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BridgeNet | Local Experience, Mentors & Jobs for Displaced Talent" },
      {
        name: "description",
        content:
          "BridgeNet connects displaced talent in Kenya to local job matches, trusted mentors, and paid returnships that open doors to full-time work.",
      },
      { property: "og:title", content: "BridgeNet — Local experience opens doors" },
      {
        property: "og:description",
        content:
          "Find Kenyan work experience, meet a mentor, and turn a paid returnship into a lasting career.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BridgeNetApp,
});

type TabId = "home" | "matching" | "mentor" | "marketplace";

type Profile = {
  name: string;
  country: string;
  role: string;
  skills: string;
};

const emptyProfile: Profile = { name: "", country: "", role: "", skills: "" };

const aminaProfile: Profile = {
  name: "Amina",
  country: "Democratic Republic of the Congo",
  role: "Clinic Nurse",
  skills: "Patient care, triage, medication administration",
};

const tabs: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "matching", label: "Matching Engine", icon: Sparkles },
  { id: "mentor", label: "Mentor Tracker", icon: UsersRound },
  { id: "marketplace", label: "Returnship Marketplace", icon: BriefcaseBusiness },
];

const categoryIcon: Record<JobCategory, LucideIcon> = {
  health: Hospital,
  admin: FileCheck2,
  tech: BriefcaseBusiness,
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "light" | "success";
  size?: "sm" | "md" | "lg";
};

function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-80",
        size === "sm" && "min-h-9 px-4 text-xs",
        size === "md" && "min-h-11 px-5 text-sm",
        size === "lg" && "min-h-12 px-6 text-sm",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md",
        variant === "outline" &&
          "border border-primary/25 bg-card text-primary hover:border-primary/45 hover:bg-highlight",
        variant === "ghost" && "text-primary hover:bg-highlight",
        variant === "light" && "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
        variant === "success" && "bg-success text-success-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase",
        light ? "text-primary-foreground/75" : "text-secondary-dark",
      )}
    >
      <span className={cn("h-px w-7", light ? "bg-primary-foreground/50" : "bg-secondary")} />
      {children}
    </p>
  );
}

function SectionHeading({
  solution,
  title,
  description,
}: {
  solution: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <Eyebrow>{solution}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function HomePanel({
  onLoadAmina,
  onTalent,
  onEmployer,
  onNavigate,
}: {
  onLoadAmina: () => void;
  onTalent: () => void;
  onEmployer: () => void;
  onNavigate: (tab: TabId) => void;
}) {
  const solutions: Array<{
    number: string;
    title: string;
    copy: string;
    action: string;
    tab: TabId;
    icon: LucideIcon;
  }> = [
    {
      number: "01",
      title: "Get matched to real work",
      copy: "See roles that value your skills, with clear pay and an honest match score.",
      action: "Explore job matching",
      tab: "matching",
      icon: Target,
    },
    {
      number: "02",
      title: "Grow with a local mentor",
      copy: "Build your Kenyan network with practical guidance and a clear weekly plan.",
      action: "Track your mentorship",
      tab: "mentor",
      icon: HeartHandshake,
    },
    {
      number: "03",
      title: "Prove it in a paid trial",
      copy: "Turn a short, paid returnship into local experience and a full-time offer.",
      action: "Browse returnships",
      tab: "marketplace",
      icon: WalletCards,
    },
  ];

  return (
    <div className="animate-enter">
      <section className="hero-texture relative overflow-hidden rounded-[2rem] border border-primary/10 bg-highlight/55">
        <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-16 lg:py-16">
          <div className="relative z-10">
            <Eyebrow>Local experience. Real networks. Lasting careers.</Eyebrow>
            <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[0.98] font-semibold tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">
              No Kenyan experience? <span className="text-primary italic">We fix that.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Your skills already matter. BridgeNet connects you to local employers, mentors, and
              paid opportunities so your career can move forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" onClick={onLoadAmina}>
                <UserRound className="size-4" />
                Load Sample Profile: Amina
              </Button>
              <Button size="lg" variant="secondary" onClick={onTalent}>
                I am Talent
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onEmployer}>
                I am Employer / Mentor
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BadgeCheck className="size-4 text-secondary-dark" />
              Explore the full demo instantly. No sign-in required.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="absolute -inset-4 rotate-3 rounded-[2rem] bg-secondary/20" />
            <article className="relative overflow-hidden rounded-[1.75rem] bg-primary p-6 text-primary-foreground shadow-xl sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary-foreground/12 px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase">
                  Sample talent profile
                </span>
                <Network className="size-6 text-primary-foreground/65" />
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground font-display text-4xl font-semibold text-primary">
                  A
                </div>
                <div>
                  <h2 className="font-display text-3xl font-semibold">Amina, 28</h2>
                  <p className="mt-1 text-sm text-primary-foreground/80">Refugee Nurse from Congo</p>
                </div>
              </div>
              <div className="my-6 h-px bg-primary-foreground/15" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-primary-foreground/60 uppercase">
                    Target role
                  </p>
                  <p className="mt-1 font-semibold">Clinic Nurse</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-primary-foreground/60 uppercase">
                    Best match
                  </p>
                  <p className="mt-1 font-semibold">92% at Garissa</p>
                </div>
              </div>
              <blockquote className="mt-7 rounded-2xl bg-primary-foreground/10 p-4 font-display text-lg leading-7 italic">
                “My skills crossed the border. Now my career can too.”
              </blockquote>
            </article>
          </div>
        </div>
      </section>

      <section aria-label="BridgeNet impact" className="grid gap-4 py-8 sm:grid-cols-3">
        {[
          { value: "68%", label: "convert to full-time", icon: TrendingUpIcon },
          { value: "120+", label: "mentors in our network", icon: UsersRound },
          { value: "45", label: "hiring partners", icon: Building2 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-secondary-dark">
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="py-8 sm:py-12">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Your next chapter starts here</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Three bridges. One stronger career.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Practical support to help displaced talent be seen, connected, and hired.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.number}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-secondary/45 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-highlight text-primary">
                  <solution.icon className="size-5" />
                </div>
                <span className="font-display text-sm text-muted-foreground/70">{solution.number}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">{solution.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{solution.copy}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-5 self-start px-0 group-hover:gap-3"
                onClick={() => onNavigate(solution.tab)}
              >
                {solution.action}
                <ArrowRight className="size-4" />
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TrendingUpIcon(props: { className?: string }) {
  return <ArrowRight {...props} className={cn(props.className, "-rotate-45")} />;
}

function MatchingPanel({
  profile,
  profileLoaded,
  showMatches,
  matches,
  applications,
  onProfileChange,
  onFindMatches,
  onApply,
}: {
  profile: Profile;
  profileLoaded: boolean;
  showMatches: boolean;
  matches: JobMatch[];
  applications: Record<string, boolean>;
  onProfileChange: (field: keyof Profile, value: string) => void;
  onFindMatches: () => void;
  onApply: (jobId: string) => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFindMatches();
  };

  return (
    <div className="animate-enter py-4 sm:py-8">
      <SectionHeading
        solution="Solution 1 · Matching Engine"
        title="Your skills belong here."
        description="Tell us where you want to go. We’ll surface local roles where your experience can make an immediate difference."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-highlight text-primary">
              <UserRound className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Your talent profile</h2>
              <p className="text-xs text-muted-foreground">Four details. Better matches.</p>
            </div>
          </div>

          {profileLoaded && (
            <div className="mb-5 flex gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground" role="status">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <p>
                <strong>Amina’s profile is loaded.</strong> Her details are ready to match.
              </p>
            </div>
          )}

          <div className="space-y-5">
            <label className="block text-sm font-semibold" htmlFor="talent-name">
              Name
              <input
                id="talent-name"
                required
                value={profile.name}
                onChange={(event) => onProfileChange("name", event.target.value)}
                placeholder="Your full name"
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            <label className="block text-sm font-semibold" htmlFor="talent-country">
              Country
              <input
                id="talent-country"
                required
                value={profile.country}
                onChange={(event) => onProfileChange("country", event.target.value)}
                placeholder="Your home country"
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            <label className="block text-sm font-semibold" htmlFor="target-role">
              Target Role
              <input
                id="target-role"
                required
                value={profile.role}
                onChange={(event) => onProfileChange("role", event.target.value)}
                placeholder="e.g. Clinic Nurse"
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            <label className="block text-sm font-semibold" htmlFor="talent-skills">
              Skills
              <textarea
                id="talent-skills"
                required
                rows={3}
                value={profile.skills}
                onChange={(event) => onProfileChange("skills", event.target.value)}
                placeholder="List your strongest skills"
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </label>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full">
            <Sparkles className="size-4" />
            Find My Matches
          </Button>
        </form>

        <section aria-label="Job matches" className="lg:pt-1">
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="font-display text-2xl font-semibold">
              {showMatches ? "Your top matches" : "Opportunities await"}
            </h2>
            {showMatches && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                {matches.length} {matches.length === 1 ? "role" : "roles"} found
              </span>
            )}
          </div>

          {!showMatches ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-secondary/40 bg-accent/35 p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-card text-secondary-dark shadow-sm">
                <Target className="size-7" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">Your next opportunity starts here</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                Complete your profile, then select “Find My Matches” to see roles chosen for you.
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-secondary/40 bg-accent/35 p-8 text-center" role="status">
              <div className="flex size-16 items-center justify-center rounded-full bg-card text-secondary-dark shadow-sm">
                <Target className="size-7" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">No matching roles yet</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                We only show jobs that fit your target role and skills. Try adding more skills or a different target role.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((job) => {
                const applied = Boolean(applications[job.id]);
                const JobIcon = categoryIcon[job.category];
                return (
                  <article
                    key={job.id}
                    className="rounded-3xl border border-border bg-card p-5 transition hover:border-secondary/40 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-highlight text-primary">
                        <JobIcon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-xl font-semibold">{job.title}</h3>
                          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                            {job.match}% Match
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">{job.organisation}</p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="size-3.5" /> Full-time
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t border-border pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <div className="sm:text-right">
                          <p className="font-display text-lg font-semibold text-primary">{job.salary}</p>
                          <p className="text-[11px] text-muted-foreground">per month</p>
                        </div>
                        <Button
                          size="sm"
                          variant={applied ? "success" : "primary"}
                          disabled={applied}
                          onClick={() => onApply(job.id)}
                          aria-label={applied ? `Application sent for ${job.title}` : `Apply for ${job.title}`}
                        >
                          {applied ? <CheckCircle2 className="size-4" /> : <Send className="size-3.5" />}
                          {applied ? "Application Sent!" : "Apply"}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
              <p className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-muted-foreground">
                <BadgeCheck className="size-4 text-secondary-dark" />
                Every employer welcomes internationally trained talent.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MentorPanel({
  progress,
  messageSent,
  onCompleteTask,
  onMessage,
}: {
  progress: number;
  messageSent: boolean;
  onCompleteTask: () => void;
  onMessage: () => void;
}) {
  const [openTask, setOpenTask] = useState<string | null>(null);
  const tasks: Array<{ title: string; description: string; status: string; details?: string[] }> = [
    {
      title: "CV Review",
      description: "Position Amina’s international experience for Kenyan employers.",
      status: "Done",
    },
    {
      title: "Mock Interview",
      description: "Practise confident answers with real interview feedback.",
      details: [
        "Format: 30-minute video call with Grace, Thursday 10:00 AM.",
        "Prepare: a 1-minute introduction about your background and why you want this role.",
        "Practise: 3 common questions — your strengths, a challenge you solved, and why you chose Kenya.",
        "Bring: your updated CV and one question to ask the employer.",
        "After: Grace shares written feedback; then select “Mark Task Complete”.",
      ],
      status: progress >= 80 ? "Done" : "In Progress",
    },
    {
      title: "Hospital Shadowing",
      description: "Gain firsthand experience inside a local hospital team.",
      status: progress === 100 ? "Done" : progress === 80 ? "In Progress" : "To Do",
    },
  ];

  return (
    <div className="animate-enter py-4 sm:py-8">
      <SectionHeading
        solution="Solution 2 · Mentor Tracker"
        title="A network that knows your name."
        description="Build trusted local connections with a mentor, a practical plan, and visible progress towards your next role."
      />

      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <article className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground">
            <div className="absolute -top-12 -right-12 size-40 rounded-full border-[30px] border-primary-foreground/5" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-foreground font-display text-2xl font-semibold text-primary">
                  GW
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/12 px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase">
                  <span className="size-1.5 rounded-full bg-secondary" /> Your mentor
                </span>
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold">Grace Wanjiru</h2>
              <p className="mt-1 text-primary-foreground/80">Senior Nurse</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/75">
                <Building2 className="size-4" /> Nairobi Hospital
              </p>
              <div className="my-6 h-px bg-primary-foreground/15" />
              <p className="text-sm leading-6 text-primary-foreground/80">
                “We’ll turn your experience into a story local employers understand.”
              </p>
              <Button
                variant={messageSent ? "success" : "light"}
                className="mt-6 w-full"
                onClick={onMessage}
                disabled={messageSent}
              >
                {messageSent ? <CheckCircle2 className="size-4" /> : <MessageCircle className="size-4" />}
                {messageSent ? "Message Sent to Grace!" : "Message Mentor"}
              </Button>
              {messageSent && (
                <p className="mt-3 text-center text-xs text-primary-foreground/70" role="status">
                  Grace usually replies within one working day.
                </p>
              )}
            </div>
          </article>

          <article className="flex gap-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-secondary-dark">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Next check-in</p>
              <p className="mt-1 font-display text-lg font-semibold">Thursday, 10:00 AM</p>
              <p className="mt-1 text-xs text-muted-foreground">Video call · 30 minutes</p>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Your journey</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">Mentorship progress</h2>
              </div>
              <p className="font-display text-4xl font-semibold text-primary" aria-live="polite">
                {progress}%
              </p>
            </div>
            <div
              className="mt-6 h-3 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="Mentorship progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Getting started</span>
              <span>{progress === 100 ? "Journey complete!" : "Career ready"}</span>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold">Your checklist</h2>
                <p className="mt-1 text-sm text-muted-foreground">Small steps. Meaningful momentum.</p>
              </div>
              <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold text-primary">
                {progress === 100 ? "3 of 3" : progress === 80 ? "2 of 3" : "1 of 3"} done
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const done = task.status === "Done";
                const inProgress = task.status === "In Progress";
                return (
                  <div
                    key={task.title}
                    className={cn(
                      "flex gap-4 rounded-2xl border p-4 sm:items-center",
                      done ? "border-success/15 bg-success-soft/55" : "border-border bg-background",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full sm:mt-0",
                        done
                          ? "bg-success text-success-foreground"
                          : inProgress
                            ? "bg-accent text-secondary-dark"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-4" /> : inProgress ? <Clock3 className="size-4" /> : <Circle className="size-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {task.details ? (
                          <h3 className="text-sm font-bold">
                            <button
                              type="button"
                              onClick={() => setOpenTask(openTask === task.title ? null : task.title)}
                              aria-expanded={openTask === task.title}
                              className="cursor-pointer text-left underline decoration-secondary decoration-2 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            >
                              {task.title}
                            </button>
                          </h3>
                        ) : (
                          <h3 className="text-sm font-bold">{task.title}</h3>
                        )}
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            done
                              ? "bg-success-soft text-success"
                              : inProgress
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{task.description}</p>
                      {task.details && openTask === task.title && (
                        <div className="mt-3 rounded-xl border border-secondary/30 bg-accent/40 p-3" role="region" aria-label={`${task.title} instructions`}>
                          <p className="text-xs font-bold text-secondary-dark">How to prepare</p>
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-foreground">
                            {task.details.map((d) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              variant={progress === 100 ? "success" : "primary"}
              onClick={onCompleteTask}
              disabled={progress === 100}
            >
              {progress === 100 ? <CheckCircle2 className="size-4" /> : <Check className="size-4" />}
              {progress === 100 ? "All Tasks Complete" : "Mark Task Complete"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
              {progress === 60 && "Next up: complete your mock interview to reach 80%."}
              {progress === 80 && "One more step: finish hospital shadowing to reach 100%."}
              {progress === 100 && "Excellent work — your mentorship journey is complete."}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

function MarketplacePanel({
  trials,
  offerJob,
  applications,
  offerVisible,
  offerAccepted,
  onApply,
  onToggleOffer,
  onAcceptOffer,
}: {
  trials: typeof trialCatalog;
  offerJob: ReturnType<typeof findJob>;
  applications: Record<string, boolean>;
  offerVisible: boolean;
  offerAccepted: boolean;
  onApply: (trialId: string) => void;
  onToggleOffer: () => void;
  onAcceptOffer: () => void;
}) {
  return (
    <div className="animate-enter py-4 sm:py-8">
      <SectionHeading
        solution="Solution 3 · Returnship Marketplace"
        title="Short trials. Long-term belonging."
        description="Earn while you build Kenyan experience. Every paid returnship is a chance to prove your strengths and grow your local network."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {trials.map((trial) => {
          const applied = Boolean(applications[trial.id]);
          const trialJob = findJob(trial.jobId);
          const TrialIcon = categoryIcon[trialJob?.category ?? "tech"];
          return (
            <article
              key={trial.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between bg-highlight/60 p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                  <TrialIcon className="size-5" />
                </div>
                <span className="rounded-full bg-card px-3 py-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                  Paid returnship
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-2xl leading-tight font-semibold">{trial.title}</h2>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{trial.organisation}</p>
                <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-secondary-dark" /> {trial.location}, Kenya
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-secondary-dark" /> {trial.schedule}
                  </p>
                </div>
                <div className="my-6 h-px bg-border" />
                <div className="mt-auto flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold text-primary">{trial.salary}</p>
                    <p className="text-[11px] text-muted-foreground">total trial pay</p>
                  </div>
                  <BadgeCheck className="size-5 text-secondary-dark" />
                </div>
                <Button
                  variant={applied ? "success" : "primary"}
                  className="mt-6 w-full"
                  disabled={applied}
                  onClick={() => onApply(trial.id)}
                  aria-label={applied ? `Trial application submitted for ${trial.title}` : `Apply for Trial: ${trial.title}`}
                >
                  {applied ? <CheckCircle2 className="size-4" /> : <ArrowRight className="size-4" />}
                  {applied ? "Trial Application Submitted!" : "Apply for Trial"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <div className="flex flex-col gap-6 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <p className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">68%</p>
            <div className="max-w-md">
              <h2 className="font-display text-2xl font-semibold">convert to full-time</h2>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                A short trial can become a lasting career. See what your next chapter could look like.
              </p>
            </div>
          </div>
          <Button
            variant="light"
            size="lg"
            className="shrink-0"
            onClick={onToggleOffer}
            aria-expanded={offerVisible}
          >
            {offerVisible ? "Hide My Offer" : "View My Offer"}
            <ArrowRight className={cn("size-4 transition-transform", offerVisible && "rotate-90")} />
          </Button>
        </div>

        {offerVisible && !offerJob && (
          <div className="border-t border-primary-foreground/15 bg-primary-foreground/8 p-5 sm:p-7">
            <p className="rounded-2xl bg-primary-foreground p-6 text-sm font-semibold text-foreground" role="status">
              No offer yet. Apply for a job or paid trial first — your offer will be for that exact role.
            </p>
          </div>
        )}
        {offerVisible && offerJob && (
          <div className="border-t border-primary-foreground/15 bg-primary-foreground/8 p-5 sm:p-7">
            <div className="flex flex-col gap-5 rounded-2xl bg-primary-foreground p-6 text-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-secondary-dark">
                  {offerAccepted ? <CheckCircle2 className="size-6" /> : <BriefcaseBusiness className="size-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-secondary-dark uppercase">
                    {offerAccepted ? "You did it" : "Your matched offer"}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold sm:text-2xl">
                    {offerText(offerJob)}
                  </h3>
                  {offerAccepted && (
                    <p className="mt-2 text-sm font-semibold text-success" role="status">
                      Offer Accepted! Welcome to the team.
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant={offerAccepted ? "success" : "secondary"}
                size="lg"
                className="shrink-0"
                onClick={onAcceptOffer}
                disabled={offerAccepted}
              >
                {offerAccepted ? <CheckCircle2 className="size-4" /> : <Check className="size-4" />}
                {offerAccepted ? "Offer Accepted!" : "Accept Offer"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export function BridgeNetApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [jobApplications, setJobApplications] = useState<Record<string, boolean>>({});
  const [mentorProgress, setMentorProgress] = useState(60);
  const [messageSent, setMessageSent] = useState(false);
  const [trialApplications, setTrialApplications] = useState<Record<string, boolean>>({});
  const [offerVisible, setOfferVisible] = useState(false);
  const [acceptedOffers, setAcceptedOffers] = useState<Record<string, boolean>>({});
  const [offerJobId, setOfferJobId] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

  const matches = useMemo(
    () => (matchedProfile ? matchJobs(matchedProfile.role, matchedProfile.skills) : []),
    [matchedProfile],
  );
  const visibleTrials = matchedProfile
    ? trialCatalog.filter((t) => matches.some((m) => m.id === t.jobId))
    : trialCatalog;
  const offerJob = findJob(offerJobId);
  const offerAccepted = Boolean(offerJobId && acceptedOffers[offerJobId]);

  const navigateTo = (tab: TabId) => setActiveTab(tab);

  const loadAmina = () => {
    setProfile(aminaProfile);
    setProfileLoaded(true);
    setShowMatches(false);
    setActiveTab("matching");
  };

  const startAsTalent = () => {
    setProfile(emptyProfile);
    setProfileLoaded(false);
    setShowMatches(false);
    setActiveTab("matching");
  };

  const updateProfile = (field: keyof Profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileLoaded(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo("home")}
                className="flex cursor-pointer items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="BridgeNet home"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Network className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-2xl leading-none font-semibold tracking-tight text-primary">
                    BridgeNet
                  </span>
                  <span className="mt-1 block text-[9px] font-bold tracking-[0.13em] text-muted-foreground uppercase">
                    Talent knows no borders
                  </span>
                </span>
              </button>
              <span className="xl:hidden"><span className="flex items-center gap-2">
                <a href="/profile" className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:opacity-90">My Profile</a>
                <a href="/login" className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90">Log in</a>
              </span></span>
            </div>

            <nav aria-label="Main navigation" className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1.5 lg:grid-cols-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => navigateTo(tab.id)}
                  className={cn(
                    "flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-2 text-center text-xs leading-4 font-semibold whitespace-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 lg:whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
                  )}
                >
                  <tab.icon className="size-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="hidden xl:flex"><span className="flex items-center gap-2">
                <a href="/profile" className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:opacity-90">My Profile</a>
                <a href="/login" className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90">Log in</a>
              </span></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="pt-6 sm:pt-8"
        >
          {activeTab === "home" && (
            <HomePanel
              onLoadAmina={loadAmina}
              onTalent={startAsTalent}
              onEmployer={() => setActiveTab("marketplace")}
              onNavigate={navigateTo}
            />
          )}
          {activeTab === "matching" && (
            <MatchingPanel
              profile={profile}
              profileLoaded={profileLoaded}
              showMatches={showMatches}
              matches={matches}
              applications={jobApplications}
              onProfileChange={updateProfile}
              onFindMatches={() => {
                setMatchedProfile({ ...profile });
                setShowMatches(true);
              }}
              onApply={(jobId) => {
                setJobApplications((current) => ({ ...current, [jobId]: true }));
                setOfferJobId(jobId);
              }}
            />
          )}
          {activeTab === "mentor" && (
            <MentorPanel
              progress={mentorProgress}
              messageSent={messageSent}
              onCompleteTask={() => setMentorProgress((current) => Math.min(100, current + 20))}
              onMessage={() => setMessageSent(true)}
            />
          )}
          {activeTab === "marketplace" && (
            <MarketplacePanel
              trials={visibleTrials}
              offerJob={offerJob}
              applications={trialApplications}
              offerVisible={offerVisible}
              offerAccepted={offerAccepted}
              onApply={(trialId) => {
                setTrialApplications((current) => ({ ...current, [trialId]: true }));
                const trial = findTrial(trialId);
                if (trial) setOfferJobId(trial.jobId);
              }}
              onToggleOffer={() => setOfferVisible((current) => !current)}
              onAcceptOffer={() => {
                if (offerJobId) setAcceptedOffers((current) => ({ ...current, [offerJobId]: true }));
              }}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Network className="size-4 text-primary" />
            <span className="font-display text-base font-semibold text-primary">BridgeNet</span>
            <span>· Local experience opens doors.</span>
          </div>
          <p>Built for displaced talent in Kenya.</p>
        </div>
      </footer>
    </div>
  );
}
