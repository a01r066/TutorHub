$Location = Get-Location
$filenames = (Get-ChildItem -Filter *.mp4).basename
$filenames | ForEach-Object { New-Item -Name $_ -Path $Location -ItemType Directory }
$filenames | ForEach-Object { ffmpeg -i "$($_).mp4" -profile:v baseline -level 3.0 -start_number 0 -hls_time 120 -hls_list_size 0 -f hls "$($_)\index.m3u8"}