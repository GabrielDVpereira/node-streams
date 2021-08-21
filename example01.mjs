import http from 'http';
import { createReadStream } from 'fs'

http.createServer((req, res) => {
    // big.file is to large to be read by the readFile function. So we use createReadStream that reads chunks of data the we pipe those chunks to the res, that is a writeable stream by default 

    createReadStream('big.file').pipe(res)

}).listen(3000, () => console.log('running at 3000'))