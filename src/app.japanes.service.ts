import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanesService {
  constructor(
    @Inject('MY_APP')
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {}

  getHello(): string {
    return `Hello World! in japanes lang...!!!  from ${this.name},also it is ${this.message}`;
  }
}
