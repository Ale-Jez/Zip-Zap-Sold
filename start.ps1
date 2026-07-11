[CmdletBinding()]
param(
    [int]$Port = 4173
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url = "http://127.0.0.1:$Port"

Write-Host "Starting Zip Zap Sold at $url"
Start-Process $url

Set-Location $root
$env:PORT = $Port
node server.mjs
