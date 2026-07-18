/**
 * Deltarune 存档行游标
 * 逐行读取存档内容
 */
export class LineCursor {
  #lines;
  #pos = 0;

  constructor(content) {
    const normalized = content
      .replace(/^\uFEFF/, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    this.#lines = normalized.split('\n');
    if (this.#lines.length > 0 && this.#lines[this.#lines.length - 1] === '') {
      this.#lines.pop();
    }
  }

  get totalLines() { return this.#lines.length; }
  get currentPosition() { return this.#pos; }
  get isAtEnd() { return this.#pos >= this.#lines.length; }

  skip(count) { this.#pos = Math.min(this.#pos + count, this.#lines.length); }
  reset() { this.#pos = 0; }

  nextString() { return this.#nextLine(); }

  nextNumber() {
    const line = this.#nextLine();
    const trimmed = line.trim().toLowerCase();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'nan') return 0;
    if (trimmed === 'inf' || trimmed === 'infinity' || trimmed === '+inf' || trimmed === '+infinity') return Infinity;
    if (trimmed === '-inf' || trimmed === '-infinity') return -Infinity;
    const parsed = Number(line);
    if (isNaN(parsed)) throw new Error(`Failed to parse number from line ${this.#pos}: "${line}"`);
    return parsed;
  }

  #nextLine() {
    if (this.isAtEnd) throw new Error(`Unexpected end of file at line ${this.#pos + 1}`);
    return this.#lines[this.#pos++];
  }
}
