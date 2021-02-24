export default function helpPrinter(): void {
  console.log(
    [
      'usage: play-anywhere [path] [options]',
      '       pa [path] [options]',
      '',
      'options:',
      '  -p --port          Port to use [3000]',
      '  -h --help          Print this list and exit.',
      '  -v --version       Print the version and exit.'
    ].join('\n')
  )
  process.exit(1)
}
