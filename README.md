# VintedHelper

VintedHelper est une application web moderne pour vous aider à créer, stocker et organiser vos annonces Vinted ainsi que vos études de marché.

![VintedHelper](/assets/placeholder)

## 📋 Fonctionnalités (Phase 1 MVP)
- **Authentification Sécurisée** par Supabase.
- **Arborescence de Dossiers** : Organisez vos recherches et vos brouillons d'annonces de manière infinie.
- **Annonces (Product Pages)** : Préparez vos fiches avec titre, description complète, hashtags cachés et prix de vente.
- **Études de Marché** : Copiez-collez facilement des images (Ctrl+V) depuis le web pour vous constituer une base de données de la concurrence.
- **Images sur le Cloud** : Stockées sur Supabase Storage de manière sécurisée ou publique selon votre choix.

## 🚀 Installation & Lancement

### 1. Backend (Supabase)
1. Créez un compte gratuit et un projet sur [Supabase](https://supabase.com).
2. Ouvrez le **SQL Editor** sur votre dashboard Supabase.
3. Copiez le contenu du fichier `supabase/schema.sql` (situé à la racine de ce dossier) et exécutez-le via l'éditeur SQL.
   *(Cette étape s'assurera de créer vos tables : `folders`, `product_pages`, `market_research_pages`, `images` ainsi que le bucket de stockage `assets` et toutes les politiques de sécurité (RLS)).*

### 2. Configuration du Projet (`.env`)
À la racine de ce projet, renommez le fichier `.env.example` en `.env.local` et complétez les informations suivantes que vous trouverez dans les paramètres de votre projet Supabase (Project Settings > API) :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_projet_ici
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_ici
```

### 3. Lancer en local
Pour lancer le serveur de développement :
```bash
npm install
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠️ Stack technique
- **Frontend** : Next.js 14+ (App Router), React, TailwindCSS.
- **UI Components** : shadcn/ui.
- **Base de données / Auth / Storage** : Supabase.

## 🌍 Déploiement
Le projet est optimisé pour être déployé sur [Vercel](https://vercel.com).
Assurez-vous d'ajouter vos variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`) dans les paramètres de Vercel lors de votre déploiement.
