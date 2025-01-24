import { expect, test } from "vitest"
import { download, extractTo, getAssetNames } from "../src/tool"
import * as path from "path"
import * as fs from "fs"
import { homedir, tmpdir } from "os"
test("getAssetNames", () => {
  expect(getAssetNames("deno", "win32", "x64")).toEqual([
    "deno-x86_64-pc-windows-msvc",
    "deno-x86_64-pc-windows-gnu",
  ])
  expect(getAssetNames("deno", "linux", "x64")).toEqual([
    "deno-x86_64-unknown-linux-gnu",
  ])
  expect(getAssetNames("deno", "darwin", "x64")).toEqual([
    "deno-x86_64-apple-darwin",
  ])
  expect(getAssetNames("deno", "darwin", "arm64")).toEqual([
    "deno-aarch64-apple-darwin",
  ])
})

test("extractTo zip", async () => {
  const url =
    "https://github.com/ahaoboy/ansi2/releases/download/v0.2.11/ansi2-x86_64-pc-windows-msvc.zip"
  const filePath = path.join(tmpdir(), "ansi2-x86_64-pc-windows-msvc.zip")
  const testDir = "easy-setup-test"
  const installDir = path.join(homedir(), testDir)
  await download(url, filePath)
  extractTo(filePath, installDir)
  const ansi2Path = path.join(homedir(), testDir, "ansi2.exe")
  expect(fs.existsSync(ansi2Path)).toEqual(true)
}, 100_000)

test("extractTo tar.gz", async () => {
  // only test on linux
  if (process.platform === "win32") return
  const url =
    "https://github.com/ahaoboy/ansi2/releases/download/v0.2.11/ansi2-aarch64-apple-darwin.tar.gz"
  const filePath = path.join(tmpdir(), "ansi2-aarch64-apple-darwin.tar.gz")
  const testDir = "easy-setup-test"
  const installDir = path.join(homedir(), testDir)
  await download(url, filePath)
  extractTo(filePath, installDir)
  const ansi2Path = path.join(homedir(), testDir, "ansi2")
  expect(fs.existsSync(ansi2Path)).toEqual(true)
}, 100_000)
