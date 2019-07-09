Write-Host "[ThotPatrol]: Checking ThotPatrol system..."
If (Test-Path ".\index.js") {
  Write-Host "[ThotPatrol]: System check successful."
  Write-Host

  Write-Host "[ThotPatrol]: Booting up..."
  Write-Host

  node -r ./utils/globals.js .
}
Else {
  Write-Host "[ThotPatrol]: System check failed."
  Write-Host

  Write-Host "[ThotPatrol]: Check if you have installed ThotPatrol correctly."
  Write-Host "[ThotPatrol]: Follow the installation guide: https://docs.ThotPatrolbot.org"
}
Write-Host
