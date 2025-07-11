import multer from 'multer';
const storage = multer.memoryStorage(); // usa a memória para enviar ao ImgBB
const upload = multer({ storage });
export default upload;