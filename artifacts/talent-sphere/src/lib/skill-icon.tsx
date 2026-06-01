import { useState, useEffect } from "react";

const SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org";
const DEVICONS_CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const SKILL_SLUG_MAP: Record<string, string> = {
  // Frontend frameworks
  react: "react",
  "react.js": "react",
  reactjs: "react",
  angular: "angular",
  vue: "vuedotjs",
  "vue.js": "vuedotjs",
  vuejs: "vuedotjs",
  svelte: "svelte",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  next: "nextdotjs",
  nuxt: "nuxtdotjs",
  "nuxt.js": "nuxtdotjs",
  solid: "solid",
  solidjs: "solid",
  astro: "astro",
  remix: "remix",
  gatsby: "gatsby",
  "ember.js": "emberdotjs",
  ember: "emberdotjs",

  // Languages
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  python: "python",
  java: "java",
  go: "go",
  golang: "go",
  rust: "rust",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  php: "php",
  "c#": "csharp",
  csharp: "csharp",
  "c++": "cplusplus",
  cpp: "cplusplus",
  "c lang": "c",
  scala: "scala",
  elixir: "elixir",
  erlang: "erlang",
  haskell: "haskell",
  clojure: "clojure",
  dart: "dart",
  r: "r",
  perl: "perl",
  lua: "lua",
  groovy: "apachegroovy",
  "f#": "fsharp",
  julia: "julia",
  zig: "zig",

  // Mobile
  flutter: "flutter",
  "react native": "react",
  ionic: "ionic",
  android: "android",
  ios: "apple",
  expo: "expo",
  xamarin: "xamarin",

  // Backend frameworks
  "node.js": "nodedotjs",
  nodejs: "nodedotjs",
  node: "nodedotjs",
  express: "express",
  "express.js": "express",
  "nest.js": "nestjs",
  nestjs: "nestjs",
  fastify: "fastify",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  spring: "spring",
  "spring boot": "springboot",
  laravel: "laravel",
  rails: "rubyonrails",
  "ruby on rails": "rubyonrails",
  asp: "dotnet",
  ".net": "dotnet",
  dotnet: "dotnet",
  gin: "go",
  fiber: "go",
  actix: "rust",
  axum: "rust",
  symfony: "symfony",
  grpc: "grpc",

  // Databases
  postgresql: "postgresql",
  postgres: "postgresql",
  "pl/sql": "oracle",
  plsql: "oracle",
  oracle: "oracle",
  mysql: "mysql",
  sqlite: "sqlite",
  mongodb: "mongodb",
  mongo: "mongodb",
  redis: "redis",
  firebase: "firebase",
  dynamodb: "amazondynamodb",
  cassandra: "apachecassandra",
  elasticsearch: "elasticsearch",
  cockroachdb: "cockroachlabs",
  snowflake: "snowflake",
  databricks: "databricks",
  bigquery: "googlebigquery",
  "sql server": "microsoftsqlserver",
  mssql: "microsoftsqlserver",
  mariadb: "mariadb",
  neo4j: "neo4j",
  supabase: "supabase",
  prisma: "prisma",
  sequelize: "sequelize",
  drizzle: "drizzle",

  // Cloud & DevOps
  aws: "amazonaws",
  "amazon web services": "amazonaws",
  azure: "microsoftazure",
  "microsoft azure": "microsoftazure",
  gcp: "googlecloud",
  "google cloud": "googlecloud",
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  helm: "helm",
  terraform: "terraform",
  ansible: "ansible",
  jenkins: "jenkins",
  "github actions": "githubactions",
  "gitlab ci": "gitlab",
  circleci: "circleci",
  "travis ci": "travisci",
  argocd: "argo",
  pulumi: "pulumi",
  cloudflare: "cloudflare",
  vercel: "vercel",
  netlify: "netlify",
  heroku: "heroku",
  "digital ocean": "digitalocean",
  digitalocean: "digitalocean",
  fly: "fly",
  railway: "railway",

  // Version control
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  mercurial: "mercurial",

  // CSS & Styling
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  tailwindcss: "tailwindcss",
  sass: "sass",
  scss: "sass",
  bootstrap: "bootstrap",
  "material ui": "mui",
  mui: "mui",
  "chakra ui": "chakraui",
  shadcn: "shadcnui",
  "ant design": "antdesign",
  "styled components": "styledcomponents",
  css: "css3",
  html: "html5",

  // Build tools
  webpack: "webpack",
  vite: "vite",
  esbuild: "esbuild",
  rollup: "rollupdotjs",
  parcel: "parcel",
  babel: "babel",
  eslint: "eslint",
  prettier: "prettier",

  // Testing
  jest: "jest",
  vitest: "vitest",
  cypress: "cypress",
  playwright: "playwright",
  selenium: "selenium",
  storybook: "storybook",

  // BI & Analytics
  qlik: "qlik",
  "qlik sense": "qlik",
  "power bi": "powerbi",
  tableau: "tableau",
  grafana: "grafana",
  looker: "looker",
  metabase: "metabase",
  dbt: "dbt",
  airflow: "apacheairflow",
  spark: "apachespark",
  kafka: "apachekafka",
  hadoop: "apachehadoop",

  // Design
  figma: "figma",
  sketch: "sketch",
  xd: "adobexd",
  "adobe xd": "adobexd",
  photoshop: "adobephotoshop",
  illustrator: "adobeillustrator",
  indesign: "adobeindesign",
  framer: "framer",
  canva: "canva",
  webflow: "webflow",

  // AI & ML
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  keras: "keras",
  "scikit-learn": "scikitlearn",
  "scikit learn": "scikitlearn",
  opencv: "opencv",
  huggingface: "huggingface",
  openai: "openai",
  langchain: "langchain",
  mlflow: "mlflow",

  // Other tools
  graphql: "graphql",
  "rest api": "openapiinitiative",
  linux: "linux",
  ubuntu: "ubuntu",
  debian: "debian",
  fedora: "fedoralinux",
  bash: "gnubash",
  shell: "gnubash",
  vim: "vim",
  neovim: "neovim",
  "vs code": "visualstudiocode",
  vscode: "visualstudiocode",
  intellij: "intellijidea",
  webstorm: "webstorm",
  postman: "postman",
  insomnia: "insomnia",
  nginx: "nginx",
  apache: "apache",
  rabbitmq: "rabbitmq",
  "socket.io": "socketdotio",
  strapi: "strapi",
  contentful: "contentful",
  wordpress: "wordpress",
  shopify: "shopify",
  jira: "jira",
  confluence: "confluence",
  slack: "slack",
  notion: "notion",
  excel: "microsoftexcel",
  powerpoint: "microsoftpowerpoint",
  word: "microsoftword",
  teams: "microsoftteams",
  abap: "sap",
  sap: "sap",
  salesforce: "salesforce",
};

