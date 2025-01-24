import { run } from "./setup"

const { argv } = process
const url = argv[2]
const version = argv[3]
const bin = argv[4]

if (!url) {
  console.log("steal <url> <bin> <version>")
  process.exit()
}

const args = argv.slice(argv.includes("--") ? argv.indexOf("--") + 1 : 2)
run({ url, version, bin }, args)
