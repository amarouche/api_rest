import * as Promise from 'bluebird';
import connect from '../../common/db_connect';
import L from '../../common/logger';

let id = 0;
interface Example {
  id: number,
  name: string
};

const examples: Example[] = [
    { id: id++, name: 'example 0' }, 
    { id: id++, name: 'example 1' }
];

export class ExamplesService {
  all(): Promise<Example[]> {
    let db = connect.query("select * from domain;", function (err, result) {
      if (err) throw err;
      L.info(result, 'Result all examples');
      // console.log("Result: " + result);
    });
    L.info(examples, 'fetch all examples');
    return Promise.resolve(examples);
  }

  byId(id: number): Promise<Example> {
    L.info(`fetch example with id ${id}`);
    return this.all().then(r => r[id])
  }

  create(name: string): Promise<Example> {
    L.info(`create example with name ${name}`);
    const example: Example = {
      id: id++,
      name
    };
    examples.push(example)
    return Promise.resolve(example);
  }
}

export default new ExamplesService();