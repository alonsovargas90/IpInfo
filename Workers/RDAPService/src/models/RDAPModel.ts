import PayloadModel from './Payload';

interface RDAPModel extends PayloadModel{
    objectClassName: string,
    handle: string,
    parentHandle: string,
    startAddress: string,
    endAddress: string,
    ipVersion: string,
    type: string,
    entities: Array<any>,
    events: Array<any>,
    links: Array<any>,
    remarks: Array<any>,
    lacnic_originAutnum: string,
    lacnic_legalRepresentative: string,
    lacnic_reverseDelegations: Array<any>
    cidr0_cidrs: Array<any>,
    rdapConformance: Array<string>,
    notices: Array<string>
}

export default RDAPModel;