# Guide de Déploiement - Chanthana Thai Cook sur Hetzner

## 📦 Stack Complète

- **Traefik v3.0** : Reverse proxy avec SSL automatique (Let's Encrypt)
- **n8n** : Plateforme d'automatisation (image officielle `docker.n8n.io/n8nio/n8n`)
- **Landing Page** : Page "Coming Soon" avec Nginx
- **Docker Compose v2** : Orchestration des services

## 🎯 Architecture

```
Internet
   ↓
Traefik (ports 80/443)
   ↓
┌─────────────────────────────────────┐
│  n8n.cthaicook.com    → n8n:5678   │
│  cthaicook.com        → landing:80  │
└─────────────────────────────────────┘
```

## 🚀 Déploiement sur Hetzner (116.203.111.206)

### 1. Connexion SSH
```bash
ssh root@116.203.111.206
```

### 2. Aller dans le répertoire Docker
```bash
cd /root/docker
```

### 3. Mettre à jour la configuration

Les fichiers ont été mis à jour :
- ✅ `version: '3.8'` supprimée (obsolète Docker Compose v2)
- ✅ Image officielle n8n : `docker.n8n.io/n8nio/n8n`
- ✅ Basic Auth supprimé de n8n
- ✅ Configuration production optimisée

### 4. Appliquer les changements

```bash
# Créer le répertoire pour les fichiers n8n
mkdir -p local-files

# Pull la nouvelle image officielle n8n
docker compose pull n8n

# Redémarrer n8n avec la nouvelle configuration
docker compose up -d n8n

# Vérifier que tout fonctionne
docker compose ps
docker compose logs n8n --tail 50
```

### 5. Accès n8n

1. Ouvrir https://n8n.cthaicook.com
2. **PLUS de popup Basic Auth** ✅
3. Créer votre premier compte admin n8n directement
4. Configurer 2FA pour sécurité maximale

## 📋 Changements Appliqués

### Configuration n8n Mise à Jour

**Avant (obsolète)** :
```yaml
image: n8nio/n8n:latest  ❌
N8N_BASIC_AUTH_ACTIVE=true  ❌
```

**Maintenant (production ready)** :
```yaml
image: docker.n8n.io/n8nio/n8n  ✅
NODE_ENV=production  ✅
N8N_RUNNERS_ENABLED=true  ✅
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true  ✅
```

### Avantages de la Nouvelle Configuration

1. **Image officielle** : Mises à jour directes depuis n8n
2. **Performance** : Runners activés pour meilleures performances
3. **Sécurité** : Security headers HTTP, permissions renforcées
4. **Simplicité** : Plus de double authentification confuse
5. **Production** : Variables d'environnement optimisées

## 🔄 Workflow Développement → Production

### Architecture Complète

```
┌─────────────────────────────────────────┐
│  DÉVELOPPEMENT LOCAL (Windows Desktop)  │
│  - Docker Desktop                       │
│  - n8n local (port 5678)               │
│  - MCP server n8n                       │
│  - Création workflows                   │
│  - Tests en local                       │
└─────────────────────────────────────────┘
                  ↓
          Export JSON workflows
                  ↓
┌─────────────────────────────────────────┐
│  PRODUCTION HETZNER                     │
│  - n8n.cthaicook.com                   │
│  - Import workflows                     │
│  - Activation production                │
│  - Monitoring & logs                    │
└─────────────────────────────────────────┘
```

### Prochaine Étape : Configuration n8n Local

Créer `docker-compose.yml` pour Windows Desktop :

```yaml
version: '3.8'

services:
  n8n-local:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n-local
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - GENERIC_TIMEZONE=Europe/Paris
      - TZ=Europe/Paris
      - N8N_DIAGNOSTICS_ENABLED=false
      - DB_TYPE=sqlite
    volumes:
      - n8n_data_local:/home/node/.n8n
      - ./local-files:/files

volumes:
  n8n_data_local:
```

**Commandes Windows** :
```powershell
# Démarrer n8n local
docker-compose up -d

# Accès : http://localhost:5678
```

## 🛠️ Commandes Utiles

### Gestion n8n Hetzner

```bash
# Logs en temps réel
docker compose logs -f n8n

# Vérifier la version
docker exec n8n n8n --version

# Redémarrer n8n
docker compose restart n8n

# Mettre à jour vers dernière version
docker compose pull n8n && docker compose up -d n8n
```

### Sauvegarde Données

```bash
# Backup manuel n8n
docker run --rm \
  -v docker_n8n_data:/source:ro \
  -v /root/backups:/backup \
  alpine tar czf /backup/n8n-$(date +%Y%m%d-%H%M%S).tar.gz -C /source .

# Lister les sauvegardes
ls -lh /root/backups/
```

## 🔍 Vérifications Post-Déploiement

```bash
# 1. Vérifier tous les conteneurs
docker compose ps
# Tous doivent être "Up"

# 2. Tester SSL
curl -I https://n8n.cthaicook.com
# Doit retourner HTTP/2 200

# 3. Vérifier les logs
docker compose logs --tail 100

# 4. Espace disque
docker system df
```

## 🚨 Dépannage

### Si n8n ne démarre pas

```bash
# Voir les erreurs
docker compose logs n8n

# Recréer le conteneur
docker compose up -d --force-recreate n8n
```

### Si certificat SSL invalide

```bash
# Vérifier Traefik
docker compose logs traefik | grep -i error

# Forcer renouvellement certificat
docker compose restart traefik
```

## 📊 Monitoring

### Vérifier l'état du système

```bash
# Ressources utilisées
docker stats --no-stream

# Logs système
journalctl -u docker -f

# Espace disque
df -h
```

---

**Documentation complète** : https://docs.n8n.io/hosting/
**MCP n8n servers** : `/leonardsellem/n8n-mcp-server`, `/coleam00/n8n-nodes-mcp`