const DEVICONS_SLUG_MAP: Record<string, string> = {
  python: "python",
  java: "java",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  react: "react",
  "react.js": "react",
  reactjs: "react",
  angular: "angularjs",
  vue: "vuejs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  "next.js": "nextjs",
  nextjs: "nextjs",
  svelte: "svelte",
  go: "go",
  golang: "go",
  rust: "rust",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  php: "php",
  "c#": "csharp",
  csharp: "csharp",
  "c++": "cplusplus",
  cpp: "cplusplus",
  scala: "scala",
  dart: "dart",
  flutter: "flutter",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  express: "express",
  django: "django",
  flask: "flask",
  "spring boot": "spring",
  spring: "spring",
  laravel: "laravel",
  "ruby on rails": "rails",
  rails: "rails",
  ".net": "dot-net",
  dotnet: "dot-net",
  postgresql: "postgresql",
  postgres: "postgresql",
  mysql: "mysql",
  sqlite: "sqlite",
  mongodb: "mongodb",
  mongo: "mongodb",
  redis: "redis",
  firebase: "firebase",
  elasticsearch: "elasticsearch",
  "sql server": "microsoftsqlserver",
  mssql: "microsoftsqlserver",
  mariadb: "mariadb",
  neo4j: "neo4j",
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  terraform: "terraform",
  ansible: "ansible",
  jenkins: "jenkins",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  sass: "sass",
  bootstrap: "bootstrap",
  webpack: "webpack",
  vite: "vitejs",
  babel: "babel",
  jest: "jest",
  figma: "figma",
  photoshop: "photoshop",
  illustrator: "illustrator",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  opencv: "opencv",
  linux: "linux",
  ubuntu: "ubuntu",
  debian: "debian",
  bash: "bash",
  vim: "vim",
  "vs code": "vscode",
  vscode: "vscode",
  intellij: "intellij",
  nginx: "nginx",
  apache: "apache",
  wordpress: "wordpress",
  shopify: "shopify",
  jira: "jira",
  confluence: "confluence",
  android: "android",
  ios: "apple",
  aws: "amazonwebservices",
  "amazon web services": "amazonwebservices",
  azure: "azure",
  "microsoft azure": "azure",
  gcp: "googlecloud",
  "google cloud": "googlecloud",
  graphql: "graphql",
  heroku: "heroku",
  digitalocean: "digitalocean",
  "digital ocean": "digitalocean",
  vercel: "vercel",
  "oracle": "oracle",
  "pl/sql": "oracle",
  plsql: "oracle",
  groovy: "groovy",
  lua: "lua",
  perl: "perl",
  haskell: "haskell",
  elixir: "elixir",
  erlang: "erlang",
  clojure: "clojure",
  r: "r",
  slack: "slack",
  trello: "trello",
  "c lang": "c",
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const MIN_SUBSTRING_KEY_LEN = 4;

function resolveSlug(name: string, map: Record<string, string>): string | null {
  const n = normalize(name);
  if (map[n]) return map[n];
  for (const [key, slug] of Object.entries(map)) {
    if (key.length >= MIN_SUBSTRING_KEY_LEN && n.includes(key)) return slug;
  }
  return null;
}

export function getSkillIconUrl(name: string): string | null {
  const slug = resolveSlug(name, SKILL_SLUG_MAP);
  return slug ? `${SIMPLE_ICONS_CDN}/${slug}` : null;
}

export function getDeviconsIconUrl(name: string): string | null {
  const slug = resolveSlug(name, DEVICONS_SLUG_MAP);
  return slug ? `${DEVICONS_CDN}/${slug}/${slug}-original.svg` : null;
}

type ErrorStage = 0 | 1 | 2;

interface SkillIconProps {
  name: string;
  fallback?: string;
  size?: number;
  className?: string;
}

export function SkillIcon({ name, fallback = "⚙️", size = 20, className = "" }: SkillIconProps) {
  const [errorStage, setErrorStage] = useState<ErrorStage>(0);

  useEffect(() => {
    setErrorStage(0);
  }, [name]);

  const simpleUrl = getSkillIconUrl(name);
  const deviconsUrl = getDeviconsIconUrl(name);

  if (errorStage === 2 || (!simpleUrl && !deviconsUrl)) {
    return (
      <span className={className} style={{ fontSize: size * 0.85, lineHeight: 1 }}>
        {fallback}
      </span>
    );
  }

  const src = errorStage === 0 ? (simpleUrl ?? deviconsUrl!) : deviconsUrl!;

  const handleError = () => {
    if (errorStage === 0 && deviconsUrl) {
      setErrorStage(1);
    } else {
      setErrorStage(2);
    }
  };

  return (
    <img
      key={`${name}-${errorStage}`}
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`inline-block object-contain dark:invert ${className}`}
      style={{ width: size, height: size }}
      onError={handleError}
    />
  );
}
