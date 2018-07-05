export interface StatementRecord {
    reference: number;
    accountNumber: string;
    description: string;
    startBalance: number;
    mutation: number;
    endBalance: number;
    isValid: boolean;
    status: String;
    errorCode: StatementErrorCode;
}

export enum StatementErrorCode {
    noError = 0,
    unbalanced = 1,
    notUnique = 2
}

export enum FileType {
    csv = 'csv',
    xml = 'xml'
}
