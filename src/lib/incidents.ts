export type StageId = "source" | "deps" | "build" | "publish" | "distribute" | "consume";

export interface Link {
  label: string;
  url: string;
}

export interface Incident {
  stageId: StageId;
  num: string;
  stageLabel: string;
  question: string;
  attackName: string;
  attackDate: string;
  attackOneLine: string;
  attackArtifact: string[];
  defenseName: string;
  defenseOneLine: string;
  defenseArtifact: string[];
  links: Link[];
}

export const incidents: readonly Incident[] = [
  {
    stageId: "source",
    num: "01",
    stageLabel: "SOURCE",
    question: "who can change the code, and how do you know they meant to?",
    attackName: "xz-utils backdoor",
    attackDate: "2024-03-29",
    attackOneLine:
      "two years of social engineering. payload hidden in the release tarball, not the git repo.",
    attackArtifact: [
      "$ tar -xf xz-5.6.1.tar.gz",
      "$ ./configure && make",
      "  -> sshd backdoor wired in via test fixtures",
      "  CVE-2024-3094 / CVSS 10.0",
    ],
    defenseName: "commit signing + reproducible release",
    defenseOneLine:
      "gitsign binds a commit to a real OIDC identity. a reproducible tarball reveals tarball-only payloads.",
    defenseArtifact: [
      "$ git verify-commit HEAD",
      "  Good signature from Andres Freund",
      "$ diff <(tar tzf xz-5.6.1.tar.gz) <(git archive v5.6.1 | tar tz)",
      "  -> 0 differences",
    ],
    links: [
      {
        label: "Andres Freund disclosure",
        url: "https://www.openwall.com/lists/oss-security/2024/03/29/4",
      },
      {
        label: "Russ Cox reconstruction",
        url: "https://research.swtch.com/xz-script",
      },
    ],
  },
  {
    stageId: "deps",
    num: "02",
    stageLabel: "DEPS",
    question: "your code is mostly other people's code. whose, exactly?",
    attackName: "Shai-Hulud npm worm",
    attackDate: "2025-09-14",
    attackOneLine:
      "first self-replicating worm in a public registry. each infected developer launched the next wave.",
    attackArtifact: [
      "$ npm install rxjs",
      "  added 482 packages in 4s",
      "  postinstall: stole NPM_TOKEN, GH_TOKEN, .pypirc",
      "  republished as new versions of every owned package",
    ],
    defenseName: "lockfile + SBOM diff at install",
    defenseOneLine:
      "hash-pinned lockfile + SBOM diff means a republished version is a foreign thing, not 'an update'.",
    defenseArtifact: [
      "$ npm ci",
      "  resolves only what package-lock.json hashes match",
      "$ syft scan dir:. -o spdx-json | grep sha512",
      "  -> diff vs last build: 0 changes",
    ],
    links: [
      {
        label: "Unit 42 writeup",
        url: "https://unit42.paloaltonetworks.com/npm-supply-chain-attack/",
      },
      {
        label: "CISA alert",
        url: "https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem",
      },
    ],
  },
  {
    stageId: "build",
    num: "03",
    stageLabel: "BUILD",
    question: "the artifact is not the source. who turned one into the other?",
    attackName: "tj-actions/changed-files",
    attackDate: "2025-03-14",
    attackOneLine:
      "every existing version tag rewritten to point at one malicious commit. 23,000 repos ran it for 15 hours.",
    attackArtifact: [
      "uses: tj-actions/changed-files@v44",
      "  -> tag silently retargeted to malicious SHA",
      "  echoed every CI secret to the public log (base64)",
      "  CVE-2025-30066",
    ],
    defenseName: "SHA pin + SLSA provenance",
    defenseOneLine:
      "a commit SHA cannot be silently moved. SLSA provenance proves what commit, what builder, what inputs.",
    defenseArtifact: [
      "uses: tj-actions/changed-files@a284dc1aef...  # full SHA",
      "$ slsa-verifier verify-artifact build.tgz \\",
      "    --provenance build.intoto.jsonl \\",
      "    --source-uri github.com/me/repo",
      "  -> PASSED",
    ],
    links: [
      {
        label: "CISA alert",
        url: "https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction",
      },
      {
        label: "OX Security timeline",
        url: "https://www.ox.security/blog/15-hours-of-open-sourced-hell-lessons-learned-from-tj-actions-changed-files/",
      },
    ],
  },
  {
    stageId: "publish",
    num: "04",
    stageLabel: "PUBLISH",
    question: "the artifact has a name now. who put it there?",
    attackName: "TeamPCP / LiteLLM compromise",
    attackDate: "2026-03-24",
    attackOneLine:
      "TeamPCP poisoned Trivy upstream. LiteLLM's CI ran apt-installed Trivy, which exfiltrated PYPI_PUBLISH and pushed 1.82.7 + 1.82.8 for 40 minutes.",
    attackArtifact: [
      "$ pip install litellm   # 2026-03-24 10:39-11:19 UTC",
      "  Successfully installed litellm-1.82.8",
      "  CI's apt-pinned-nothing Trivy stole PYPI_PUBLISH,",
      "  attacker pushed 1.82.7 + 1.82.8 with a credstealer",
    ],
    defenseName: "Sigstore + trusted publisher (OIDC)",
    defenseOneLine:
      "a release is signed by a specific GitHub workflow identity. a stolen password cannot publish.",
    defenseArtifact: [
      "$ cosign verify-blob litellm-1.51.4.tar.gz \\",
      "    --certificate-identity-regexp \\",
      "    'https://github.com/BerriAI/litellm/.github/workflows/publish.yml@.*' \\",
      "    --certificate-oidc-issuer https://token.actions.githubusercontent.com",
      "  -> PASSED",
    ],
    links: [
      {
        label: "Datadog Security Labs",
        url: "https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/",
      },
      {
        label: "LiteLLM disclosure",
        url: "https://docs.litellm.ai/blog/security-update-march-2026",
      },
    ],
  },
  {
    stageId: "distribute",
    num: "05",
    stageLabel: "DISTRIBUTE",
    question: "the name resolves to bytes somewhere. to whose?",
    attackName: "pgserve / CanisterSprawl",
    attackDate: "2026-04-21",
    attackOneLine:
      "the real pgserve, hijacked. postinstall harvested NPM/GH/cloud creds and self-propagated by republishing the maintainer's other packages.",
    attackArtifact: [
      "$ npm install pgserve   # 2026-04-21 22:14 UTC",
      "  postinstall harvested NPM/GH/AWS/k8s/SSH creds,",
      "  exfil to ICP canister cjn37-uyaaa-aaaac-qgnva-cai,",
      "  republished maintainer's owned packages (worm)",
    ],
    defenseName: "registry attestation + --ignore-scripts",
    defenseOneLine:
      "registry-served Sigstore attestations prove bytes came from the expected workflow. --ignore-scripts contains postinstall in CI.",
    defenseArtifact: [
      "$ npm install pgserve --ignore-scripts",
      "$ npm audit signatures",
      "  -> attestation issuer != expected workflow",
      "  -> install rejected",
    ],
    links: [
      {
        label: "The Register coverage",
        url: "https://www.theregister.com/2026/04/22/another_npm_supply_chain_attack/",
      },
      {
        label: "The Hacker News writeup",
        url: "https://thehackernews.com/2026/04/self-propagating-supply-chain-worm.html",
      },
    ],
  },
  {
    stageId: "consume",
    num: "06",
    stageLabel: "CONSUME",
    question: "the artifact is on the box. should it be allowed to run?",
    attackName: "SUNSPOT / SolarWinds (anchor)",
    attackDate: "2020-12-13",
    attackOneLine:
      "a poisoned binary signed by the legitimate pipeline reached thousands of customers as an official update.",
    attackArtifact: [
      "$ kubectl apply -f orion.yaml",
      "  image: solarwinds/orion@sha256:3c1...",
      "  signed by official cosign key",
      "  payload: SUNBURST C2",
    ],
    defenseName: "cosign verify + admission policy + VEX",
    defenseOneLine: "refuse to run an image whose signature does not match an expected identity.",
    defenseArtifact: [
      "apiVersion: kyverno.io/v1",
      "kind: ClusterPolicy",
      "spec.rules[0].verifyImages:",
      "  imageReferences: ['*']",
      "  attestors[0].entries[0].keyless.subject:",
      "    'https://github.com/me/repo/.github/workflows/ci.yml@*'",
    ],
    links: [
      {
        label: "CrowdStrike SUNSPOT analysis",
        url: "https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/",
      },
      {
        label: "CISA SolarWinds advisory",
        url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a",
      },
    ],
  },
] as const;
