Function Pass-Step {
  Write-Host
  Write-Host "[ThotPatrol]: Done."
  Write-Host
}

Function Exit-ThotPatrol-Updater {
  Write-Host
  Write-Host "[ThotPatrol]: Get Help/Support in ThotPatrol HQ: https://discord.gg/fzx8fkt"
  Write-Host

  Exit-PSSession
}


# Check if ThotPatrol is installed correctly
Write-Host "[ThotPatrol]: Checking ThotPatrol system..."
If (-Not (Test-Path ".git")) {
  Write-Host "[ThotPatrol]: System check failed."
  Write-Host

  Write-Host "[ThotPatrol]: Check if you have installed ThotPatrol correctly."
  Write-Host "[ThotPatrol]: Follow the installation guide: https://docs.ThotPatrolbot.org"

  Exit-ThotPatrol-Updater
}
Write-Host "[ThotPatrol]: System check successful."
Write-Host


# Pull new changes to ThotPatrol from GitHub
Write-Host "[ThotPatrol]: Updating ThotPatrol..."
Write-Host

git pull
If (-Not ($?)) {
  Write-Host "[ThotPatrol]: Unable to update ThotPatrol, error while updating ThotPatrol."
  Write-Host "[ThotPatrol]: Contact ThotPatrol Support for help."
  Write-Host

  Exit-ThotPatrol-Updater
}

Pass-Step


# Update global FFmpeg binaries
Write-Host "[ThotPatrol]: Updating FFmpeg..."
Write-Host

choco upgrade ffmpeg -y
If (-Not ($?)) {
  Write-Host "[ThotPatrol]: Unable to update ThotPatrol, error while updating FFmpeg."
  Write-Host "[ThotPatrol]: Try updating it manually: choco upgrade ffmpeg -y"
  Write-Host "[ThotPatrol]: Contact ThotPatrol Support for further help."

  Exit-ThotPatrol-Updater
}

Pass-Step


# Update ThotPatrol dependencies
Write-Host "[ThotPatrol]: Updating dependencies..."
Write-Host

Remove-Item -Path ".\node_modules", ".\package-lock.json" -Force -Recurse -ErrorAction SilentlyContinue
yarn install --production --no-lockfile
If (-Not ($?)) {
  Write-Host "[ThotPatrol]: Unable to update ThotPatrol, error while updating dependencies."
  Write-Host "[ThotPatrol]: Try updating it manually: yarn install --production --no-lockfile"
  Write-Host "[ThotPatrol]: Contact ThotPatrol Support for further help."

  Exit-ThotPatrol-Updater
}

Pass-Step


# Update was successful
Write-Host "[ThotPatrol]: ThotPatrol was successfully updated."
Write-Host

Write-Host "[ThotPatrol]: Ready to boot up and start running!"

Exit-ThotPatrol-Updater
