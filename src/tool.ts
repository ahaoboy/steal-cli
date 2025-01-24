import * as fs from "fs"
import { execSync } from "child_process"
import { tmpdir } from "os"
import * as path from "path"

export function getFetchOption() {
  const headers: HeadersInit = {
    "User-Agent": "GitHub Actions",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }
  return {
    headers,
  }
}

export async function download(url: string, outputPath?: string) {
  if (!outputPath) {
    const name = url.split("/").at(-1)!
    outputPath = path.join(tmpdir(), name)
  }
  const response = await fetch(url, getFetchOption())
  const buf = await response.arrayBuffer()
  fs.writeFileSync(outputPath, Buffer.from(buf))
  return outputPath
}

export function extractTo(compressedFilePath: string, outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  const rules = [
    {
      ext: [".zip"],
      cmd: `unzip -o "${compressedFilePath}" -d "${outputDir}"`,
    },
    { ext: [".tar"], cmd: `tar -xf "${compressedFilePath}" -C "${outputDir}"` },
    {
      ext: [".tar.gz", ".tgz"],
      cmd: `tar -xzf "${compressedFilePath}" -C "${outputDir}"`,
    },
    {
      ext: [".tar.bz2"],
      cmd: `tar -xjf "${compressedFilePath}" -C "${outputDir}"`,
    },
    { ext: [".7z"], cmd: `7z x "${compressedFilePath}" -o"${outputDir}"` },
    { ext: [".rar"], cmd: `unrar x "${compressedFilePath}" "${outputDir}"` },
    { ext: [".rar"], cmd: `unrar x "${compressedFilePath}" "${outputDir}"` },
  ] as const

  for (const { ext, cmd } of rules) {
    for (const e of ext) {
      if (compressedFilePath.endsWith(e)) {
        return execSync(cmd)
      }
    }
  }

  console.error(`Error: Unsupported file type: ${compressedFilePath}`)
}

export function getAssetNames(
  name: string,
  os = process.platform,
  arch = process.arch,
): string[] {
  let _arch: string
  switch (arch) {
    case "arm64":
      _arch = "aarch64"
      break
    case "x64":
      _arch = "x86_64"
      break
    default:
      throw new Error(`Unsupported architechture ${process.arch}.`)
  }

  let platform: string[]
  switch (os) {
    case "linux":
      platform = ["unknown-linux-gnu"]
      break
    case "darwin":
      platform = ["apple-darwin"]
      break
    case "win32":
      platform = ["pc-windows-msvc", "pc-windows-gnu"]
      break
    default:
      throw new Error(`Unsupported platform ${os}.`)
  }

  return platform.map((i) => `${name}-${_arch}-${i}`)
}

export function getBinName(bin: string) {
  return process.platform === "win32" ? `${bin}.exe` : bin
}


export function parseDownloadUrl(url: string) {
  const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)/;
  const match = url.match(regex);

  if (match) {
    const [, owner, repo, tag, name] = match;
    return {
      owner,
      repo,
      tag,
      name
    };
  }
}
