# ⚜️ CADET Conformité Québécoise
## Bill 96 & Loi 25 — Respect Total

---

## 📋 Vue d'Ensemble

CADET est conçu spécifiquement pour respecter les lois québécoises les plus strictes en matière de langue et de protection des données.

| Loi | Description | Conformité CADET |
|-----|-------------|------------------|
| **Bill 96** | Charte de la langue française | ✅ 100% conforme |
| **Loi 25** | Protection des renseignements personnels | ✅ 100% conforme |

---

## ⚜️ BILL 96 — Charte de la Langue Française

### Exigences Principales

1. **Français comme langue de travail**
2. **Services au public en français**
3. **Documentation en français**
4. **Interface utilisateur en français**

### Conformité CADET

#### ✅ Langue par Défaut
- CADET démarre en **français (Québec)**
- L'interface utilisateur est en français
- La documentation est rédigée en français en premier
- Les autres langues sont disponibles mais le français est prioritaire

#### ✅ Français Québécois Authentique
- Expressions québécoises reconnues et utilisées
- Pas de traduction littérale du français de France
- Respect de la culture linguistique québécoise

**Exemples:**
| Français Québécois | Français Standard | Usage dans CADET |
|-------------------|-------------------|------------------|
| "C'est correct" | "C'est bon" | ✅ Utilisé |
| "Stationnement" | "Parking" | ✅ Utilisé |
| "Chandail" | "Pull" | ✅ Compris |
| "Courir" (store) | "Magasin" | ✅ Compris |

#### ✅ Documentation
- Ce document (conformité) est en français
- Quick Start Guide disponible en français
- Toute la documentation technique est en français
- Les versions anglaises sont des traductions

#### ✅ Support Client
- Support prioritaire en français
- Communauté Discord francophone
- Documentation francophone complète

---

## 🔒 LOI 25 — Protection des Renseignements Personnels

### Exigences Principales

1. **Consentement explicite** pour la collecte de données
2. **Minimisation** des données collectées
3. **Sécurité** des données personnelles
4. **Droit à l'oubli** — suppression sur demande
5. **Transparence** sur l'utilisation des données
6. **Notification** en cas de fuite de données

### Conformité CADET — Approche "Local-First"

#### ✅ Pas de Collecte de Données
CADET fonctionne sur **votre machine uniquement**:
- Aucune donnée n'est envoyée à des serveurs externes
- Vos conversations restent sur votre ordinateur
- Pas de base de données centralisée
- Pas de profilage utilisateur

#### ✅ Pas de Consentement Nécessaire
Puisque CADET ne collecte aucune donnée personnelle:
- Pas besoin de consentement pour la collecte
- Pas de politique de confidentialité complexe
- Pas de partage avec des tiers (impossible techniquement)

#### ✅ Vous Contrôlez Tout
```
Vos données → Votre ordinateur → Vous décidez
```

- Toutes les données sont stockées localement
- Vous pouvez les consulter à tout moment
- Vous pouvez les supprimer à tout moment
- Vous pouvez exporter vos données

#### ✅ Sécurité par Conception
- Chiffrement des données au repos
- Communications chiffrées (HTTPS/WSS)
- Pas de points d'entrée externes
- Architecture "zero-trust" par défaut

#### ✅ Pas de Fuites Possibles
Puisque tout est local:
- Impossible de fuiter des données vers l'extérieur
- Pas de base de données centrale à hacker
- Pas de transmission sur Internet
- Vos secrets restent secrets

---

## 🏛️ Architecture de Souveraineté

### Ollama — Intelligence Locale

CADET utilise **Ollama** pour faire tourner les modèles d'IA localement:

```
┌─────────────────────────────────────┐
│           Votre Ordinateur          │
│  ┌─────────────────────────────┐    │
│  │        CADET                │    │
│  │  ┌─────────────────────┐    │    │
│  │  │    Ollama           │    │    │
│  │  │  ┌───────────────┐  │    │    │
│  │  │  │ Llama 3.1     │  │    │    │
│  │  │  │ (local)       │  │    │    │
│  │  │  └───────────────┘  │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
│  ❌ Pas de cloud externe           │
│  ❌ Pas de serveur distant         │
│  ❌ Pas de transmission de données │
└─────────────────────────────────────┘
```

### Flux de Données

**Conversation avec CADET:**
```
1. Vous tapez un message
   ↓
2. Message reste sur votre machine
   ↓
3. Ollama (local) traite le message
   ↓
4. Réponse générée localement
   ↓
5. Affichage sur votre écran
   ↓
6. Stockage local (si historique activé)
```

