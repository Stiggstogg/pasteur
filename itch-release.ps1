# itch.io PowerShell Release Script
# --------------------------------

# Powershell script to zip the content in the "dist" folder and upload it to itch.io

# Prerequisites: See README.md file

# Function to read a specific value from a file (in this case from the 'itch-release.env' file
function Get-EnvValue {
    param (
        [string]$FilePath,
        [string]$Key
    )

    if (-not (Test-Path -Path $FilePath)) {
        Write-Host "`nMissing config file: $FilePath`n" -ForegroundColor Red
        exit 1
    }

    $line = Get-Content $FilePath | Where-Object {
        $_ -match "^\s*$Key\s*="
    } | Select-Object -First 1

    if ([string]::IsNullOrWhiteSpace($line)) {
        Write-Host "`nMissing '$Key' in $FilePath`n" -ForegroundColor Red
        exit 1
    }

    return ($line -split "=", 2)[1].Trim()
}

# Function to test if a specific command is available. In this case it is used to test for '7z' and 'butler'
function Test-RequiredCommand {
    param (
        [string]$CommandName
    )

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        Write-Host "`nRequired command not found: $CommandName`nPlease make sure it is installed and available in PATH.`n" -ForegroundColor Red
        exit 1
    }
}

Test-RequiredCommand -CommandName "7z"
Test-RequiredCommand -CommandName "butler"

# Get the path and version
$name = (Get-Content package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "name"    # get name of the project from package.json
$version = (Get-Content package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "version" # get version of the project from package.json
$itchUser = Get-EnvValue -FilePath "./itch-release.env" -Key "ITCHIO_USER"  # get the itch user from the itch-release.env file

# Variables of the names and paths
$archiveName = "$name-$version.zip"         # name of the zip file
$zipPath = "./builds/$archiveName"          # path to the zip file
$source = "./dist/*"                        # files which should be zipped (everything in dist folder)
$itchPath = "$itchUser/$name" + ":html5"    # path of the itch.io project to which the file should be uploaded

# Overview
Write-Host "`nZIP 'n' Upload to itch.io" -ForegroundColor Yellow
Write-Host "==========================`n" -ForegroundColor Yellow
Write-Host "Name:     $name"
Write-Host "Version:  " -NoNewLine
Write-Host "$version" -ForegroundColor Yellow -BackgroundColor Blue
Write-Host "Zip:      $archiveName`n"

# Ask if the parameters are ok
Write-Host "Everything ok? [y/N] " -ForegroundColor Yellow -NoNewline
if ($(Read-Host) -eq "y")
{
    $execute = $true
}
else
{
    $execute = $false
}

# Check if file does already exist
if ($execute -And $(Test-Path -Path $zipPath))
{
    Write-Host "`n$archiveName does already exist.`nDo you want to continue and overwrite it? [y/N] " -ForegroundColor Red -NoNewline
    if ($(Read-Host) -eq "y")
    {
        Remove-Item $zipPath                                   # delete existing zip (otherwise just the new files will be added by 7zip
        Write-Host "`n$zipPath deleted." -ForegroundColor Red
    }
    else {
        $execute = $false
    }
}

# Execution of the zip and upload
if ($execute)
{
    Write-Host "`nExecuting ZIP:" -ForegroundColor Green

    7z a $zipPath $source                                     # create archive with 7zip

    Write-Host "`nUpload to itch.io:" -ForegroundColor Green

    butler push $zipPath $itchPath --userversion $version

    Write-Host "`nEverything Done!`n" -ForegroundColor Green
}
else
{
    Write-Host "`nCanceled! Nothing done.`n"  -ForegroundColor Red
}
