import PayloadModel from './PayloadModel';

interface ReverseDnsModel extends PayloadModel{
    domain: string[],
    error: {
        name: string,
        message: string,
        code: number,
        className: string,
        data: any,
        errors: any
    }
}

export default ReverseDnsModel;