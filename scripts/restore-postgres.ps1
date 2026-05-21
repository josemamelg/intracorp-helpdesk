param(
  [Parameter(Mandatory = $true)]
  [string]$BackupFile,
  [string]$DbUser = "intracorp",
  [string]$DbName = "intracorp_helpdesk"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
  throw "No existe el backup: $BackupFile"
}

Get-Content $BackupFile | docker compose exec -T postgres psql -U $DbUser $DbName

Write-Host "Restore aplicado desde: $BackupFile"
