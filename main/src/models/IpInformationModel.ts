interface IpInformationModel {
    ip: string;
    domain: string;
    services: Array<string>;
    isValid: boolean;
    error: string
}

export default IpInformationModel;