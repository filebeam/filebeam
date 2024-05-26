import { FileBox, FileVideo2, FileCode2, FileText, FolderArchive, FileMusic, FileType2, FileImage, FileSpreadsheet, FileCog } from "lucide-svelte";

export const fileTypes = [
    { type: "img", icon: FileImage, name: 'Imagen', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ico'] },
    { type: "audio", icon: FileMusic, name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'flac', 'aac', 'ogg', 'opus'] },
    { type: "vid", icon: FileVideo2, name: 'Video', extensions: ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv'] },
    { type: "compressed", icon: FolderArchive, name: 'Archivo Comprimido', extensions: ['zip', 'rar', 'tar', '7z', 'gz', 'iso', 'torrent'] },
    { type: "code", icon: FileCode2, name: 'Código Fuente', extensions: ['html', 'htm', 'css', 'js', 'py', 'cpp', 'php'] },
    { type: "text", icon: FileText, name: 'Texto', extensions: ['txt', 'md', 'json', 'mdx'] },
    { type: "exec", icon: FileBox, name: 'Ejecutable', extensions: ['exe', 'apk', 'dmg', 'app', 'deb', 'sh', 'msi'] },
    { type: "font", icon: FileType2, name: 'Fuente', extensions: ['ttf', 'otf', 'woff', 'woff2'] },
    { type: "sheet", icon: FileSpreadsheet, name: 'Hoja de Cálculo', extensions: ['xls', 'xlsx', 'ods', 'csv'] },
    { type: "document", icon: FileText, name: 'Documento', extensions: ['doc', 'docx', 'odt', 'pdf', 'rtf'] },
    { type: "config", icon: FileCog, name: 'Configuración', extensions: ['ini', 'cfg', 'conf', 'env'] },
];
