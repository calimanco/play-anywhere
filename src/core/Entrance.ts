export class Entrance {
  name: string = ''
  path: string = ''
  entryFile: string = ''
  templateFile: string = ''

  constructor(obj: {
    name: string
    path: string
    entryFile: string
    templateFile: string
  }) {
    this.name = obj.name
    this.path = obj.path
    this.entryFile = obj.entryFile
    this.templateFile = obj.templateFile
  }
}
