import * as D from 'io-ts/src/Decoder2';
import * as DE from 'io-ts/src/DecodeError2';

export declare const parseFloat: D.Decoder<string, DE.NumberLE, number>

export declare const minLength: <L extends number>(l: L) => D.Decoder<string, DE.LeafE<{ _tag: 'MessageE'; message: `string.length > ${L}` }>, string>