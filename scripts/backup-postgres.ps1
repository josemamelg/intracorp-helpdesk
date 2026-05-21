param(
  [string]$BackupDir = ".\backups",
  [string]$DbUser = "intracorp",
  [string]$DbName = "intracorp_helpdesk"
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$file = Join-Path $BackupDir "intracorp-helpdesk-$timestamp.sql"

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
docker compose exec -T postgres pg_dump -U $DbUser $DbName | Out-File -Encoding utf8 $file

Write-Host "Backup creado: $file"
