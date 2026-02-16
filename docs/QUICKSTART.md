# 🚀 CADET Quick Start Guide
## Intelligence Autonome pour le Québec

**Version:** 1.0.0  
**Date:** Février 2026  
**Langues:** Français (Québec), English, Español, Português

---

## 📥 Installation

### Option 1: Téléchargement Direct (Recommandé)

1. **Visitez:** [cadet.floguru.com](https://cadet.floguru.com)
2. **Choisissez votre version:**
   - **Version Complète (15 GB)** — 3 modèles IA (Llama 3.1, etc.)
   - **Version Lite (5 GB)** — 1 modèle IA (Llama 3.1)
3. **Téléchargez** le script d'installation pour Windows ou Mac
4. **Exécutez** le script (double-cliquez ou run dans terminal)

### Option 2: GitHub

```bash
# Clone le repo
git clone https://github.com/brandonlacoste9-tech/max.git
cd max

# Lance l'installation
# Windows:
.\installers\install-cadet-windows-fr.bat

# Mac:
bash installers/install-cadet-mac-fr.sh
```

---

## ⚙️ Configuration Système Requise

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| **OS** | Windows 10 / macOS 12 | Windows 11 / macOS 14 |
| **RAM** | 8 GB | 16 GB |
| **Espace disque** | 5 GB (Lite) / 15 GB (Full) | 20 GB+ |
| **Processeur** | Intel i5 / Apple M1 | Intel i7 / Apple M2+ |
| **Internet** | Requis pour téléchargement initial | Haute vitesse |

---

## 🎯 Premiers Pas

### 1. Démarrage

Après l'installation, CADET démarre automatiquement:

```bash
# Lancer CADET
cadet

# Ou manuellement
python floguru.py api
```

### 2. Accès à l'Interface

- **Dashboard:** http://localhost:3000
- **API:** http://localhost:8420
- **Documentation:** http://localhost:8420/docs

### 3. Première Conversation

1. Ouvrez le dashboard
2. Cliquez sur **"Parler à CADET"**
3. Tapez votre message dans la langue de votre choix
4. CADET répond instantanément!

**Exemples de messages:**
- `"Bonjour! Peux-tu m'aider à rédiger un contrat?"`
- `"Je suis plombier. Comment créer un site web?"`
- `"Résume-moi ce texte en français québécois"`

---

## 🗣️ Utilisation Multi-Canal

CADET est disponible sur plusieurs plateformes:

### WhatsApp
1. Ajoutez le numéro CADET à vos contacts
2. Envoyez un message
3. Réponse instantanée!

### Telegram
1. Cherchez `@CadetBot` sur Telegram
2. Démarrez une conversation
3. Parlez à CADET!

### Discord
1. Invitez CADET à votre serveur
2. Utilisez `!cadet <votre message>`
3. CADET répond dans le canal

---

## 🧠 Fonctionnalités Clés

### 1. Intelligence Autonome (Ollama)
- Fonctionne 100% hors-ligne
- Modèles téléchargés localement
- Aucune donnée envoyée au cloud

### 2. Expertise Spécialisée
CADET s'adapte à votre domaine:
- **Avocats:** Recherche juridique, rédaction de contrats
- **Plombiers:** Devis, planning, documentation
- **Thérapeutes:** Notes de session, ressources
- **Coachs:** Programmes, suivi clients
- **Diététistes:** Plans alimentaires, calculs
- **Publicitaires:** Copywriting, stratégies

### 3. Multi-Lingue
- 🇨🇦 **Français (Québec)** — Français québécois authentique
- 🇺🇸 **English** — Anglais international
- 🇪🇸 **Español** — Espagnol (Mexique, Venezuela)
- 🇧🇷 **Português** — Portugais brésilien

### 4. HyperHealing
CADET apprend de ses erreurs:
- Diagnostics automatiques
- Amélioration continue
- Auto-réparation

---

## 🔒 Confidentialité & Sécurité

### Conformité Québécoise
- ✅ **Loi 96:** Respect de la langue française
- ✅ **Loi 25:** Protection des renseignements personnels
- ✅ **Local-first:** Données jamais quittent votre machine
- ✅ **Chiffrement:** Toutes les communications sont chiffrées

### Vos Données
- **Stockage:** Uniquement sur votre ordinateur
- **Partage:** Aucun partage avec des tiers
- **Accès:** Vous seul contrôlez vos données
- **Suppression:** Supprimez quand vous voulez

---

## 🛠️ Dépannage

### Problème: "Espace disque insuffisant"
**Solution:** Utilisez la version Lite (5 GB) ou libérez de l'espace

### Problème: "Ollama ne démarre pas"
**Solution:**
```bash
# Vérifier si Ollama est installé
ollama --version

# Si non, réinstaller
# Windows:
winget install Ollama.Ollama

# Mac:
brew install ollama

# Télécharger les modèles
ollama pull llama3.1
```

### Problème: "Port 8420 déjà utilisé"
**Solution:**
```bash
# Trouver le processus
# Windows:
netstat -ano | findstr :8420

# Mac:
lsof -i :8420

# Tuer le processus ou changer de port
cadet --port 8421
```

### Problème: "CADET ne répond pas"
**Solution:**
1. Vérifiez que l'API tourne: `http://localhost:8420/api/health`
2. Redémarrez CADET: `cadet restart`
3. Consultez les logs: `cadet logs`

---

## 📚 Commandes Utiles

```bash
# Démarrer CADET
cadet

# Démarrer en arrière-plan
cadet --daemon

# Arrêter CADET
cadet stop

# Redémarrer
cadet restart

# Voir les logs
cadet logs

# Mode diagnostic
cadet doctor

# Mettre à jour
cadet update

# Vérifier la santé
curl http://localhost:8420/api/health
```

---

## 🎯 Cas d'Usage

### Pour les Avocats
```
"Rédige-moi un contrat de service standard pour un client"
"Explique-moi les implications de la Loi 25 sur mon cabinet"
"Résume cet arrêt de la Cour d'appel du Québec"
```

### Pour les Plombiers
```
"Crée-moi un devis type pour une installation de chauffe-eau"
"Rédige un email de relance pour un client qui ne paie pas"
"Comment répondre à une critique négative Google?"
```

### Pour les Thérapeutes
```
"Génère un résumé de ma session avec notes anonymisées"
"Donne-moi des ressources sur la gestion du stress"
"Rédige un plan de traitement pour l'anxiété"
```

### Pour les Coachs
```
"Crée un programme d'entraînement de 12 semaines pour débutant"
"Rédige un post Instagram sur la motivation"
"Comment structurer un appel de découverte?"
```

---

## 🤝 Contribuer

CADET est open source! Vous pouvez:

1. **Signaler des bugs:** [GitHub Issues](https://github.com/brandonlacoste9-tech/max/issues)
2. **Proposer des fonctionnalités:** Pull requests welcome!
3. **Traduire:** Aidez à traduire dans plus de langues
4. **Documenter:** Améliorez cette documentation

```bash
# Fork le repo
# Créez une branche
git checkout -b feature/ma-fonctionnalite

# Commitez vos changements
git commit -m "Ajout de ma fonctionnalité"

# Poussez
git push origin feature/ma-fonctionnalite

# Créez une Pull Request
```

---

## 📞 Support

### Communauté
- **Discord:** [Rejoignez le serveur CADET](https://discord.gg/cadet)
- **GitHub Discussions:** Questions et réponses
- **Reddit:** r/CADET_Quebec

### Contact Direct
- **Email:** support@cadet.floguru.com
- **Twitter:** @CADET_Quebec

---

## 🗺️ Feuille de Route

### v1.1 (Mars 2026)
- [ ] Mode hors-ligne complet
- [ ] Application mobile
- [ ] Intégration calendrier

### v1.2 (Avril 2026)
- [ ] Voix (ElevenLabs)
- [ ] Vision (analyse d'images)
- [ ] Plus de modèles IA

### v2.0 (Été 2026)
- [ ] Expansion au Mexique
- [ ] Expansion au Brésil
- [ ] CADET Enterprise

---

## ⚜️ Merci!

Merci d'utiliser CADET — l'intelligence artificielle autonome du Québec.

**Conçu au Québec. Pour les Québécois.**

*Respecte la Loi 96 et la Loi 25.*

---

**Version:** 1.0.0  
**Dernière mise à jour:** 16 février 2026  
**Licence:** MIT  
**Auteur:** Brandon "Bee" Lacoste
