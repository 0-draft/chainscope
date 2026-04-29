import { Boxes, Cloud, Container, GitGraph, KeyRound, Workflow } from "lucide-react";

export interface Brand {
  id: string;
  name: string;
  abbr: string;
  color: string;
  fg?: string;
}

export const stageAccents: Record<string, string> = {
  source: "#f05032",
  deps: "#cb3837",
  build: "#2088ff",
  publish: "#2196f3",
  distribute: "#2496ed",
  consume: "#326ce5",
};

type IconComponent = typeof GitGraph;

export const stageIcons: Record<string, IconComponent> = {
  source: GitGraph,
  deps: Boxes,
  build: Workflow,
  publish: KeyRound,
  distribute: Cloud,
  consume: Container,
};

export const stageCmds: Record<string, string> = {
  source: "git push origin main",
  deps: "npm install --frozen-lockfile",
  build: "actions/checkout@v4",
  publish: "cosign sign + npm publish",
  distribute: "docker pull image@sha256:…",
  consume: "kubectl apply -f orion.yaml",
};

export const brands: Record<string, Brand> = {
  git: { id: "git", name: "git", abbr: "git", color: "#f05032" },
  github: {
    id: "github",
    name: "GitHub",
    abbr: "GH",
    color: "#1f2328",
    fg: "#f0f6fc",
  },
  gitlab: { id: "gitlab", name: "GitLab", abbr: "GL", color: "#fc6d26" },
  npm: { id: "npm", name: "npm", abbr: "npm", color: "#cb3837" },
  pip: { id: "pip", name: "pip", abbr: "pip", color: "#3775a9" },
  pypi: { id: "pypi", name: "PyPI", abbr: "pypi", color: "#3775a9" },
  cargo: { id: "cargo", name: "cargo", abbr: "cargo", color: "#bd5d2e" },
  ghactions: {
    id: "ghactions",
    name: "GitHub Actions",
    abbr: "GHA",
    color: "#2088ff",
  },
  bazel: { id: "bazel", name: "Bazel", abbr: "bazel", color: "#43a047" },
  jenkins: { id: "jenkins", name: "Jenkins", abbr: "jks", color: "#d33833" },
  sigstore: {
    id: "sigstore",
    name: "Sigstore",
    abbr: "sigst",
    color: "#2196f3",
  },
  docker: { id: "docker", name: "Docker Hub", abbr: "docker", color: "#2496ed" },
  ghcr: {
    id: "ghcr",
    name: "GHCR",
    abbr: "ghcr",
    color: "#1f2328",
    fg: "#f0f6fc",
  },
  oci: {
    id: "oci",
    name: "OCI",
    abbr: "oci",
    color: "#262626",
    fg: "#e8e1cd",
  },
  k8s: { id: "k8s", name: "Kubernetes", abbr: "k8s", color: "#326ce5" },
  containerd: {
    id: "containerd",
    name: "containerd",
    abbr: "ctd",
    color: "#3a86ff",
  },
  kyverno: { id: "kyverno", name: "Kyverno", abbr: "kyv", color: "#5b3c84" },
};

export const stageBrands: Record<string, readonly string[]> = {
  source: ["git", "github", "gitlab"],
  deps: ["npm", "pip", "cargo"],
  build: ["ghactions", "bazel", "jenkins"],
  publish: ["pypi", "npm", "sigstore"],
  distribute: ["docker", "ghcr", "oci"],
  consume: ["k8s", "kyverno", "containerd"],
};
