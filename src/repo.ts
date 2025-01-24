import { getAssetNames, getFetchOption } from "./tool"
import { Release } from "./type"

export class Repo {
  name: string
  owner: string
  constructor(url: string) {
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/
    const match = url.match(regex)
    if (!match) {
      throw new Error("Invalid github repo url")
    }
    this.owner = match[1]
    this.name = match[2]
  }
  getReleasesApiUrl(tag = "latest") {
    if (tag === "latest") {
      return `https://api.github.com/repos/${this.owner}/${this.name}/releases/latest`
    }
    return `https://api.github.com/repos/${this.owner}/${this.name}/releases/tags/${tag}`
  }

  async getRelease(tag = "latest"): Promise<Release> {
    const url = this.getReleasesApiUrl(tag)
    const json = await fetch(url, getFetchOption()).then((res) => res.json())
    return json as Release
  }

  async getAssetUrl(
    bin = this.name,
    tag = "latest",
    os = process.platform,
    arch = process.arch,
  ) {
    const releases = await this.getRelease(tag)
    const names = getAssetNames(bin, os, arch)
    const asset = releases.assets.find((asset) => {
      return names.some((i) => asset.name.startsWith(i))
    })
    if (!asset) {
      throw new Error(`No asset found for ${bin} ${tag} ${os} ${arch}`)
    }
    return asset.browser_download_url
  }
}
