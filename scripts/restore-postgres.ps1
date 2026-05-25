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

Write-Host "Limpiando schema public en $DbName..."
@"
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO "$DbUser";
GRANT ALL ON SCHEMA public TO public;
"@ | docker compose exec -T postgres psql -U $DbUser $DbName

Write-Host "Restaurando backup..."
Get-Content $BackupFile | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U $DbUser $DbName

Write-Host "Restore aplicado desde: $BackupFile"
