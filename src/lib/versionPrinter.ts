export default function versionPrinter(): void {
  console.log(
    `v${
      typeof process.env.version === 'string' ? process.env.version : 'unknown'
    }`
  )
  process.exit(1)
}
