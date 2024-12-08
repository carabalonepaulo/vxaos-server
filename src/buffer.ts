export class Reader {
  private buffer: Uint8Array;
  private offset: number;
  private view: DataView;
  private littleEndian = true;
  private decoder: TextDecoder;

  constructor(buf: Uint8Array) {
    this.buffer = buf;
    this.offset = 0;
    this.view = new DataView(buf.buffer);
    this.decoder = new TextDecoder("utf-8");
  }

  bytes(len: number): Uint8Array {
    const buf = this.buffer.slice(this.offset, this.offset + len);
    this.offset += len;
    return buf;
  }

  byte(): number {
    const n = this.buffer[this.offset];
    this.offset += 1;
    return n;
  }

  short(): number {
    const n = this.view.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return n;
  }

  int(): number {
    const n = this.view.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return n;
  }

  long(): bigint {
    const n = this.view.getBigInt64(this.offset, this.littleEndian);
    this.offset += 8;
    return n;
  }

  float(): number {
    const n = this.view.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return n;
  }

  double(): number {
    const n = this.view.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return n;
  }

  boolean(): boolean {
    return this.byte() === 1;
  }

  string(): string {
    const len = this.short();
    const buf = this.bytes(len);
    return this.decoder.decode(buf);
  }
}

export class Writer {
  private buffer: Uint8Array;
  private offset: number;
  private view: DataView;
  private littleEndian = true;
  private encoder: TextEncoder;

  constructor(capacity: number) {
    this.buffer = new Uint8Array(capacity);
    this.offset = 0;
    this.view = new DataView(this.buffer.buffer);
    this.encoder = new TextEncoder();
  }

  bytes(buf: Uint8Array) {
    this.buffer.set(buf, this.offset);
    this.offset += buf.length;
  }

  byte(value: number) {
    this.buffer[this.offset] = value;
    this.offset += 1;
  }

  short(value: number) {
    this.view.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
  }

  int(value: number) {
    this.view.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  long(value: bigint) {
    this.view.setBigInt64(this.offset, value, this.littleEndian);
    this.offset += 8;
  }

  float(value: number) {
    this.view.setFloat32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  double(value: number) {
    this.view.setFloat64(this.offset, value, this.littleEndian);
    this.offset += 8;
  }

  boolean(value: boolean) {
    this.byte(value ? 1 : 0);
  }

  string(value: string) {
    const encoded = this.encoder.encode(value);
    this.short(encoded.length);
    this.bytes(encoded);
  }
}
