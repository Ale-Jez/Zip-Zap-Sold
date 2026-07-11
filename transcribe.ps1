[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$AudioPath,

    [string]$OutputPath,

    [string]$Model = 'gpt-4o-transcribe-diarize'
)

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$envPath = Join-Path $projectRoot '.env.local'

if (-not (Test-Path -LiteralPath $envPath -PathType Leaf)) {
    throw "Nie znaleziono pliku z kluczem API: $envPath"
}

$audioFile = Get-Item -LiteralPath $AudioPath -ErrorAction Stop
if ($audioFile.PSIsContainer) {
    throw "Podana sciezka wskazuje folder, a nie nagranie: $AudioPath"
}

$keyLine = Get-Content -LiteralPath $envPath |
    Where-Object { $_ -match '^OPENAI_API_KEY=' } |
    Select-Object -First 1

if (-not $keyLine) {
    throw 'W pliku .env.local nie znaleziono OPENAI_API_KEY.'
}

$apiKey = $keyLine.Substring('OPENAI_API_KEY='.Length).Trim()
if (-not $apiKey) {
    throw 'OPENAI_API_KEY w pliku .env.local jest pusty.'
}

if (-not $OutputPath) {
    $OutputPath = Join-Path $audioFile.DirectoryName ($audioFile.BaseName + '-transkrypcja.md')
}

$outputFullPath = [System.IO.Path]::GetFullPath($OutputPath)
$outputDirectory = Split-Path -Parent $outputFullPath
if (-not (Test-Path -LiteralPath $outputDirectory -PathType Container)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$jsonPath = [System.IO.Path]::ChangeExtension($outputFullPath, '.json')
$tempJsonPath = $jsonPath + '.tmp'

Write-Host "Wysylanie $($audioFile.FullName) do OpenAI API..."

try {
    & curl.exe `
        --fail-with-body `
        --silent `
        --show-error `
        'https://api.openai.com/v1/audio/transcriptions' `
        -H "Authorization: Bearer $apiKey" `
        -F "file=@$($audioFile.FullName)" `
        -F "model=$Model" `
        -F 'response_format=diarized_json' `
        -F 'chunking_strategy=auto' `
        --output $tempJsonPath

    if ($LASTEXITCODE -ne 0) {
        throw "OpenAI API lub curl zakonczyl dzialanie kodem $LASTEXITCODE."
    }

    $response = Get-Content -Raw -LiteralPath $tempJsonPath | ConvertFrom-Json

    if (-not $response.segments) {
        throw 'Odpowiedz API nie zawiera segmentow transkrypcji.'
    }

    Move-Item -LiteralPath $tempJsonPath -Destination $jsonPath -Force

    $markdown = [System.Collections.Generic.List[string]]::new()
    $markdown.Add("# Transkrypcja nagrania ``$($audioFile.Name)``")
    $markdown.Add('')
    $markdown.Add("> Model: ``$Model``")
    $markdown.Add('> Mowcy i znaczniki czasu pochodza z automatycznej diarizacji.')
    $markdown.Add('')
    $markdown.Add('## Transkrypcja')
    $markdown.Add('')

    foreach ($segment in $response.segments) {
        $text = ([string]$segment.text).Trim()
        if (-not $text) {
            continue
        }

        $time = [TimeSpan]::FromSeconds([double]$segment.start)
        $timestamp = '{0:00}:{1:00}:{2:00}' -f `
            [math]::Floor($time.TotalHours), `
            $time.Minutes, `
            $time.Seconds

        $speaker = if ($segment.speaker) { [string]$segment.speaker } else { '?' }
        $markdown.Add("**[$timestamp] Mowca $speaker`:** $text")
        $markdown.Add('')
    }

    $markdown | Set-Content -LiteralPath $outputFullPath -Encoding utf8

    Write-Host "Gotowe."
    Write-Host "Markdown: $outputFullPath"
    Write-Host "Surowy JSON: $jsonPath"
}
finally {
    $apiKey = $null
    Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue

    if (Test-Path -LiteralPath $tempJsonPath) {
        Remove-Item -LiteralPath $tempJsonPath -Force
    }
}
