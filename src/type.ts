export type Input = {
  url: string
  version?: string
  bin: string
  installDir?: string
}

export type Output = {
  version: string
  installDir: string
  downloadUrl: string
}

export type Asset = {
  name: string
  browser_download_url: string
}

export type Release = {
  assets: Asset[]
}
