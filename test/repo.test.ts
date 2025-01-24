import { expect, test } from "vitest"
import { Repo } from "../src/repo"

test("new repo", () => {
  const repo = new Repo("https://github.com/denoland/deno")
  expect(repo.name).toBe("deno")
  expect(repo.owner).toBe("denoland")
  expect(repo.getReleasesApiUrl()).toBe(
    "https://api.github.com/repos/denoland/deno/releases/latest",
  )
  expect(repo.getReleasesApiUrl("v2.1.6")).toBe(
    "https://api.github.com/repos/denoland/deno/releases/tags/v2.1.6",
  )
})

test("new repo", async () => {
  const repo = new Repo("https://github.com/denoland/deno")
  expect(await repo.getAssetUrl("deno", "v2.1.6", "win32", "x64")).toEqual(
    "https://github.com/denoland/deno/releases/download/v2.1.6/deno-x86_64-pc-windows-msvc.zip",
  )
  expect(await repo.getAssetUrl("deno", "v2.1.6", "darwin", "x64")).toEqual(
    "https://github.com/denoland/deno/releases/download/v2.1.6/deno-x86_64-apple-darwin.zip",
  )
})
