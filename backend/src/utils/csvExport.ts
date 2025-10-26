import { Parser } from 'json2csv';

export interface CSVOptions {
    fields?: string[];
    delimiter?: string;
}

export const convertToCSV = (data: any[], options: CSVOptions = {}): string => {
    try {
        const parser = new Parser({
            fields: options.fields,
            delimiter: options.delimiter || ',',
            quote: '"',
            header: true
        });
        return parser.parse(data);
    } catch (error) {
        console.error('Error converting data to CSV:', error);
        throw error;
    }
};

export const downloadCSV = (csvData: string, filename: string): Buffer => {
    const bom = '\uFEFF'; // Add BOM for Excel UTF-8 compatibility
    return Buffer.from(bom + csvData, 'utf-8');
};