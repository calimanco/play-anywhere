export default function versionPrinter(): void {
  console.log(
    `v${
      typeof process.env.version !== 'undefined'
        ? process.env.version
        : 'unknown'
    }`
  )
  process.exit(1)
}
