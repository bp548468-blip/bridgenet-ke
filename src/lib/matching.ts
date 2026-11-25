export type JobCategory = "health" | "tech" | "admin";

export type JobDef = {
  id: string;
  title: string;
  organisation: string;
  location: string;
  salary: string;
  category: JobCategory;
  roleKeywords: string[];
  skills: string[];
};

export type TrialDef = {
  id: string;
  title: string;
  salary: string;
  organisation: string;
  location: string;
  schedule: string;
  jobId: string;
};

export const jobCatalog: JobDef[] = [
  {
    id: "clinic-nurse",
    title: "Clinic Nurse",
    organisation: "Garissa Hospital",
    location: "Garissa, Kenya",
    salary: "KES 45,000",
    category: "health",
    roleKeywords: ["nurse", "nursing", "clinic", "midwife", "health"],
    skills: ["patient care", "triage", "medication administration", "first aid", "vital signs"],
  },
  {
    id: "data-entry",
    title: "Data Entry",
    organisation: "Nairobi",
    location: "Nairobi, Kenya",
    salary: "KES 30,000",
    category: "admin",
    roleKeywords: ["data entry", "data clerk", "admin", "records", "office"],
    skills: ["data entry", "excel", "typing", "records", "microsoft office", "attention to detail"],
  },
  {
    id: "junior-developer",
    title: "Junior Developer",
    organisation: "Mombasa",
    location: "Mombasa, Kenya",
    salary: "KES 50,000",
    category: "tech",
    roleKeywords: ["developer", "software", "programmer", "engineer", "web"],
    skills: ["python", "javascript", "html", "css", "git", "github", "problem solving", "sql"],
  },
];

export const trialCatalog: TrialDef[] = [
  {
    id: "clinic-assistant",
    title: "2-Week Clinic Assistant",
    salary: "KES 15,000",
    organisation: "Garissa Hospital",
    location: "Garissa",
    schedule: "2 weeks · Full-time",
    jobId: "clinic-nurse",
  },
  {
    id: "data-entry-trial",
    title: "2-Week Data Entry",
    salary: "KES 12,000",
    organisation: "Nairobi Business Hub",
    location: "Nairobi",
    schedule: "2 weeks · Hybrid",
    jobId: "data-entry",
  },
  {
    id: "developer-trial",
    title: "4-Week Junior Developer",
    salary: "KES 25,000",
    organisation: "Coast Digital Works",
    location: "Mombasa",
    schedule: "4 weeks · Hybrid",
    jobId: "junior-developer",
  },
];

const parseSkills = (skills: string) =>
  skills
    .toLowerCase()
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Score 0-98. A job only counts as a match when the target role fits it or most skills overlap. */
export function scoreJob(job: JobDef, role: string, skills: string): number {
  const r = role.toLowerCase();
  const userSkills = parseSkills(skills);
  const roleFit = job.roleKeywords.some((k) => r.includes(k));
  const hits = job.skills.filter((s) => userSkills.some((u) => u.includes(s) || s.includes(u))).length;
  const skillFit = hits / job.skills.length;
  if (!roleFit && skillFit < 0.5) return 0;
  return Math.min(98, Math.round((roleFit ? 45 : 0) + skillFit * 50 + 3));
}

export type JobMatch = JobDef & { match: number };

export function matchJobs(role: string, skills: string): JobMatch[] {
  return jobCatalog
    .map((job) => ({ ...job, match: scoreJob(job, role, skills) }))
    .filter((job) => job.match > 0)
    .sort((a, b) => b.match - a.match);
}

export const findJob = (id: string | null) => jobCatalog.find((j) => j.id === id) ?? null;
export const findTrial = (id: string) => trialCatalog.find((t) => t.id === id) ?? null;

export const offerText = (job: JobDef) => `Offer: Full-Time ${job.title} ${job.salary}/month - Accept?`;
