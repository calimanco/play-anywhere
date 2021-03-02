export function matchFile(
  filePath: string,
  regs: Array<RegExp | string>
): boolean {
  return regs.some(reg => {
    return filePath.search(reg) !== -1
  })
}
