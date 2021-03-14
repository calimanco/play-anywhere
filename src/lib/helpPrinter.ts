export default function helpPrinter(): void {
  console.log(
    [
      'usage: play-anywhere [path] [options]',
      '       pa [path] [options]',
      '',
      'options:',
      '  -p --port            Port to use [3000]',
      '  -h --help            Print this list and exit.',
      '  -v --version         Print the version and exit.',
      '  -s --silent          Suppress log messages from output.',
      '  --static-dir [path]  Set static resources dir.',
      '                       Can use as a simple http server.',
      '  -c --config [path]   Load a config file.',
      '                       It will merge with the default config.'
    ].join('\n')
  )
  process.exit(1)
}
