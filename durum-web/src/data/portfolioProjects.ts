import type { StudyGuide, StudyResource, StudyPlanStep } from "./studyPlans";

export type PortfolioProject = {
  id: string;
  title: string;
  gate: "B" | "C";
  artifactType: "soc-lab" | "ad-lab" | "vm-lab" | "arac" | "writeup" | "lab-egzersizi";
  value: number;
  hoursEstimate: number;
  summary: string;
  guide: StudyGuide;
};

function steps(...items: Omit<StudyPlanStep, "order">[]): StudyPlanStep[] {
  return items.map((s, i) => ({ ...s, order: i + 1 }));
}

const INVESTIGATION_TEMPLATE: StudyResource = {
  label: "SOC investigation write-up template (GitHub)",
  url: "https://github.com/search?q=soc+investigation+writeup+template&type=repositories",
  type: "doc",
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-wazuh-sysmon",
    title: "Mini SOC Lab — Sysmon + Wazuh",
    gate: "C",
    artifactType: "soc-lab",
    value: 3.0,
    hoursEstimate: 60,
    summary:
      "Deploy Wazuh on Linux, forward Sysmon/WinEvent from a Windows VM, write 2 detection rules, triage 1 alert end-to-end.",
    guide: {
      topic: "Mini SOC Lab — Sysmon + Wazuh",
      resources: [
        { label: "Wazuh — Getting started", url: "https://documentation.wazuh.com/current/getting-started/index.html", type: "doc" },
        { label: "Sysmon — SwiftOnSecurity config", url: "https://github.com/SwiftOnSecurity/sysmon-config", type: "tool" },
        { label: "TryHackMe — SOC Level 1 (SIEM Triage module)", url: "https://tryhackme.com/path/outline/soclevel1", type: "thm" },
        { label: "Sigma rules repository", url: "https://github.com/SigmaHQ/sigma", type: "doc" },
        INVESTIGATION_TEMPLATE,
      ],
      actions: [
        "Install Wazuh manager + agent on Linux; Sysmon on Windows client",
        "Verify WinEvent 4688 (process creation) and Sysmon Event ID 1 in Wazuh",
        "Write 2 custom rules (e.g. suspicious PowerShell, rare parent process)",
        "Triage one simulated alert: timeline → RCA → close with 5 Ws report",
        "Publish GitHub README with architecture diagram + public evidence URL",
      ],
      steps: steps(
        { action: "Draw lab topology: Wazuh manager, Linux agent, Windows Sysmon", durationMin: 20, logHint: "Diagram filename or link" },
        { action: "Deploy Wazuh; install Sysmon with SwiftOnSecurity config on Windows VM", durationMin: 90, logHint: "Agent status + Sysmon service running" },
        { action: "Generate test activity (cmd.exe, PowerShell -enc); confirm logs arrive", durationMin: 30, logHint: "Sample log line / rule hit" },
        { action: "Create 2 Wazuh rules from Sigma or custom XML; test each", durationMin: 45, logHint: "Rule names + trigger event" },
        { action: "Write investigation report (5 Ws); publish repo with screenshots", durationMin: 60, logHint: "Public GitHub URL" },
      ),
    },
  },
  {
    id: "proj-splunk-bots",
    title: "Splunk BOTS Investigation + 3 Sigma Rules",
    gate: "C",
    artifactType: "soc-lab",
    value: 3.0,
    hoursEstimate: 50,
    summary:
      "Load Splunk BOTS v1 attack-only dataset, complete 5 hunt questions, convert 3 Sigma rules to SPL.",
    guide: {
      topic: "Splunk BOTS Investigation + Sigma Rules",
      resources: [
        { label: "TryHackMe — Splunk Basics", url: "https://tryhackme.com/room/splunk101", type: "thm" },
        { label: "BOTS v1 dataset (attack-only, 135 MB)", url: "https://github.com/splunk/botsv1", type: "lab" },
        { label: "Sigma rules repository", url: "https://github.com/SigmaHQ/sigma", type: "doc" },
        { label: "pySigma Splunk backend", url: "https://github.com/SigmaHQ/pySigma-backend-splunk", type: "tool" },
        INVESTIGATION_TEMPLATE,
      ],
      actions: [
        "Install Splunk Free + import BOTS v1 attack-only dataset",
        "Answer 5 BOTS hunt questions with SPL (document queries)",
        "Pick 3 Sigma rules; convert to SPL and validate against BOTS data",
        "Write one-page investigation summary with IOCs and timeline",
        "Publish GitHub repo with queries + findings (public URL for Gate C)",
      ],
      steps: steps(
        { action: "Complete THM Splunk Basics room (or first 10 tasks)", durationMin: 45, logHint: "Room progress %" },
        { action: "Install Splunk Free; import BOTS v1 attack-only", durationMin: 60, logHint: "index=botsv1 search works" },
        { action: "Solve 5 BOTS hunt questions; save SPL queries", durationMin: 90, logHint: "Question numbers + key finding" },
        { action: "Convert 3 Sigma rules to SPL; test each in BOTS index", durationMin: 45, logHint: "Rule titles" },
        { action: "Publish write-up repo with queries, IOCs, and timeline", durationMin: 60, logHint: "Public GitHub URL" },
      ),
    },
  },
  {
    id: "proj-ad-detection",
    title: "AD Lab — Kerberos/NTLM Detection Write-up",
    gate: "C",
    artifactType: "ad-lab",
    value: 2.5,
    hoursEstimate: 40,
    summary:
      "Lab AD environment, simulate failed logon + suspicious Kerberos, detect via Event 4624/4625/4768, publish analysis.",
    guide: {
      topic: "AD Lab — Kerberos/NTLM Detection",
      resources: [
        { label: "TryHackMe — Attacktive Directory", url: "https://tryhackme.com/room/attacktivedirectory", type: "thm" },
        { label: "Microsoft — Windows Event ID reference", url: "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624", type: "doc" },
        { label: "TryHackMe — Windows Event Logs", url: "https://tryhackme.com/room/windowseventlogs", type: "thm" },
        INVESTIGATION_TEMPLATE,
      ],
      actions: [
        "Set up AD lab (TryHackMe AD room or local VM domain)",
        "Generate failed logon (4625) and successful logon (4624) events",
        "Identify Kerberos TGT request (4768) in Security log",
        "Map events to MITRE ATT&CK techniques",
        "Publish detection-focused write-up with Event ID table",
      ],
      steps: steps(
        { action: "Access AD lab environment; enumerate domain users/groups", durationMin: 30, logHint: "Domain name + 1 user" },
        { action: "Trigger failed + successful logons; export relevant Security events", durationMin: 30, logHint: "Event IDs captured" },
        { action: "Analyze Kerberos flow; note 4768/4769 if present", durationMin: 25, logHint: "Kerberos observation" },
        { action: "Draft detection logic (which Event IDs → which alert)", durationMin: 20, logHint: "3 detection bullets" },
        { action: "Publish GitHub write-up with Event ID table + MITRE mapping", durationMin: 45, logHint: "Public URL" },
      ),
    },
  },
  {
    id: "proj-letsdefend-triage",
    title: "LetsDefend — 10 Alert Triage Sessions",
    gate: "B",
    artifactType: "lab-egzersizi",
    value: 0.5,
    hoursEstimate: 15,
    summary:
      "Complete 10 LetsDefend alert triage scenarios; document FP vs TP decisions and escalation rationale.",
    guide: {
      topic: "LetsDefend Alert Triage Practice",
      resources: [
        { label: "LetsDefend — free SOC training", url: "https://letsdefend.io/", type: "lab" },
        { label: "TryHackMe — SOC L1 Alert Triage", url: "https://tryhackme.com/path/outline/soclevel1", type: "thm" },
        INVESTIGATION_TEMPLATE,
      ],
      actions: [
        "Create free LetsDefend account; start SOC Fundamentals if new",
        "Triage 10 alerts using standard workflow: enrich → decide → document",
        "For each alert: note FP/TP, escalation yes/no, and 5 Ws summary",
        "Screenshot 3 best triage examples for portfolio",
      ],
      steps: steps(
        { action: "Sign up LetsDefend; complete SOC Fundamentals intro module", durationMin: 30, logHint: "Module name" },
        { action: "Triage alerts 1–5; log decision + rationale each", durationMin: 45, logHint: "5 alert titles" },
        { action: "Triage alerts 6–10; note patterns in FP vs TP", durationMin: 45, logHint: "FP/TP ratio estimate" },
        { action: "Compile triage cheat sheet (5 bullets); save 3 screenshots", durationMin: 15, logHint: "Screenshot paths" },
      ),
    },
  },
  {
    id: "proj-cyberdefenders-blue",
    title: "CyberDefenders — 3 Blue Team Challenges",
    gate: "C",
    artifactType: "writeup",
    value: 0.5,
    hoursEstimate: 20,
    summary:
      "Solve 3 free CyberDefenders blue team challenges; publish investigation write-ups with IOCs.",
    guide: {
      topic: "CyberDefenders Blue Team Challenges",
      resources: [
        { label: "CyberDefenders — blue team challenges", url: "https://cyberdefenders.org/blueteam-ctf-challenges/", type: "lab" },
        { label: "Malware Traffic Analysis — sample PCAPs", url: "https://www.malware-traffic-analysis.net/", type: "lab" },
        INVESTIGATION_TEMPLATE,
      ],
      actions: [
        "Pick 3 beginner-friendly CyberDefenders challenges",
        "Document investigation: hypothesis → evidence → conclusion",
        "Extract IOCs (IPs, domains, hashes) from each challenge",
        "Publish 3 mini write-ups on GitHub (one file per challenge)",
      ],
      steps: steps(
        { action: "Browse CyberDefenders; select 3 challenges matching your level", durationMin: 15, logHint: "Challenge names" },
        { action: "Complete challenge 1; draft write-up with timeline", durationMin: 60, logHint: "Challenge 1 IOC count" },
        { action: "Complete challenges 2–3 with same template", durationMin: 120, logHint: "All 3 done" },
        { action: "Publish GitHub repo with 3 write-ups + public link", durationMin: 30, logHint: "Public URL" },
      ),
    },
  },
  {
    id: "proj-integrated-lab-writeup",
    title: "Integrated Lab — Attack Timeline + Detection Write-up",
    gate: "C",
    artifactType: "writeup",
    value: 2.0,
    hoursEstimate: 25,
    summary:
      "Complete one TryHackMe Jr Pentest or HTB Starting Point machine in one session: document the attack timeline and the detection/response view (legal scope only).",
    guide: {
      topic: "Integrated lab write-up (attack + detection)",
      resources: [
        { label: "TryHackMe — Jr Penetration Tester path", url: "https://tryhackme.com/path/outline/jrpenetrationtester", type: "thm" },
        { label: "Hack The Box — Starting Point tracks", url: "https://app.hackthebox.com/tracks", type: "htb" },
        { label: "MITRE ATT&CK — techniques", url: "https://attack.mitre.org/", type: "doc" },
        { label: "LOLBAS — living-off-the-land binaries", url: "https://lolbas-project.github.io/", type: "doc" },
        INVESTIGATION_TEMPLATE,
      ],
      actions: [
        "Pick one in-scope machine (THM room or HTB Starting Point — no production targets)",
        "Document recon → exploit → privilege steps with commands used",
        "For each step: note which log/Event ID a SOC analyst would see",
        "Map at least 3 techniques to MITRE ATT&CK",
        "Publish public GitHub write-up (attack + defender sections)",
      ],
      steps: steps(
        { action: "Select machine; read rules of engagement and scope", durationMin: 10, logHint: "Machine name" },
        { action: "Complete machine to user flag (or room completion)", durationMin: 90, logHint: "Flag or room %" },
        { action: "Draft attack timeline with commands and screenshots", durationMin: 30, logHint: "Timeline bullets" },
        { action: "Add 'Blue team view' section: detections, Event IDs, mitigations", durationMin: 25, logHint: "3 detection ideas" },
        { action: "Publish GitHub repo; add public URL to portfolio artifact", durationMin: 20, logHint: "Public URL" },
      ),
    },
  },
  {
    id: "proj-python-soc",
    title: "Python SOC Tool — Log Parser Script",
    gate: "C",
    artifactType: "arac",
    value: 1.5,
    hoursEstimate: 15,
    summary:
      "Write a Python script that parses CSV/JSON logs, extracts IOCs, and outputs a summary report.",
    guide: {
      topic: "Python SOC Log Parser",
      resources: [
        { label: "TryHackMe — Python for Cybersecurity", url: "https://tryhackme.com/room/pythonforcybersecurity", type: "thm" },
        { label: "Python csv / json modules", url: "https://docs.python.org/3/library/csv.html", type: "doc" },
      ],
      actions: [
        "Pick sample log format (CSV auth log or JSON Sysmon export)",
        "Parse IPs, usernames, timestamps; flag anomalies (e.g. >5 failed logins)",
        "Output markdown or JSON summary report",
        "Publish script on GitHub with README and sample input/output",
      ],
      steps: steps(
        { action: "Define input format and 3 detection rules for the parser", durationMin: 15, logHint: "Rules list" },
        { action: "Implement parser with csv/json; add unit test with sample file", durationMin: 45, logHint: "Test passes" },
        { action: "Run on real or sample log; review output report", durationMin: 20, logHint: "Sample finding" },
        { action: "Publish GitHub repo with usage instructions", durationMin: 20, logHint: "Public URL" },
      ),
    },
  },
];

export function projectForGate(nextGateId: string | null | undefined): PortfolioProject | null {
  if (!nextGateId) return PORTFOLIO_PROJECTS[0];
  if (nextGateId === "B") return PORTFOLIO_PROJECTS.find((p) => p.gate === "B") ?? PORTFOLIO_PROJECTS[3];
  if (nextGateId === "C" || nextGateId === "D") return PORTFOLIO_PROJECTS[0];
  return null;
}
