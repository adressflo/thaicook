# ================================================================
# Script d'Optimisation Configuration MCP Claude Code
# Désactive les MCP servers non-essentiels pour réduire la RAM
# ================================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Optimisation Configuration MCP - Claude Code" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$configPath = "$env:USERPROFILE\.claude\config.json"
$backupPath = "$env:USERPROFILE\.claude\config.json.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Vérifier si le fichier existe
if (-not (Test-Path $configPath)) {
    Write-Host "[ERREUR] Fichier config.json non trouvé : $configPath" -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

Write-Host "[INFO] Configuration actuelle : $configPath" -ForegroundColor Yellow
Write-Host ""

# Lire le config actuel
$config = Get-Content $configPath -Raw | ConvertFrom-Json

# Compter les MCP servers
$mcpCount = ($config.mcpServers | Get-Member -MemberType NoteProperty).Count
Write-Host "[INFO] Nombre de MCP servers configurés : $mcpCount" -ForegroundColor Yellow

# Afficher les servers actuels
Write-Host ""
Write-Host "MCP Servers actuels :" -ForegroundColor White
$config.mcpServers | Get-Member -MemberType NoteProperty | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Stratégie d'Optimisation" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servers ESSENTIELS (seront conservés) :" -ForegroundColor Green
Write-Host "  ✅ context7           - Documentation" -ForegroundColor Green
Write-Host "  ✅ supabase-official  - Base de données" -ForegroundColor Green
Write-Host "  ✅ prisma             - ORM" -ForegroundColor Green
Write-Host ""
Write-Host "Servers OPTIONNELS (seront désactivés) :" -ForegroundColor Yellow
Write-Host "  ⏸️  shadcn-ui         - UI components (activer si dev UI)" -ForegroundColor Yellow
Write-Host "  ⏸️  playwright         - Tests E2E (activer si tests)" -ForegroundColor Yellow
Write-Host "  ⏸️  voicemode          - WSL voice (lourd)" -ForegroundColor Yellow
Write-Host "  ⏸️  nextjs-devtools    - Debug Next.js" -ForegroundColor Yellow
Write-Host "  ⏸️  n8n-local          - Workflows local" -ForegroundColor Yellow
Write-Host "  ⏸️  n8n-production     - Workflows production" -ForegroundColor Yellow
Write-Host ""
Write-Host "Gains attendus :" -ForegroundColor Cyan
Write-Host "  • Processus Node.js : $($mcpCount * 2) → 6-8" -ForegroundColor Cyan
Write-Host "  • RAM : ~2.2 GB → ~600 MB" -ForegroundColor Cyan
Write-Host "  • Temps démarrage : -50%" -ForegroundColor Cyan
Write-Host ""
Write-Host "Voulez-vous continuer ? (O/N)" -ForegroundColor White
$confirm = Read-Host

if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host ""
    Write-Host "Opération annulée." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 0
}

# Créer un backup
Write-Host ""
Write-Host "[1/3] Création du backup..." -ForegroundColor Cyan
Copy-Item $configPath $backupPath -Force
Write-Host "      Backup créé : $backupPath" -ForegroundColor Green

# Liste des servers essentiels à garder
$essentialServers = @("context7", "supabase-official", "prisma")

# Créer la nouvelle config
Write-Host ""
Write-Host "[2/3] Création de la configuration optimisée..." -ForegroundColor Cyan

$newConfig = @{
    mcpServers = @{}
}

# Copier uniquement les servers essentiels
foreach ($serverName in $essentialServers) {
    if ($config.mcpServers.PSObject.Properties.Name -contains $serverName) {
        $newConfig.mcpServers[$serverName] = $config.mcpServers.$serverName
        Write-Host "      ✅ Conservé : $serverName" -ForegroundColor Green
    }
}

# Optionnel : Créer un fichier séparé avec les servers désactivés
$disabledServers = @{}
$config.mcpServers | Get-Member -MemberType NoteProperty | ForEach-Object {
    $name = $_.Name
    if ($essentialServers -notcontains $name) {
        $disabledServers[$name] = $config.mcpServers.$name
        Write-Host "      ⏸️  Désactivé : $name" -ForegroundColor Yellow
    }
}

# Sauvegarder les servers désactivés dans un fichier séparé
$disabledConfigPath = "$env:USERPROFILE\.claude\config-disabled-servers.json"
@{ mcpServers = $disabledServers } | ConvertTo-Json -Depth 10 | Set-Content $disabledConfigPath -Encoding UTF8
Write-Host ""
Write-Host "      Servers désactivés sauvegardés dans :" -ForegroundColor Gray
Write-Host "      $disabledConfigPath" -ForegroundColor Gray

# Appliquer la nouvelle config
Write-Host ""
Write-Host "[3/3] Application de la configuration optimisée..." -ForegroundColor Cyan
$newConfig | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
Write-Host "      Configuration appliquée avec succès !" -ForegroundColor Green

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Optimisation terminée !" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Résumé :" -ForegroundColor White
Write-Host "  • MCP servers actifs : 3 (context7, supabase, prisma)" -ForegroundColor White
Write-Host "  • MCP servers désactivés : $($disabledServers.Count)" -ForegroundColor White
Write-Host "  • Backup créé : config.json.backup-*" -ForegroundColor White
Write-Host ""
Write-Host "Pour réactiver un server :" -ForegroundColor Yellow
Write-Host "  1. Ouvrir : $configPath" -ForegroundColor Yellow
Write-Host "  2. Copier la config du server depuis : $disabledConfigPath" -ForegroundColor Yellow
Write-Host "  3. Redémarrer VSCode" -ForegroundColor Yellow
Write-Host ""
Write-Host "Redémarrez VSCode pour appliquer les changements." -ForegroundColor Cyan
Write-Host ""
pause
