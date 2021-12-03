import ByteArray from './ByteArray';

interface IDataInput {
    get bytesAvailable(): number;

    get endian(): string;

    set endian(value: string);

    get objectEncoding(): number;

    set objectEncoding(value: number);

    readBoolean(): boolean;

    readByte(): number;

    readBytes(bytes: ByteArray, offset: number, length: number): void;

    readDouble(): number;

    readFloat(): number;

    readInt(): number;

    readMultiByte(length: number, charSet: string): string;

    readObject(): any;

    readShort(): number;

    readUnsignedByte(): number;

    readUnsignedInt(): number;

    readUnsignedShort(): number;

    readUTF(): string;

    readUTFBytes(length: number): string;
}

export default IDataInput;
