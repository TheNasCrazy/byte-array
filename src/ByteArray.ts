import { Buffer } from 'buffer';
import IDataInput from './IDataInput';
import IDataOutput from './IDataOutput';

class ByteArray implements IDataInput, IDataOutput {
    private _endian: 'BIG_ENDIAN' | 'LITTLE_ENDIAN';
    private _position: number;
    private _buffer: Buffer;

    private _extendsData(size: number): void {
        const extraBytes: number = this._position + size - this._buffer.length;
        if (extraBytes > 0) {
            const newSize = this._buffer.length + extraBytes;
            this._buffer = Buffer.concat([this._buffer], newSize);
        }
    }

    constructor() {
        this._endian = 'BIG_ENDIAN';
        this._position = 0;
        this._buffer = Buffer.alloc(0);
    }

    get bytesAvailable(): number {
        return this._buffer.length - this._position;
    }

    get endian(): 'BIG_ENDIAN' | 'LITTLE_ENDIAN' {
        return this._endian;
    }

    set endian(value: 'BIG_ENDIAN' | 'LITTLE_ENDIAN') {
        this._endian = value;
    }

    get objectEncoding(): number {
        throw new Error('Method not implemented.');
    }

    set objectEncoding(value: number) {
        throw new Error('Method not implemented.');
    }

    get length(): number {
        return this._buffer.length;
    }

    set length(value: number) {
        if (value >= this._buffer.length) {
            this._extendsData(value - this._buffer.length);
        } else {
            const newBuffer = Buffer.alloc(value);
            for (let i = 0; i < value; i++) {
                newBuffer[i] = this._buffer[i];
            }
            this._buffer = newBuffer;
        }
    }

    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    get(index: number): number {
        if (index >= this._buffer.length) {
            this.length = index + 1;
        }
        return this._buffer[index];
    }

    put(index: number, value: number): void {
        if (index >= this._buffer.length) {
            this.length = index + 1;
        }
        this._buffer[index] = value;
    }

    readBoolean(): boolean {
        const value = this.readByte();
        return value == 1;
    }

    readByte(): number {
        const value = this._buffer.readInt8(this._position);
        this._position += 1;
        return value;
    }

    readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        let i = 0;

        if (length > this._buffer.length) {
            throw new Error("L'index indiquer sort des limites");
        }

        if (length == 0) {
            length = this._buffer.length;
        }

        while (i < length) {
            bytes.put(i + offset, this._buffer[i + this._position]);
            i = i + 1;
        }

        this._position = this._position + i;
    }

    readDouble(): number {
        let value: number;
        if (this._endian == 'BIG_ENDIAN') {
            value = this._buffer.readDoubleBE(this._position);
        } else {
            value = this._buffer.readDoubleLE(this._position);
        }
        this._position += 8;
        return value;
    }

    readFloat(): number {
        let value: number;
        if (this._endian == 'BIG_ENDIAN') {
            value = this._buffer.readFloatBE(this._position);
        } else {
            value = this._buffer.readFloatLE(this._position);
        }
        this._position += 4;
        return value;
    }

    readInt(): number {
        let value: number;
        if (this._endian == 'BIG_ENDIAN') {
            value = this._buffer.readInt32BE(this._position);
        } else {
            value = this._buffer.readInt32LE(this._position);
        }
        this._position += 4;
        return value;
    }

    readMultiByte(length: number, charSet: string): string {
        throw new Error('Method not implemented.');
    }

    readObject() {
        throw new Error('Method not implemented.');
    }

    readShort(): number {
        let value: number;
        if (this._endian == 'BIG_ENDIAN') {
            value = this._buffer.readInt16BE(this._position);
        } else {
            value = this._buffer.readInt16LE(this._position);
        }
        this._position += 2;
        return value;
    }

    readUnsignedByte(): number {
        const value = this._buffer.readUInt8(this._position);
        this._position += 1;
        return value;
    }

    readUnsignedInt(): number {
        let value: number;
        if (this._endian == 'BIG_ENDIAN') {
            value = this._buffer.readUInt32BE(this._position);
        } else {
            value = this._buffer.readUInt32LE(this._position);
        }
        this._position += 4;
        return value;
    }

    readUnsignedShort(): number {
        let value: number;
        if (this._endian == 'BIG_ENDIAN') {
            value = this._buffer.readUInt16BE(this._position);
        } else {
            value = this._buffer.readUInt16LE(this._position);
        }
        this._position += 2;
        return value;
    }

    readUTF(): string {
        let value: string;
        const length = this.readUnsignedShort();

        value = this.readUTFBytes(length);
        return value;
    }

    readUTFBytes(length: number): string {
        let i: number = 0;
        let value: string = '';

        for (i = 0; i < length; i++) {
            value += String.fromCharCode(this.readByte());
        }

        return value;
    }

    writeBoolean(value: boolean): void {
        this.writeByte(value ? 1 : 0);
    }

    writeByte(value: number): void {
        this._extendsData(1);
        this._buffer.writeInt8(value, this._position);
        this._position += 1;
    }

    writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        let i: number = 0;

        if (offset >= bytes.length && length > 0) {
            throw new Error("L'index indiquer sort des limites");
        }

        if (length == 0) {
            length = bytes.length - offset;
        }

        while (i < length) {
            this.writeByte(bytes.get(offset + i));
            i = i + 1;
        }
    }

    writeDouble(value: number): void {
        this._extendsData(8);
        if (this._endian == 'BIG_ENDIAN') {
            this._buffer.writeDoubleBE(value, this._position);
        } else {
            this._buffer.writeDoubleLE(value), this._position;
        }
        this._position += 8;
    }

    writeFloat(value: number): void {
        this._extendsData(4);
        if (this._endian == 'BIG_ENDIAN') {
            this._buffer.writeFloatBE(value, this._position);
        } else {
            this._buffer.writeFloatLE(value), this._position;
        }
        this._position += 4;
    }

    writeInt(value: number): void {
        this._extendsData(4);
        if (this._endian == 'BIG_ENDIAN') {
            this._buffer.writeInt32BE(value, this._position);
        } else {
            this._buffer.writeInt32LE(value), this._position;
        }
        this._position += 4;
    }

    writeMultiByte(value: string, charSet: string): void {
        throw new Error('Method not implemented.');
    }

    writeObject(object: any): void {
        throw new Error('Method not implemented.');
    }

    writeShort(value: number): void {
        this._extendsData(2);
        if (this._endian == 'BIG_ENDIAN') {
            this._buffer.writeInt16BE(value, this._position);
        } else {
            this._buffer.writeInt16LE(value), this._position;
        }
        this._position += 2;
    }

    writeUnsignedInt(value: number): void {
        this._extendsData(4);
        if (this._endian == 'BIG_ENDIAN') {
            this._buffer.writeUInt32BE(value, this._position);
        } else {
            this._buffer.writeUInt32LE(value), this._position;
        }
        this._position += 4;
    }

    writeUTF(value: string): void {
        this.writeShort(value.length);
        this.writeUTFBytes(value);
    }

    writeUTFBytes(value: string): void {
        let i: number = 0;

        while (i < value.length) {
            this.writeByte(value.charCodeAt(i));
            i = i + 1;
        }
    }
}

export default ByteArray;
