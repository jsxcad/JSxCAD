import Hershey from './Hershey';
import readFont from './readFont';

const ofSize = (size) => Hershey.ofSize(size);

export const Font = (size) => ofSize(size);

Font.Hershey = Hershey;
Font.ofSize = ofSize;
Font.read = async (...args) => readFont(...args);

Font.Hershey.signature = 'Font.Hershey(size:number) -> Font';
Font.ofSize.signature = 'Font.ofSize(size:number) -> Font';
Font.read.signature = 'Font.read(path:string, { flip:boolean = false }) -> Font';

export { Hershey };

export default Font;
