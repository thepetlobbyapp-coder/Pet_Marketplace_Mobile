# Sincroniza docs/ e .codex/ canonicos (raiz) para cada app (Windows).
# A raiz e a fonte da verdade. Copias nos apps sao geradas - nao editar la.
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

$apps = @("Pet_Marketplace_Back", "Pet_Marketplace_Mobile", "Pet_Marketplace_Admin")

foreach ($app in $apps) {
  Write-Host "-> sync para $app"
  foreach ($shared in @("docs", ".codex")) {
    $dest = Join-Path $app $shared
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    Copy-Item -Recurse -Force $shared $dest
  }
}

Write-Host "Sync concluido: docs/ e .codex/ propagados para $($apps.Count) apps."
