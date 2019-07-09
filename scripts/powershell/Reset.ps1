$caption = "[ThotPatrol]: Are you sure you want to reset ThotPatrol?"
$description = "[ThotPatrol]: Resetting ThotPatrol will remove ALL the saved data.
 "

$choices = New-Object Collections.ObjectModel.Collection[Management.Automation.Host.ChoiceDescription]
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Yes",
      "Yes, I'm sure I want to reset all the saved data of ThotPatrol."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&No",
      "No, I don't want to delete the saved data.
      "
))

$decision = $Host.UI.PromptForChoice($caption, $description, $choices, 1)
Write-Host

If ($decision -eq 0) {
  Write-Host "[ThotPatrol]: Resetting ThotPatrol..."
  Remove-Item -Path ".\data\ThotPatrol.db" -Force -Recurse -ErrorAction SilentlyContinue
  Write-Host "[ThotPatrol]: Done."
  Write-Host

  Write-Host "[ThotPatrol]: All the saved data was removed from ThotPatrol."
}
Else {
  Write-Host "[ThotPatrol]: The operation was cancelled."
  Write-Host "[ThotPatrol]: None of your data was removed."
}


Write-Host
Write-Host "[ThotPatrol]: Get Help/Support in ThotPatrol HQ: https://discord.gg/fzx8fkt"
Write-Host
