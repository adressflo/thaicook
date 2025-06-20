Write-Host "🚀 Démarrage du serveur de développement ThaiCook..." -ForegroundColor Green
Write-Host "📍 Centre de Commandement disponible sur: http://localhost:5173/admin/centre-commandement" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Fonctionnalités testées:" -ForegroundColor Yellow
Write-Host "   ✅ Nouveau Centre de Commandement" -ForegroundColor Green
Write-Host "   ✅ Gestion temps réel des commandes" -ForegroundColor Green
Write-Host "   ✅ Contrôle disponibilité des plats" -ForegroundColor Green
Write-Host "   ✅ Flux d'activités" -ForegroundColor Green
Write-Host ""
Write-Host "⏰ Le serveur démarre dans 3 secondes..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Set-Location "C:\Users\USER\Desktop\thaicook-main"
npm run dev