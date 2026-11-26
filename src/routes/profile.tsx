import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { ArrowLeft, Camera, FileText, Pencil, Check, Plus, Trash2, Network } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Beatrice Peter · Junior Software Developer | BridgeNet" },
      { name: "description", content: "Professional software developer profile for Beatrice Peter on BridgeNet." },
      { property: "og:title", content: "Beatrice Peter · Junior Software Developer" },
      { property: "og:description", content: "Skills, education, projects and experience on BridgeNet." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

type Item = { title: string; detail: string };
type DevProfile = {
  name: string;
  title: string;
  goal: string;
  about: string;
  photo: string;
  cvName: string;
  cvData: string;
  skills: string[];
  education: Item[];
  projects: Item[];
  experience: Item[];
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
};

export const defaultProfile: DevProfile = {
  name: "Beatrice Peter",
  title: "Junior Software Developer",
  goal: "To become a skilled software developer and gain practical work experience.",
  about:
    "I am an aspiring software developer passionate about technology, problem-solving, and building useful applications. I am currently developing my programming skills and looking for opportunities to learn, collaborate, and grow professionally.",
  photo: "",
  cvName: "",
  cvData: "",
  skills: ["Python", "HTML", "CSS", "JavaScript", "Git", "GitHub", "SQL", "Problem-Solving"],
  education: [{ title: "Power Learn Project (PLP)", detail: "Software Development Programme" }],
  projects: [{ title: "BridgeNet", detail: "Job matching, mentorship and returnship web app for displaced talent." }],
  experience: [{ title: "Add your experience", detail: "Internships, volunteering or freelance work." }],
  email: "",
  phone: "",
  location: "Kenya",
  github: "",
  linkedin: "",
};

const KEY = "bridgenet-dev-profile";
const field =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20";

function Section({ title, editing, onToggle, children }: { title: string; editing: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${editing ? "Save" : "Edit"} ${title}`}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:opacity-90"
        >
          {editing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      {children}
    </section>
  );
}

function ItemList({ items, editing, onChange }: { items: Item[]; editing: boolean; onChange: (i: Item[]) => void }) {
  if (!editing)
    return (
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="rounded-2xl bg-background p-4">
            <p className="text-sm font-bold">{it.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{it.detail}</p>
          </li>
        ))}
      </ul>
    );
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1 space-y-2">
            <input className={field} value={it.title} placeholder="Title" onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
            <input className={field} value={it.detail} placeholder="Details" onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)))} />
          </div>
          <button type="button" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))} className="cursor-pointer text-muted-foreground hover:text-destructive">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { title: "", detail: "" }])} className="flex cursor-pointer items-center gap-1 text-xs font-bold text-primary">
        <Plus className="size-3.5" /> Add
      </button>
    </div>
  );
}

function ProfilePage() {
  const [p, setP] = useState<DevProfile>(defaultProfile);
  const [edit, setEdit] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setP({ ...defaultProfile, ...(JSON.parse(saved) as Partial<DevProfile>) });
  }, []);

  const update = (patch: Partial<DevProfile>) =>
    setP((cur) => {
      const next = { ...cur, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage full (large files) */
      }
      return next;
    });
  const toggle = (k: string) => setEdit((e) => ({ ...e, [k]: !e[k] }));

  const readFile = (e: ChangeEvent<HTMLInputElement>, cb: (data: string, name: string) => void) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => cb(String(r.result), f.name);
    r.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> Back to BridgeNet
          </Link>
          <span className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
            <Network className="size-5" /> BridgeNet
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <section className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <label className="group relative flex size-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-3xl bg-primary-foreground text-primary">
              {p.photo ? <img src={p.photo} alt="Profile photo" className="size-full object-cover" /> : <span className="font-display text-3xl font-semibold">BP</span>}
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-primary-foreground opacity-0 transition group-hover:opacity-100">
                <Camera className="size-6" />
              </span>
              <input type="file" accept="image/*" className="sr-only" aria-label="Upload profile photo" onChange={(e) => readFile(e, (d) => update({ photo: d }))} />
            </label>
            <div className="flex-1">
              {edit["header"] ? (
                <div className="space-y-2 text-foreground">
                  <input className={field} value={p.name} onChange={(e) => update({ name: e.target.value })} aria-label="Full name" />
                  <input className={field} value={p.title} onChange={(e) => update({ title: e.target.value })} aria-label="Professional title" />
                </div>
              ) : (
                <>
                  <h1 className="font-display text-4xl font-semibold">{p.name}</h1>
                  <p className="mt-1 text-lg text-primary-foreground/85">{p.title}</p>
                </>
              )}
              <p className="mt-3 text-sm text-primary-foreground/75">Tap the photo to change it.</p>
            </div>
            <button type="button" onClick={() => toggle("header")} className="flex cursor-pointer items-center gap-1.5 self-start rounded-full bg-primary-foreground px-4 py-2 text-xs font-bold text-primary">
              {edit["header"] ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
              {edit["header"] ? "Save" : "Edit"}
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="About Me" editing={!!edit["about"]} onToggle={() => toggle("about")}>
            {edit["about"] ? (
              <div className="space-y-2">
                <textarea rows={5} className={field} value={p.about} onChange={(e) => update({ about: e.target.value })} />
                <label className="block text-xs font-bold">Career goal
                  <textarea rows={2} className={`${field} mt-1`} value={p.goal} onChange={(e) => update({ goal: e.target.value })} />
                </label>
              </div>
            ) : (
              <>
                <p className="text-sm leading-6 text-muted-foreground">{p.about}</p>
                <p className="mt-4 rounded-2xl bg-highlight p-4 text-sm"><strong className="text-primary">Career goal: </strong>{p.goal}</p>
              </>
            )}
          </Section>

          <Section title="Skills" editing={!!edit["skills"]} onToggle={() => toggle("skills")}>
            {edit["skills"] ? (
              <textarea rows={3} className={field} value={p.skills.join(", ")} onChange={(e) => update({ skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} aria-label="Skills, separated by commas" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <span key={s} className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">{s}</span>
                ))}
              </div>
            )}
          </Section>

          <Section title="Education" editing={!!edit["education"]} onToggle={() => toggle("education")}>
            <ItemList items={p.education} editing={!!edit["education"]} onChange={(education) => update({ education })} />
          </Section>

          <Section title="Projects" editing={!!edit["projects"]} onToggle={() => toggle("projects")}>
            <ItemList items={p.projects} editing={!!edit["projects"]} onChange={(projects) => update({ projects })} />
          </Section>

          <Section title="Experience" editing={!!edit["experience"]} onToggle={() => toggle("experience")}>
            <ItemList items={p.experience} editing={!!edit["experience"]} onChange={(experience) => update({ experience })} />
          </Section>

          <Section title="CV" editing={!!edit["cv"]} onToggle={() => toggle("cv")}>
            <div className="flex items-center gap-3 rounded-2xl bg-background p-4">
              <FileText className="size-6 text-primary" />
              <div className="min-w-0 flex-1">
                {p.cvName ? (
                  <a href={p.cvData} download={p.cvName} className="truncate text-sm font-bold text-primary underline-offset-4 hover:underline">{p.cvName}</a>
                ) : (
                  <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
                )}
              </div>
            </div>
            {edit["cv"] && (
              <input type="file" accept=".pdf,.doc,.docx" aria-label="Upload CV" className="mt-3 text-xs" onChange={(e) => readFile(e, (d, n) => update({ cvData: d, cvName: n }))} />
            )}
          </Section>

          <Section title="Contact Information" editing={!!edit["contact"]} onToggle={() => toggle("contact")}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["email", "phone", "location", "github", "linkedin"] as const).map((k) => (
                <label key={k} className="block text-xs font-bold capitalize">
                  {k === "github" ? "GitHub" : k === "linkedin" ? "LinkedIn" : k}
                  {edit["contact"] ? (
                    <input className={`${field} mt-1 font-normal`} value={p[k]} onChange={(e) => update({ [k]: e.target.value })} />
                  ) : (
                    <p className="mt-1 text-sm font-normal normal-case text-muted-foreground">{p[k] || "Not added yet"}</p>
                  )}
                </label>
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
