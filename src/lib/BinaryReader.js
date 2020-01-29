class BinaryReader {
	constructor(uint8array, endian){
		this.endian = endian ? (endian === 'big' ? 'big' : 'little') : 'little';
		this.position = 0;
		this.data = uint8array;
	}

	ReadAscii(length){
		if(this.data.length < this.position + length){
			throw 'range error';
		}
		var str = '';
		for(var i = 0;i < length;i++){
			str += String.fromCharCode(this.data[this.position+i]);
		}
		this.position += length;
		return str;
	}

	ReadBytes(length){
		if(this.data.length < this.position + length){
			throw 'range error';
		}
		var buf = []
		for(var i=0; i<length; i++){
			buf.push(i);
		}
		buf = Buffer.from(buf);
		for(var i = 0;i < length;i++){
			buf[i] = this.data[this.position + i];
		}
		this.position += length;
		return buf;
	}

	ReadUInt8(){
		if(this.data.length < this.position + 1){
			throw 'range error';
		}
		var result;

		result = this.data[this.position];

		this.position += 1;
		return result;
	}

	ReadInt8(){
		var result = this.ReadUInt8();

		if(result & 0x80){
			result = -((result - 1) ^ 0xff);
		}

		return result;
	}

	ReadUInt16(){
		if(this.data.length < this.position + 2){
			throw 'range error';
		}

		var result;

		if(this.endian === 'little'){
			result = this.data[this.position] + (this.data[this.position+1] << 8);
		}else{
			result = this.data[this.position+1] + (this.data[this.position] << 8);
		}

		this.position += 2;
		return result;
	}

	ReadInt16(){
		var result = this.ReadUInt16();
		if(result & 0x8000){
			result = -((result - 1) ^ 0xffff);
		}
		return result;
	}

	ReadUInt32(){
		if(this.data.length < this.position + 4){
			throw 'range error';
		}

		var result;

		if(this.endian === 'little'){
			result = this.data[this.position] + (this.data[this.position+1] << 8) + (this.data[this.position+2] << 16) + (this.data[this.position+3] << 24);
		}else{
			result = this.data[this.position+3] + (this.data[this.position+2] << 8) + (this.data[this.position+1] << 16) + (this.data[this.position] << 24);
		}

		this.position += 4;

		return result;
	}

	ReadInt32(){
		var result = this.ReadUInt32();
		if(result & 0x80000000){
			result = -((result - 1) ^ 0xffffffff);
		}
		return result;
	}

	ReadUInt64(){
		if(this.data.length == 0) return undefined;
		if(this.data.length < this.position + 8){
			throw 'range error';
		}

		var result;

		if(this.endian === 'little'){
			result = this.data[this.position] + (this.data[this.position+1] << 8) + (this.data[this.position+2] << 16) + (this.data[this.position+3] << 24);
		}else{
			result = this.data[this.position+3] + (this.data[this.position+2] << 8) + (this.data[this.position+1] << 16) + (this.data[this.position] << 24);
		}

		this.position += 8;

		return result;
	}

	ReadInt64(){
		var result = this.ReadUInt64();
		if(result & 0x8000000000000000){
			result = -((result - 1) ^ 0xffffffffffffffff);
		}
		return result;
	}

	ReadFloat32(){
		if(this.data.length < this.position + 4){
			throw 'range error';
		}

		result = (new Float32Array(this.data.buffer, this.position, 1))[0];
		this.position += 4;
		return result;
	}

	ReadFloat64(){
		if(this.data.length < this.position + 8){
			throw 'range error';
		}

		result = (new Float64Array(this.data.buffer, this.position, 1))[0];
		this.position += 8;
		return result;
	}

	ReadAsciiZ(maxLength = 2147483647){
		let start = this.position;
		let size = 0;
		while (this.ReadByte() - 1 > 0 && size < maxLength){
				size++;
		}
		this.position = start;
		let text = this.ReadAscii(size);
		this.position++;
		return text;
	}

	ReadByte(){
		if(this.data.length < this.position + 1){
			return -1
		} else {
			this.position += 1
			return this.data[this.position-1];
		}
	}
}
module.exports = BinaryReader;
