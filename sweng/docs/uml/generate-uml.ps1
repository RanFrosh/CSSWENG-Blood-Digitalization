# ============================================================
# Backend UML Generator
# CSSWENG Blood Digitalization
# ============================================================

$ErrorActionPreference = "Continue"

# ------------------------------------------------------------
# Paths
# ------------------------------------------------------------

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$OutputFile = Join-Path $PSScriptRoot "backend.puml"

Write-Host "Project root: $ProjectRoot"
Write-Host "Output file:  $OutputFile"
Write-Host ""

# ------------------------------------------------------------
# Excluded directories/files
# ------------------------------------------------------------

$ExcludedPatterns = @(
    "\node_modules\",
    "\.next\",
    "\tests\",
    "\__tests__\",
    "\db\schemas\",
    "\components\",
    "\public\",
    "\pages\",
    "\client.tsx",
    "\docs\uml\"
)

function Test-ExcludedPath {
    param(
        [string]$Path
    )

    foreach ($Pattern in $ExcludedPatterns) {
        if ($Path -like "*$Pattern*") {
            return $true
        }
    }

    return $false
}

# ------------------------------------------------------------
# Make TypeScript text safe for PlantUML
# ------------------------------------------------------------

function Convert-ToPlantUmlSafe {
    param(
        [AllowNull()]
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    $Result = $Text.Trim()

    # Remove newlines
    $Result = $Result -replace "[\r\n]+", " "

    # Collapse whitespace
    $Result = $Result -replace "\s+", " "

    # Replace TypeScript generic brackets with safe brackets
    $Result = $Result -replace "<", "["
    $Result = $Result -replace ">", "]"

    # Remove object braces
    $Result = $Result -replace "\{", ""
    $Result = $Result -replace "\}", ""

    # Replace semicolons
    $Result = $Result -replace ";", ","

    # Replace pipe unions with slash
    $Result = $Result -replace "\|", "/"

    # Replace quotes
    $Result = $Result -replace [char]34, "'"
    $Result = $Result -replace [char]96, "'"

    return $Result.Trim()
}

# ------------------------------------------------------------
# Parameter cleanup
# ------------------------------------------------------------

function Get-ParameterSummary {
    param(
        [AllowNull()]
        [string]$Parameters
    )

    if ([string]::IsNullOrWhiteSpace($Parameters)) {
        return ""
    }

    $Result = Convert-ToPlantUmlSafe $Parameters

    # Remove common default values
    $Result = $Result -replace "\s*=\s*[^,]+", ""

    $Result = $Result -replace "\s+", " "

    return $Result.Trim()
}

# ------------------------------------------------------------
# Return type cleanup
# ------------------------------------------------------------

function Get-ReturnType {
    param(
        [AllowNull()]
        [string]$ReturnType
    )

    if ([string]::IsNullOrWhiteSpace($ReturnType)) {
        return "void"
    }

    $Result = Convert-ToPlantUmlSafe $ReturnType

    # Remove arrow-function implementation text
    $Result = $Result -replace "=>.*$", ""

    $Result = $Result.Trim()

    if ([string]::IsNullOrWhiteSpace($Result)) {
        return "void"
    }

    return $Result
}

# ------------------------------------------------------------
# Find matching class closing brace
#
# This ignores:
#   - single quoted strings
#   - double quoted strings
#   - template strings
#   - // comments
#   - /* comments */
# ------------------------------------------------------------

function Get-MatchingBracePosition {
    param(
        [string]$Text,
        [int]$OpeningBraceIndex
    )

    $Depth = 1

    $InSingleQuote = $false
    $InDoubleQuote = $false
    $InTemplate = $false
    $InLineComment = $false
    $InBlockComment = $false

    $Escaped = $false

    for (
        $i = $OpeningBraceIndex + 1;
        $i -lt $Text.Length;
        $i++
    ) {

        $Character = $Text[$i]

        if ($i + 1 -lt $Text.Length) {
            $NextCharacter = $Text[$i + 1]
        }
        else {
            $NextCharacter = [char]0
        }

        # ----------------------------------------------------
        # Line comment
        # ----------------------------------------------------

        if ($InLineComment) {

            if (
                $Character -eq [char]10 -or
                $Character -eq [char]13
            ) {
                $InLineComment = $false
            }

            continue
        }

        # ----------------------------------------------------
        # Block comment
        # ----------------------------------------------------

        if ($InBlockComment) {

            if (
                $Character -eq "*" -and
                $NextCharacter -eq "/"
            ) {
                $InBlockComment = $false
                $i++
            }

            continue
        }

        # ----------------------------------------------------
        # Single quote
        # ----------------------------------------------------

        if ($InSingleQuote) {

            if ($Escaped) {
                $Escaped = $false
            }
            elseif ($Character -eq [char]92) {
                $Escaped = $true
            }
            elseif ($Character -eq [char]39) {
                $InSingleQuote = $false
            }

            continue
        }

        # ----------------------------------------------------
        # Double quote
        # ----------------------------------------------------

        if ($InDoubleQuote) {

            if ($Escaped) {
                $Escaped = $false
            }
            elseif ($Character -eq [char]92) {
                $Escaped = $true
            }
            elseif ($Character -eq [char]34) {
                $InDoubleQuote = $false
            }

            continue
        }

        # ----------------------------------------------------
        # Template string
        # ----------------------------------------------------

        if ($InTemplate) {

            if ($Escaped) {
                $Escaped = $false
            }
            elseif ($Character -eq [char]92) {
                $Escaped = $true
            }
            elseif ($Character -eq [char]96) {
                $InTemplate = $false
            }

            continue
        }

        # ----------------------------------------------------
        # Detect comments
        # ----------------------------------------------------

        if (
            $Character -eq "/" -and
            $NextCharacter -eq "/"
        ) {
            $InLineComment = $true
            $i++
            continue
        }

        if (
            $Character -eq "/" -and
            $NextCharacter -eq "*"
        ) {
            $InBlockComment = $true
            $i++
            continue
        }

        # ----------------------------------------------------
        # Detect strings
        # ----------------------------------------------------

        if ($Character -eq [char]39) {
            $InSingleQuote = $true
            continue
        }

        if ($Character -eq [char]34) {
            $InDoubleQuote = $true
            continue
        }

        if ($Character -eq [char]96) {
            $InTemplate = $true
            continue
        }

        # ----------------------------------------------------
        # Count braces
        # ----------------------------------------------------

        if ($Character -eq "{") {
            $Depth++
        }
        elseif ($Character -eq "}") {

            $Depth--

            if ($Depth -eq 0) {
                return $i
            }
        }
    }

    return -1
}

# ------------------------------------------------------------
# Find TypeScript files
# ------------------------------------------------------------

$Files = Get-ChildItem `
    -Path $ProjectRoot `
    -Recurse `
    -File |
    Where-Object {

        (
            $_.Extension -eq ".ts" -or
            $_.Extension -eq ".tsx"
        ) -and
        -not (Test-ExcludedPath $_.FullName)
    }

Write-Host "Found $($Files.Count) TypeScript files."
Write-Host ""

# ------------------------------------------------------------
# Data structures
# ------------------------------------------------------------

$Classes = @{}
$Interfaces = @{}

# ------------------------------------------------------------
# Parse files
# ------------------------------------------------------------

foreach ($File in $Files) {

    try {

        $Content = Get-Content `
            -LiteralPath $File.FullName `
            -Raw `
            -ErrorAction Stop
    }
    catch {

        Write-Warning "Could not read $($File.FullName)"
        continue
    }

    if ([string]::IsNullOrWhiteSpace($Content)) {

        Write-Warning "Skipping empty file $($File.FullName)"
        continue
    }

    # ========================================================
    # Interfaces
    # ========================================================

    $InterfaceMatches = [regex]::Matches(
        $Content,
        '(?m)(?:export\s+)?(?:default\s+)?interface\s+([A-Za-z_$][A-Za-z0-9_$]*)'
    )

    foreach ($Match in $InterfaceMatches) {

        $InterfaceName = $Match.Groups[1].Value.Trim()

        if (
            -not [string]::IsNullOrWhiteSpace($InterfaceName) -and
            -not $Interfaces.ContainsKey($InterfaceName)
        ) {

            $Interfaces[$InterfaceName] = @{
                Name = $InterfaceName
                File = $File.FullName
            }
        }
    }

    # ========================================================
    # Classes
    # ========================================================

    $ClassMatches = [regex]::Matches(
        $Content,
        '(?m)(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][A-Za-z0-9_$]*)(?:\s+extends\s+([A-Za-z_$][A-Za-z0-9_$]*))?(?:\s+implements\s+([^{]+))?\s*\{'
    )

    foreach ($Match in $ClassMatches) {

        $ClassName = $Match.Groups[1].Value.Trim()
        $Extends = $Match.Groups[2].Value.Trim()
        $Implements = $Match.Groups[3].Value.Trim()

        # ----------------------------------------------------
        # Create class entry
        # ----------------------------------------------------

        if (-not $Classes.ContainsKey($ClassName)) {

            $Classes[$ClassName] = @{
                Name = $ClassName
                File = $File.FullName
                Extends = $Extends
                Implements = @()
                Fields = @()
                Methods = @()
            }
        }

        # ----------------------------------------------------
        # Interfaces implemented by class
        # ----------------------------------------------------

        if (-not [string]::IsNullOrWhiteSpace($Implements)) {

            $ImplementedInterfaces = @(
                $Implements `
                    -split "," |
                    ForEach-Object {
                        $_.Trim()
                    } |
                    Where-Object {
                        $_ -match '^[A-Za-z_$][A-Za-z0-9_$]*$'
                    }
            )

            $Classes[$ClassName].Implements = $ImplementedInterfaces
        }

        # ----------------------------------------------------
        # Locate class body
        # ----------------------------------------------------

        $OpeningBrace = $Match.Index + $Match.Length - 1

        $ClosingBrace = Get-MatchingBracePosition `
            $Content `
            $OpeningBrace

        if ($ClosingBrace -lt 0) {

            Write-Warning `
                "Could not determine class body for $ClassName in $($File.FullName)"

            continue
        }

        $BodyLength = $ClosingBrace - $OpeningBrace - 1

        if ($BodyLength -le 0) {
            continue
        }

        $ClassBody = $Content.Substring(
            $OpeningBrace + 1,
            $BodyLength
        )

        # ====================================================
        # Fields
        # ====================================================

        $FieldMatches = [regex]::Matches(
            $ClassBody,
            '(?m)^[ \t]*(?:(?:public|private|protected|readonly|static|declare)\s+)*([A-Za-z_$][A-Za-z0-9_$]*)\??\s*:\s*([^;=\r\n]+)'
        )

        foreach ($Field in $FieldMatches) {

            $FieldName = $Field.Groups[1].Value.Trim()

            $FieldType = Convert-ToPlantUmlSafe `
                $Field.Groups[2].Value

            if (
                [string]::IsNullOrWhiteSpace($FieldName) -or
                [string]::IsNullOrWhiteSpace($FieldType)
            ) {
                continue
            }

            # Ignore control keywords
            if (
                $FieldName -match `
                '^(if|else|for|while|switch|case|return|throw|constructor|catch)$'
            ) {
                continue
            }

            # Avoid function-like declarations
            if ($FieldType -match '^\(') {
                continue
            }

            $ExistingField = $Classes[$ClassName].Fields |
                Where-Object {
                    $_.Name -eq $FieldName
                }

            if (-not $ExistingField) {

                $Classes[$ClassName].Fields += @{
                    Name = $FieldName
                    Type = $FieldType
                }
            }
        }

        # ====================================================
        # Methods
        # ====================================================

        $MethodMatches = [regex]::Matches(
            $ClassBody,
            '(?m)^[ \t]*(?:(?:public|private|protected|static|async|readonly|get|set)\s+)*(constructor|[A-Za-z_$][A-Za-z0-9_$]*)\s*\(([^)]*)\)\s*(?::\s*([^{=\r\n]+))?'
        )

        foreach ($Method in $MethodMatches) {

            $MethodName = $Method.Groups[1].Value.Trim()

            $Parameters = Get-ParameterSummary `
                $Method.Groups[2].Value

            $ReturnType = Get-ReturnType `
                $Method.Groups[3].Value

            if (
                $MethodName -match `
                '^(if|for|while|switch|catch)$'
            ) {
                continue
            }

            $ExistingMethod = $Classes[$ClassName].Methods |
                Where-Object {
                    $_.Name -eq $MethodName -and
                    $_.Parameters -eq $Parameters
                }

            if (-not $ExistingMethod) {

                $Classes[$ClassName].Methods += @{
                    Name = $MethodName
                    Parameters = $Parameters
                    ReturnType = $ReturnType
                }
            }
        }
    }
}

# ============================================================
# Generate PlantUML
# ============================================================

$Output = @()

$Output += "@startuml backend"
$Output += ""
$Output += "title CSSWENG Blood Digitalization - Backend Class Diagram"
$Output += "skinparam classAttributeIconSize 0"
$Output += "skinparam shadowing false"
$Output += "skinparam packageStyle rectangle"
$Output += ""

# ============================================================
# Interfaces
# ============================================================

if ($Interfaces.Count -gt 0) {

    $Output += "' =============================="
    $Output += "' Interfaces"
    $Output += "' =============================="
    $Output += ""

    foreach (
        $Interface in $Interfaces.Values |
        Sort-Object Name
    ) {

        $Output += "interface $($Interface.Name)"
    }

    $Output += ""
}

# ============================================================
# Classes
# ============================================================

$Output += "' =============================="
$Output += "' Classes"
$Output += "' =============================="
$Output += ""

foreach (
    $Class in $Classes.Values |
    Sort-Object Name
) {

    $Output += "class $($Class.Name) {"

    # --------------------------------------------------------
    # Fields
    # --------------------------------------------------------

    foreach (
        $Field in $Class.Fields |
        Sort-Object Name
    ) {

        $Output += `
            "    - $($Field.Name): $($Field.Type)"
    }

    # --------------------------------------------------------
    # Methods
    # --------------------------------------------------------

    foreach (
        $Method in $Class.Methods |
        Sort-Object Name
    ) {

        $Output += `
            "    + $($Method.Name)($($Method.Parameters)): $($Method.ReturnType)"
    }

    $Output += "}"
    $Output += ""
}

# ============================================================
# Relationships
# ============================================================

$Output += "' =============================="
$Output += "' Relationships"
$Output += "' =============================="
$Output += ""

$Relationships = `
    New-Object System.Collections.Generic.HashSet[string]

foreach (
    $Class in $Classes.Values |
    Sort-Object Name
) {

    # --------------------------------------------------------
    # Implements
    # --------------------------------------------------------

    foreach ($Interface in $Class.Implements) {

        if ($Interfaces.ContainsKey($Interface)) {

            [void]$Relationships.Add(
                "$($Class.Name) ..|> $Interface"
            )
        }
    }

    # --------------------------------------------------------
    # Extends
    # --------------------------------------------------------

    if (
        -not [string]::IsNullOrWhiteSpace($Class.Extends) -and
        $Classes.ContainsKey($Class.Extends)
    ) {

        [void]$Relationships.Add(
            "$($Class.Name) --|> $($Class.Extends)"
        )
    }
}

# ------------------------------------------------------------
# Write relationships
# ------------------------------------------------------------

foreach (
    $Relationship in $Relationships |
    Sort-Object
) {

    $Output += $Relationship
}

# ============================================================
# Finish PlantUML
# ============================================================

$Output += ""
$Output += "@enduml"

# ============================================================
# Write file
# ============================================================

$Output |
    Set-Content `
        -LiteralPath $OutputFile `
        -Encoding UTF8

# ============================================================
# Summary
# ============================================================

Write-Host ""
Write-Host "========================================"
Write-Host " UML generation complete"
Write-Host "========================================"
Write-Host ""
Write-Host "Classes found:    $($Classes.Count)"
Write-Host "Interfaces found: $($Interfaces.Count)"
Write-Host ""
Write-Host "Output:"
Write-Host $OutputFile
Write-Host ""