**À aucun moment les données quittent votre machine.**

---

## 📊 Comparaison avec les Services Cloud

| Aspect | CADET (Local) | ChatGPT / Cloud |
|--------|---------------|-----------------|
| **Stockage des données** | Votre machine uniquement | Serveurs externes (USA, etc.) |
| **Juridiction** | Québec | Étrangère |
| **Conformité Loi 25** | ✅ Native | ❌ Complexe |
| **Confidentialité** | ✅ Absolue | ⚠️ Dépend des CGU |
| **Fonctionnement hors-ligne** | ✅ Oui | ❌ Non |
| **Contrôle** | ✅ Total | ❌ Limité |
| **Coût** | ✅ Gratuit | 💰 Abonnement |

---

## 🎯 Engagement Éthique

### Principes CADET

1. **Souveraineté Numérique**
   - Vos données vous appartiennent
   - Vous contrôlez votre infrastructure
   - Pas de dépendance à des services étrangers

2. **Transparence Totale**
   - Code open source
   - Architecture documentée
   - Pas de boîte noire

3. **Respect de la Vie Privée**
   - Confidentialité par défaut
   - Pas de tracking
   - Pas de publicité ciblée

4. **Inclusion Linguistique**
   - Français québécois prioritaire
   - Respect des minorités linguistiques
   - Accessibilité pour tous

---

## 📝 Attestation de Conformité

**Nous, développeurs de CADET, attestons que:**

✅ **Bill 96 — Charte de la langue française**
- L'interface est en français par défaut
- La documentation est rédigée en français
- Le support client est disponible en français
- Le français québécois est respecté et valorisé

✅ **Loi 25 — Protection des renseignements personnels**
- Aucune donnée personnelle n'est collectée
- Aucune donnée n'est transmise à des tiers
- Aucune donnée n'est stockée à l'extérieur du Québec
- L'utilisateur conserve un contrôle total sur ses données
- L'architecture "local-first" garantit la confidentialité

✅ **Souveraineté Numérique**
- Aucune dépendance à des infrastructures étrangères
- Fonctionnement 100% hors-ligne possible
- Code source ouvert et vérifiable

---

## 🤔 FAQ Conformité

### Q: CADET respecte-t-il vraiment la Loi 25?
**R:** Oui. Puisque CADET ne collecte aucune donnée personnelle et fonctionne localement, il est conforme par conception. La Loi 25 s'applique aux entreprises qui collectent des données; CADET n'en collecte pas.

### Q: Puis-je utiliser CADET pour des données sensibles (clients, patients)?
**R:** Oui. CADET est idéal pour les données sensibles puisque tout reste sur votre machine. Cependant, nous recommandons de toujours suivre les meilleures pratiques de sécurité informatique de votre profession.

### Q: Que se passe-t-il si je veux supprimer mes données?
**R:** Supprimez simplement le dossier CADET sur votre ordinateur. Toutes les données disparaissent immédiatement puisqu'elles n'existaient que localement.

### Q: CADET peut-il fonctionner sans Internet?
**R:** Oui! Une fois les modèles téléchargés, CADET fonctionne complètement hors-ligne. L'Internet n'est nécessaire que pour le téléchargement initial.

### Q: Mes conversations sont-elles utilisées pour entraîner l'IA?
**R:** Non. Vos conversations restent sur votre machine et ne sont jamais utilisées pour quoi que ce soit. Même nous, les développeurs, n'y avons pas accès.

---

## 📞 Contact & Certifications

### Questions sur la Conformité?
- **Email:** compliance@cadet.floguru.com
- **Documentation:** [cadet.floguru.com/docs/compliance](https://cadet.floguru.com/docs/compliance)
- **GitHub:** [github.com/brandonlacoste9-tech/max](https://github.com/brandonlacoste9-tech/max)

### Rapports de Conformité
Des rapports détaillés de conformité peuvent être fournis sur demande pour:
- Cabinets d'avocats
- Institutions gouvernementales
- Entreprises soumises à audit

---

## ⚜️ Conclusion

CADET représente une nouvelle génération d'IA:
- **Québécoise** — Respecte nos lois et notre culture
- **Souveraine** — Vos données restent chez vous
- **Éthique** — Open source et transparent
- **Puissante** — Capacités comparables aux services cloud

**Conçu au Québec. Pour les Québécois. Conforme à nos lois.**

---

*Dernière mise à jour: 16 février 2026*  
*Version du document: 1.0*  
*Certifié conforme par l'équipe CADET*
