import path, { join } from "path"
import { Repo } from "./repo"
import { download, extractTo, getBinName } from "./tool"
import type { Input, Output } from "./type"
import { homedir } from "os"
import { existsSync } from "fs"
import { execFileSync } from "child_process"

const installDir = path.join(homedir(), "steal-cli")

export async function setup(input: Input): Promise<Output> {
  const { url: repo, version = "latest", bin } = input
  const url = await new Repo(repo).getAssetUrl(
    bin?.length ? bin : undefined,
    version,
  )
  const downloadPath = await download(url)
  await extractTo(downloadPath, installDir)
  return {
    version,
    installDir: installDir,
    downloadUrl: url,
  }
}

export async function run(input: Input, args = process.argv.slice(2)) {
  const binPath = join(installDir, getBinName(input.bin))
  if (!existsSync(binPath)) {
    await setup(input)
  }
  try {
    execFileSync(binPath, args, { stdio: "inherit" })
  } catch (e) {
    // FIXME: Ignore js errors
  }
}
