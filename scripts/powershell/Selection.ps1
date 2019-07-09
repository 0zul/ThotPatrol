$caption = "[ThotPatrol]: Hello, $env:UserName!
 "
$description = "[ThotPatrol]: Select the option you would like to perform.
 "

$choices = New-Object Collections.ObjectModel.Collection[Management.Automation.Host.ChoiceDescription]
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Start ThotPatrol",
      "Start ThotPatrol and keep it running until you close the terminal."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Update ThotPatrol",
      "Update ThotPatrol to the latest available version."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Reset Data",
      "Removes all the data stored by ThotPatrol.
    Useful when you want to start from scratch or if you have somehow corrupted the database."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Exit",
      "Exit this script.
      "
))

$selection = $host.ui.PromptForChoice($caption, $description, $choices, -1)
Write-Host

switch($selection) {
  0 {
    .\scripts\powershell\Start.ps1
  }
  1 {
    .\scripts\powershell\Update.ps1
  }
  2 {
    .\scripts\powershell\Reset.ps1
  }
  3 {
    Exit
  }
}
