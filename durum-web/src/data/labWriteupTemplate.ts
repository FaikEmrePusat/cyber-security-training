/** Markdown skeleton for integrated lab / Gate C write-ups. */

export function buildLabWriteupMarkdown(topic: string, dateIso?: string): string {
  const date = dateIso ?? new Date().toISOString().slice(0, 10);
  return `# Lab Report: ${topic} — ${date}

## 1. Hypothesis & goal
- What question am I answering?
- Success criteria:

## 2. Environment / topology
- Hosts / VMs:
- Tools (Wireshark, Sysmon, Wazuh/Splunk, …):
- Network notes:

## 3. Attack simulation / traffic generation
| Step | Action | Expected signal |
|------|--------|-----------------|
| 1 |  |  |
| 2 |  |  |

## 4. Telemetry review
### Packet / network
- Filters used:
- Findings:

### Host / SIEM
- Event IDs / rule hits:
- False positives / noise:

## 5. Detection & hardening
- Detection idea (query / Sigma / alert):
- Containment / prevention note:

## 6. Key takeaways
1.
2.
3.

## 7. Public evidence URL
- GitHub / gist / Medium:
`;
}

export function slugifyTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "lab";
}

export function downloadLabWriteup(topic: string, dateIso?: string): void {
  const date = dateIso ?? new Date().toISOString().slice(0, 10);
  const md = buildLabWriteupMarkdown(topic, date);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${date}-${slugifyTopic(topic)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
