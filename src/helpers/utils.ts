export function matchFile(filePath: string, regs: RegExp[]): boolean {
  return regs.some(reg => {
    return filePath.search(reg) !== -1
  })
}
