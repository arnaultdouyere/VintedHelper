# VintedHelper — Instructions de génération

## Objectif produit
Construire **VintedHelper**, une application web sobre, moderne et responsive qui aide à :
1. **générer par IA** des contenus de fiches produit Vinted (titre, description, hashtags, prix éventuel),
2. **organiser** ces fiches dans des dossiers et sous-dossiers,
3. **sauvegarder des études de marché** avec photos, fourchettes de prix et notes structurées,
4. **retrouver et réutiliser rapidement** les contenus sauvegardés.

## Choix techniques attendus
Le générateur peut choisir le stack exact, mais il doit respecter les contraintes suivantes :
- **Base de données : Supabase**
- **Authentification : Supabase Auth**
- **Stockage images : Supabase Storage**
- **Front recommandé : Next.js + TypeScript + Tailwind CSS + shadcn/ui**
- **Back recommandé : Next.js App Router + Server Actions / Route Handlers**
- **Validation : Zod**
- **ORM / accès données : Supabase JS**
- **Déploiement cible : Vercel**

## Priorités produit
Priorité 1 : authentification et structure de données propre.
Priorité 2 : gestion des dossiers / sous-dossiers / pages produit.
Priorité 3 : génération IA assistée pour les annonces Vinted.
Priorité 4 : gestion des études de marché avec images et fourchette de prix.

## Modules fonctionnels à générer

### 1. Authentification
Créer un système d'authentification complet avec :
- inscription
- connexion
- déconnexion
- récupération / réinitialisation de mot de passe
- routes protégées
- séparation stricte des données par utilisateur

### 2. Gestion de dossiers et sous-dossiers — Génération d'annonces
Créer un module permettant :
- de créer, renommer, supprimer et déplacer des **dossiers**
- de créer, renommer, supprimer et déplacer des **sous-dossiers**
- d'ajouter des **pages produit** dans n'importe quel dossier / sous-dossier

Chaque **page produit “Annonce IA”** doit pouvoir contenir les champs suivants :
- `title` (optionnel)
- `description` (optionnel)
- `price` (optionnel)
- `hashtags` (optionnel mais fortement recommandé dans l'UX)
- `notes` (optionnel)
- `status` (brouillon, prêt, archivé)

Aucune des sections **titre / description / prix** n'est obligatoire.
L'utilisateur doit pouvoir enregistrer une page même avec un seul champ rempli.

Objectif UX : permettre à l'utilisateur de stocker et réutiliser ses générations IA pour ses annonces Vinted.

### 3. Gestion de dossiers et sous-dossiers — Études de marché
Créer un second type de **page produit “Étude de marché”** contenant :
- `title` (obligatoire côté UX, mais peut être vide techniquement avant sauvegarde finale)
- `description` / notes (optionnel)
- `images[]` sous forme de **carrousel**
- `minPrice` (optionnel)
- `maxPrice` (optionnel)
- `sourceUrl` (optionnel)
- `copiedImageUrl` ou métadonnée équivalente pour copier le lien de l'image

Exigences UX spécifiques :
- pouvoir **coller directement des images depuis le presse-papier**
- afficher les images dans un **carrousel fluide**
- si l'utilisateur clique sur une image, il peut **copier son lien**
- gérer l'upload des images dans Supabase Storage

Objectif UX : sauvegarder des recherches de niches et des comparatifs Vinted.

### 4. Génération IA
Prévoir l'architecture pour intégrer l'IA facilement.
Le MVP doit inclure :
- un bouton **“Générer avec l'IA”** sur les pages d'annonces
- un formulaire de prompt simple : catégorie, marque, taille, état, style, notes libres
- une sortie structurée : titre, description, hashtags, prix suggéré optionnel
- possibilité d'accepter, modifier puis sauvegarder le résultat

La logique IA doit être encapsulée pour pouvoir être remplacée facilement plus tard.

## Architecture métier recommandée
Utiliser une structure claire :
- `workspace` ou `folder tree`
- `folders`
- `product_pages`
- `market_research_pages`
- `images`
- `ai_generations`

Le système doit gérer une hiérarchie parent / enfant pour les dossiers.
Prévoir les cas d'usage suivants :
- un dossier racine contient des sous-dossiers
- un dossier contient plusieurs pages produit
- déplacement d'une page d'un dossier à un autre
- duplication d'une page

## Écrans minimums à générer
- landing page sobre
- login / signup / reset password
- dashboard principal
- vue arborescente dossiers / sous-dossiers
- page de création / édition d'annonce IA
- page de création / édition d'étude de marché
- vue détail d'une page produit
- paramètres du compte

## UI / Design
Le design doit être :
- **sobre**
- **user friendly**
- **responsive**
- dominé par des **tons blanc et bleu**
- lisible, aéré, moderne, sans excès visuel

Utiliser un style de SaaS moderne :
- cartes légères
- coins arrondis
- ombres discrètes
- hiérarchie typographique claire
- navigation simple
- bon état vide (empty states)

## Logo
Prévoir la génération d'un logo IA simple :
- nom : **VintedHelper**
- monogramme : **VH**
- forme : **carré arrondi**
- style : minimal, moderne, tech, propre
- couleurs : blanc + bleu

## Contraintes de sécurité
- toutes les données doivent être isolées par utilisateur
- les policies Supabase doivent être activées avec **RLS**
- aucune donnée ne doit fuiter entre utilisateurs
- vérifier les permissions sur storage et base de données

## Contraintes de qualité
- TypeScript strict
- composants réutilisables
- accessibilité minimale correcte
- formulaires robustes
- erreurs utilisateur explicites
- chargements et états vides bien gérés
- code propre et modulaire

## Données à préparer dans le projet
Le projet généré doit inclure :
- schéma Supabase / SQL initial
- seed minimal éventuel
- composants UI de base
- exemples de données
- README clair avec étapes d'installation
- `.env.example`

## Ce qu'il faut éviter
- architecture trop complexe pour un MVP
- design trop chargé
- dépendance forte à un provider IA unique
- champs imposés alors que l'utilisateur veut garder de la souplesse
- mélange des pages “annonce IA” et “étude de marché” sans distinction claire

## Résultat attendu
Le résultat final doit être un **MVP propre, cohérent, prêt à lancer localement**, avec une base solide pour ajouter ensuite :
- génération IA avancée
- tags personnalisés
- recherche globale
- duplication en masse
- export de fiches produit
