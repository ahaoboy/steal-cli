import { run } from "./setup"

const { argv } = process
const [url, bin, version] = argv.slice(2)

if (!url) {
  console.log("steal <url> <bin> <version>")
  process.exit()
}

const args = argv.slice(argv.includes("--") ? argv.indexOf("--") + 1 : 2)
run({ url, version, bin }, args)
