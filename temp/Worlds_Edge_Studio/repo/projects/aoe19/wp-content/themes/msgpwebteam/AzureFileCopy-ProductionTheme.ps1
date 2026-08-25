$StorageAccountName = "agewebcdn"
$StorageAccountKey = "jy2O4KbfNDGyKi1II6lvDMxkTb5lWA09wVJe8j5IoXKgUrucvAhAF946yjiDHAJplihjCkYfKwarhLHCvZ1I6g=="
$StorageContainerName = "aoe"

# get Azure blob storage context
$context = New-AzStorageContext `
    -StorageAccountName $StorageAccountName `
    -StorageAccountKey $StorageAccountKey

# get folder paths
$rootFolder = Get-Location #Split-Path -Path $PSScriptRoot -Parent
$assetsFolder = Get-Location #"$($rootFolder)/msgpwebteam"

# get assets files
$files = Get-ChildItem $assetsFolder -Recurse -File | Where-Object { $_.PSParentPath -notmatch "node_modules|assets" }

Write-Output "Found $($files.Count) files."

foreach ($file in $files)
{
    Write-Output "Processing $($file.FullName)"

    # get MIME type for current file
    $ContentType = "application/octetstream"
  if (($file.Extension -ne ".php") -AND ($file.Extension -ne ".txt") -AND ($file.Extension -ne ".ps1")) {
    switch ($file.Extension)
    {
        ".js" { 
            $ContentType = "application/javascript" 
        }
        ".css" { 
            $ContentType = "text/css" 
        }
        ".map" { 
            $ContentType = "application/json" 
        }
        ".svg" { 
            $ContentType = "image/svg+xml" 
        }
        ".png" { 
            $ContentType = "image/png" 
        }
        ".jpg" { 
            $ContentType = "image/jpg" 
        }
        ".gif" {
            $ContentType = "image/gif"
        }
        ".woff2" { 
            $ContentType = "application/font-woff2" 
        }
        ".woff" { 
            $ContentType = "application/x-font-woff" 
        }
        ".ttf" { 
            $ContentType = "application/font-sfnt" 
        }
        ".eot" { 
            $ContentType = "application/vnd.ms-fontobject" 
        }
        ".json" { 
            $ContentType = "application/json" 
        }
        ".xml" { 
            $ContentType = "text/xml" 
        }
        ".ico" { 
            $ContentType = "image/x-icon" 
        }
    }

    # set Properties
    $Properties = @{"ContentType" = $ContentType; "CacheControl" = "public, max-age=31536000"}

    # upload blob
    Set-AzStorageBlobContent `
        -File $file.FullName `
        -Blob $file.FullName.Replace("$($assetsFolder)/", "wp-content\themes\msgpwebteam\") `
        -Context $context `
        -Container $StorageContainerName `
        -Properties $Properties `
        -Force
  }
}
