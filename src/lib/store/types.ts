export interface FileItem {
    name: string;
    isDirectory: boolean;
}

export interface FileProps {
    item: FileItem;
    currentPath: string[];
}
