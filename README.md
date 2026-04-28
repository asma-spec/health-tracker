#  Health Tracker App

Application de suivi de santé quotidien avec analyse IA.

##  Description
Health Tracker permet aux utilisateurs de suivre leurs données de santé quotidiennes (poids, tension, fréquence cardiaque, sommeil, activité physique) et d'obtenir une analyse IA de leurs symptômes.

## 🏗️Architecture
health-tracking-app/
├── app/                    # Pages et API Next.js
│   ├── api/               # Routes API (auth, profile, dailyData, ai)
│   ├── dashboard/         # Page dashboard
│   ├── history/           # Page historique
│   └── profile/           # Page profil
├── lib/                   # Utilitaires (auth, mongodb)
├── models/                # Modèles Mongoose
├── docker/                # Configuration Docker
├── k8s/                   # Manifests Kubernetes
└── .github/workflows/     # Pipelines CI/CD
## 🛠️Stack Technique
- **Frontend** : Next.js 16, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Node.js
- **Base de données** : MongoDB (Mongoose)
- **Auth** : JWT
- **IA** : Analyse des symptômes
- **DevOps** : Docker, Kubernetes, ArgoCD, GitHub Actions
- **Monitoring** : Prometheus, Grafana

##  Instructions

### Prérequis
- Node.js v20+
- Docker
- kubectl
- Minikube

### Installation locale
```bash
git clone https://github.com/asma-spec/health-tracker.git
cd health-tracker
npm install
npm run dev
```

### Lancer avec Docker
```bash
docker build -t health-tracker:latest .
docker run -p 3000:3000 health-tracker:latest
```

### Lancer les tests
```bash
npm test
```

### Lancer le lint
```bash
npm run lint
```

##  Pipeline CI/CD
- **CI** : GitHub Actions (lint → test → build → SonarQube → Docker push)
- **CD** : ArgoCD + Kubernetes (déploiement automatique GitOps)

##  Monitoring
- Prometheus : collecte des métriques
- Grafana : dashboards de visualisation
- Endpoint : `/api/metrics`
