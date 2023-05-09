import path from "path";
import fs from "fs";

function format(...arg) {
  arg.map(e => {
 return e?.length?e:''
})
    return path.join(process.cwd(), ...arg); 
}
function str(arg) {
    return JSON.stringify(arg, null, 4);
  }
  
  function parse(arg) {
    return JSON.parse(arg);
}
  function write(data, path1, path2, path3) {
    fs.writeFileSync(format(path1, path2, path3), str(data));
  }
export default {
  format,str,parse,write
};
