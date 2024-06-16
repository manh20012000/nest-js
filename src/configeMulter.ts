import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
const uiID = uuidv4();
console.log(uiID)
export const multerConfig = {
  
  storage: diskStorage({
    destination: 'public/image/',
    filename: (req, file, cb) => {
      cb(null, `${uiID}${extname(file.originalname)}`);
    },
  }),
};