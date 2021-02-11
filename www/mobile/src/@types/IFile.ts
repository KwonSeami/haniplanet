interface IFile {
    id: number;
    name: string;
    size: number;
    file: string;
}

interface IFileResult {
    file: File;
    result: string | ArrayBuffer;
}

interface IFundingFile extends IFile {
    fund: Id;
}


