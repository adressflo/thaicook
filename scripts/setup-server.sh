#!/bin/bash

################################################################################
# Script d'Installation Automatique - Serveur Chanthana Thai Cook
# Hetzner CPX21 - Docker CE Ubuntu
# Version: 1.0
################################################################################

set -e  # Arrêter le script en cas d'erreur

echo "=========================================="
echo "🚀 Configuration Serveur Chanthana"
echo "=========================================="
echo ""

# Vérifier que le script est exécuté en tant que root
if [[ $EUID -ne 0 ]]; then
   echo "❌ Ce script doit être exécuté en tant que root (ou avec sudo)"
   exit 1
fi

echo "✅ Exécution en tant que root"
echo ""

# Étape 1 : Mise à jour du système
echo "📦 Étape 1/7 : Mise à jour du système..."
apt update && apt upgrade -y
echo "✅ Système mis à jour"
echo ""

# Étape 2 : Installation des paquets essentiels
echo "📦 Étape 2/7 : Installation des paquets essentiels..."
apt install -y \
    curl \
    wget \
    git \
    vim \
    ufw \
    fail2ban \
    htop \
    docker-compose-plugin
echo "✅ Paquets installés"
echo ""

# Étape 3 : Créer l'utilisateur chanthana
echo "👤 Étape 3/7 : Création de l'utilisateur 'chanthana'..."
if id "chanthana" &>/dev/null; then
    echo "⚠️  L'utilisateur 'chanthana' existe déjà"
else
    adduser --disabled-password --gecos "" chanthana
    echo "✅ Utilisateur 'chanthana' créé"
fi

# Ajouter aux groupes sudo et docker
usermod -aG sudo,docker chanthana
echo "✅ Utilisateur ajouté aux groupes sudo et docker"
echo ""

# Étape 4 : Configurer l'accès SSH pour chanthana
echo "🔑 Étape 4/7 : Configuration de l'accès SSH..."
mkdir -p /home/chanthana/.ssh
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys /home/chanthana/.ssh/
    chown -R chanthana:chanthana /home/chanthana/.ssh
    chmod 700 /home/chanthana/.ssh
    chmod 600 /home/chanthana/.ssh/authorized_keys
    echo "✅ Clés SSH copiées pour l'utilisateur chanthana"
else
    echo "⚠️  Aucune clé SSH trouvée pour root"
fi
echo ""

# Étape 5 : Sécuriser SSH
echo "🔒 Étape 5/7 : Sécurisation SSH..."
sed -i 's/#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
echo "✅ SSH sécurisé (root login désactivé, password auth désactivé)"
echo ""

# Étape 6 : Configuration du pare-feu UFW
echo "🛡️  Étape 6/7 : Configuration du pare-feu..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw --force enable
echo "✅ Pare-feu configuré"
echo ""

# Étape 7 : Créer la structure de répertoires
echo "📁 Étape 7/7 : Création de la structure de répertoires..."
mkdir -p /home/chanthana/docker/{traefik,n8n,app,portainer}
mkdir -p /home/chanthana/docker/traefik/{config,certs}
chown -R chanthana:chanthana /home/chanthana/docker
echo "✅ Répertoires créés"
echo ""

# Vérifications finales
echo "=========================================="
echo "🔍 Vérifications finales"
echo "=========================================="
echo ""

echo "Docker version:"
docker --version

echo ""
echo "Docker Compose version:"
docker compose version

echo ""
echo "Utilisateur 'chanthana' groupes:"
groups chanthana

echo ""
echo "Statut UFW:"
ufw status

echo ""
echo "=========================================="
echo "✅ Configuration serveur terminée !"
echo "=========================================="
echo ""
echo "📋 Prochaines étapes :"
echo "1. Déconnecte-toi de cette session root : exit"
echo "2. Reconnecte-toi en tant que chanthana : ssh chanthana@116.203.111.206"
echo "3. Déploie la stack Docker (Traefik + n8n + app)"
echo ""
echo "⚠️  IMPORTANT : Le login root est maintenant désactivé pour la sécurité"
echo "    Utilise uniquement l'utilisateur 'chanthana' avec sudo si nécessaire"
echo ""
