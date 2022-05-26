const getBenefactors = (amount) => {
    let NIMCCut, commonIdentityCut, remitaCut;
    if (amount === '416.88') {
        commonIdentityCut = '188.13';
        NIMCCut = '175';
        remitaCut = '53.75';
    } else if (amount === '1039.38') {
        commonIdentityCut = '510.63';
        NIMCCut = '475';
        remitaCut = '53.75';
    } else if (amount === '106') {
        commonIdentityCut = '32.25';
        NIMCCut = '20';
        remitaCut = '53.75';
    } else if (amount === '5227.26') {
        commonIdentityCut = '3176.63';
        NIMCCut = '1970.00';
        remitaCut = '80.63';
    }

    var benefactors = [
        {
            lineItemsId: 'itemid1',
            beneficiaryName: 'Test Corporation',
            beneficiaryAccount: '0360883515',
            bankCode: '057',
            beneficiaryAmount: commonIdentityCut,
            deductFeeFrom: '1'
        },
        {
            lineItemsId: 'itemid1',
            beneficiaryName: 'Folivi Joshua',
            beneficiaryAccount: '4017904612',
            bankCode: '058',
            beneficiaryAmount: NIMCCut,
            deductFeeFrom: '0'
        },
        {
            lineItemsId: 'itemid1',
            beneficiaryName: 'Folivi Joshua',
            beneficiaryAccount: '4017904612',
            bankCode: '058',
            beneficiaryAmount: remitaCut,
            deductFeeFrom: '0'
        }
    ];
    // return benefactors;

    // var benefactors = [
    //     {
    //         lineItemsId: 'itemid1',
    //         beneficiaryName: 'CommonIdentity Ltd',
    //         beneficiaryAccount: '1015865808',
    //         bankCode: '057',
    //         beneficiaryAmount: commonIdentityCut,
    //         deductFeeFrom: '1'
    //     },
    //     {
    //         lineItemsId: 'itemid1',
    //         beneficiaryName: 'National Identity Management Commission',
    //         beneficiaryAccount: '0020451061012',
    //         bankCode: '000',
    //         beneficiaryAmount: NIMCCut,
    //         deductFeeFrom: '0'
    //     },
    //     {
    //         lineItemsId: 'itemid1',
    //         beneficiaryName: 'SystemSpecs Limited',
    //         beneficiaryAccount: '0001624760',
    //         bankCode: '044',
    //         beneficiaryAmount: remitaCut,
    //         deductFeeFrom: '0'
    //     }
    // ];
    return benefactors;
};

export { getBenefactors };
