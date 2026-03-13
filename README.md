# SafeDoc App

Plateforme d'impression sécurisée de documents officiels.

## Structure du repo

```
safedoc-app/          ← repo racine
├── netlify.toml      ← config déploiement Netlify
├── .gitignore
└── safedoc-app/      ← application React (Create React App)
    ├── package.json
    ├── public/
    └── src/
```

## Démarrage local

```bash
cd safedoc-app
npm install
npm start
```

Démo : `demo@safedoc.sn` / `demo123`

## Déploiement Netlify

| Paramètre | Valeur |
|---|---|
| Base directory | `safedoc-app` |
| Build command | `CI= npm install && npm run build` |
| Publish directory | `build` |
| Node version | 18 |
