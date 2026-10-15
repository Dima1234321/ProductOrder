[CmdletBinding()]
param(
	[string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
	$OutputDirectory = 'artifacts\ProductOrder-runtime-linux-amd64'
}

if ([System.IO.Path]::IsPathRooted($OutputDirectory)) {
	$packageDirectory = [System.IO.Path]::GetFullPath($OutputDirectory)
}
else {
	$packageDirectory = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot $OutputDirectory))
}

function Invoke-Docker {
	param([string[]]$DockerArguments)

	& docker @DockerArguments
	if ($LASTEXITCODE -ne 0) {
		throw "Docker command failed with exit code ${LASTEXITCODE}: docker $($DockerArguments -join ' ')"
	}
}

Push-Location $repositoryRoot
try {
	Invoke-Docker @('build', '--platform', 'linux/amd64', '--tag', 'productorder-products-api:runtime', '--file', 'ProductOrder.Server/Dockerfile', '.')
	Invoke-Docker @('build', '--platform', 'linux/amd64', '--tag', 'productorder-orders-api:runtime', '--file', 'ProductOrder.OrdersServer/Dockerfile', 'ProductOrder.OrdersServer')
	Invoke-Docker @('build', '--platform', 'linux/amd64', '--tag', 'productorder-client:runtime', '--file', 'productorder.client/Dockerfile.runtime', 'productorder.client')

	New-Item -ItemType Directory -Path $packageDirectory -Force | Out-Null
	Copy-Item 'docker-compose.runtime.yml' (Join-Path $packageDirectory 'docker-compose.yml') -Force
	Copy-Item '.env.runtime.example' (Join-Path $packageDirectory '.env.example') -Force
	Copy-Item 'docs/RUNTIME-HANDOFF.md' (Join-Path $packageDirectory 'README.md') -Force

	$imageArchive = Join-Path $packageDirectory 'productorder-runtime-images-linux-amd64.tar'
	$images = @(
		'productorder-products-api:runtime',
		'productorder-orders-api:runtime',
		'productorder-client:runtime'
	)
	Invoke-Docker (@('image', 'save', '--output', $imageArchive) + $images)

	Write-Host "Source-free runtime package created at: $packageDirectory"
	Write-Host 'Package contents: docker-compose.yml, .env.example, README.md, and productorder-runtime-images-linux-amd64.tar'
}
finally {
	Pop-Location
}
