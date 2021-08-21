import { pipeline, Readable, Writable, Transform } from 'stream'
import { promisify } from 'util'
import { createWriteStream } from 'fs'

const pipelineAsync = promisify(pipeline);  // transtform the pipeline to a async function 

{
    const readableStream = Readable({
        read: function () {
            this.push('test01')
            this.push('test02')
            this.push('test03')
            this.push(null)
        }
    });

    const writableStream = Writable({
        write: function (chunk, encoding, callback) {
            console.log(chunk.toString()); // chunk is a buffer by default
            callback()
        }
    })

    await pipelineAsync(readableStream, writableStream)
    console.log('processo 01 acabou');
}



{
    const readableStream = Readable({
        read: function () {
            for (let i = 0; i < 1e5; i++) {
                const person = { id: Date.now() + i, name: `Gabriel ${i}` };

                const data = JSON.stringify(person);
                this.push(data);
            }
            this.push(null);
        }
    });


    // transform is used if you want to pass the chunk ahead in the pipeline process
    const writableMapToCSV = Transform({
        transform: function (chunk, encoding, callback) {
            const data = JSON.parse(chunk);
            const result = `${data.id},${data.name.toUpperCase()}\n`;

            callback(null, result);
        }
    })

    const setHeader = Transform({
        transform: function (chunk, encoding, callback) {
            this.counter = this.counter ?? 0

            if (this.counter) {
                return callback(null, chunk);
            }

            this.counter += 1;

            callback(null, "id,name\n".concat(chunk))
        }
    })
    await pipelineAsync(readableStream, writableMapToCSV, setHeader, createWriteStream('my.csv'))

}