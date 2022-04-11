import React from 'react';
import { Container, Button, Table, Col } from 'reactstrap';
import { CoatOfArms, Logo } from '../../../assets';
import './testModal.css';
import './testModalRes.css';

class TestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            txid: '',
            p: '1',
            // userid: localStorage.get("user") ? localStorage.get("user").userid : null,
            userid: 'ABCDEF-8910',
            doc: {},
            downloadingPdf: false,
            qrcode: '',
            bwipLib: null
        };
    }
    // async componentDidMount() {
    //   //bwip-js is huge 817kb load it when required
    //   await import(`bwip-js`).then((module) => (this.bwipLib = module.default));
    // //   this.getDocumentFromServer();
    // }

    // getDocumentFromServer = () => {
    //   const {
    //     match: { params },
    //   } = this.props;
    //   api
    //     .getDocumentFromServer(this.state.userid, params.txId)
    //     .then((document) => {
    //       //console.log(this.state.userID, params.txId);
    //       //console.log(document);
    //       const doc = document.data.data;
    //       //console.log(doc);
    //       const level = doc.level;
    //       const qrCode = `{"l":"${level}","h":"${doc.h}","sig":"${doc.sig}"}`;
    //       this.setState({
    //         txid: params.txId,
    //         doc: doc,
    //         loading: false,
    //         qrcode: qrCode,
    //       });
    //       this.generateStamp(doc);
    //     })
    //     .catch((err) => {
    //      // console.log(err);
    //     });
    // };

    // generateStamp = (doc) => {
    //   let matrix = null;
    //     matrix = `{"person":{"f":"${"Emeka"}","m":"${"Big"}", "s":"${"Honk"}", "n":"${12345678910}"},
    //    "tx":"${"112bc066-eca9-4049-ba40-4ca1ee9d3da6"}", "type":"${"Full"}", "status":"${"OK"}", "agent":"${"ABCDEF-8910"}"},
    //     "signature":"${"Madd"}"}`;
    //   this.bwipLib(
    //     "mycanvas",
    //     {
    //       bcid: "datamatrix", // Barcode type
    //       text: matrix, // Text to encode
    //       scale: 3, // 3x scaling factor

    //       includetext: true, // Show human-readable text
    //       textxalign: "center", // Always good to set this
    //       textfont: "Inconsolata", // Use your custom font
    //       textsize: 13, // Font size, in points
    //     },
    //     function (err, cvs) {
    //       if (err) {
    //         // Decide how to handle the error
    //         // `err` may be a string or Error object
    //         //console.log(err);
    //       } else {
    //         // Nothing to do?
    //       }
    //     }
    //   );
    // };

    downloadPDF = async () => {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `https://slipserver1.nimc.gov.ng/ijebu?txid=${this.state.txid}&p=1&type=vs`;
        // link.download = this.state.doc.nin+'.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    converToNIMCDate(inDate) {
        const months = [
            '',
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC'
        ];

        let nimcDate;
        const fix = inDate.substr(0, 10);
        //console.log('at indate',inDate, fix);
        // const ch = moment(inDate);
        // ch.format('YYYY-MM-DD')
        // console.log('at moment', ch)

        const newDate = new Date();
        const fixdate = newDate.toLocaleDateString();
        //console.log(newDate.toLocaleDateString());
        const dateArray = fixdate.split('-');
        const monthIndex = parseInt(dateArray[1]);

        const month = months[monthIndex];
        nimcDate = `${dateArray[2]} ${month} ${dateArray[0]}`;

        return fix;
    }

    render() {
        // var QRCode = require("qrcode.react"); //lazy loading for optimization
        //   if (!Auth.checkLogin()) {
        //     this.props.history.push("/login");
        //     return false;
        //   } else
        return (
            <Container className="DashboardWrapper" fluid={true}>
                {this.state.loading ? (
                    <Button
                        outline
                        color="secondary"
                        className="close-btn"
                        onClick={() => {
                            window.history.back(); /*this.props.history.goBack();*/
                        }}
                    >
                        Close
                    </Button>
                ) : null}

                {this.state.loading ? (
                    <Col md="12" className="center-loading">
                        {/* <LoadingMd text="Getting document..." /> */}
                        <p>Getting Document</p>
                    </Col>
                ) : (
                    <div>
                        <div id="export-wrapper">
                            <div>
                                <center className="nin-export-header">
                                    <p>
                                        <img
                                            className="_nimc-logo"
                                            style={{ marginTop: '0em' }}
                                            src={Logo}
                                            alt=""
                                        />
                                    </p>
                                    <p style={{ color: 'black' }}>
                                        <b>Verification-as-a-Service</b>
                                    </p>
                                </center>
                            </div>

                            <div className="info-area">
                                <div className="userid-watermarks">
                                    <p>{this.state.userid}</p>
                                    <p>{this.state.userid}</p>
                                </div>
                                <div className="nin-id-wrapper">
                                    <div className="coat-of-arms-wrapper">
                                        <img
                                            className="coat-of-arms-photo"
                                            src={CoatOfArms}
                                            alt=""
                                        />
                                    </div>

                                    {this.state.doc.level === 'n' ? (
                                        <div className="nin-watermark">
                                            <p>Hello World</p>
                                            <p>Hello World</p>
                                            <p>Hello World</p>
                                            <p>Hello World</p>
                                        </div>
                                    ) : null}

                                    <div className="passport">
                                        <img
                                            className="passport-photo"
                                            src={
                                                // "https://vsc.ibib.io:7078" +
                                                // this.state.doc.p +
                                                // "/png/" +
                                                // this.state.doc.h +
                                                // ".png"
                                                // "https://v2.ibib.io:7071/1/png/" + this.state.doc.hash + ".png"
                                                Logo
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="nin-names">
                                        <p className="title">FAMILY NAME</p>
                                        <p className="last-name">Dickson</p>
                                        <p className="break"> </p>
                                        <p className="title">GIVEN NAME(S)</p>
                                        <p className="first-name">
                                            Emeka John
                                            {/* {this.state.doc.fn}
                          {this.state.doc.mn ? `, ${this.state.doc.mn}` : null} */}
                                        </p>
                                        <p className="break"> </p>
                                        {/*<p>MIDDLENAME</p>*/}
                                        <p className="middle-name"></p>
                                    </div>

                                    <div className="qrcode">
                                        {/* <QRCode
                          size={85}
                          className="qr-image"
                          value={this.state.qrcode}
                        /> */}
                                    </div>

                                    <div className="extra-data">
                                        <span style={{ display: 'inline-block' }}>
                                            <p className="title">DoB</p>
                                            <p className="last-name">
                                                {/* {this.converToNIMCDate(this.state.doc.dob)} */}
                                                {'16 OCT 1989'}
                                            </p>
                                        </span>

                                        <span>
                                            <p className="title">EXPIRY DATE</p>
                                            <p className="first-name">
                                                {/* {this.converToNIMCDate(this.state.doc.e)} */}
                                                {'16 OCT 2023'}
                                            </p>
                                        </span>

                                        <span>
                                            <p className="title">NATIONALITY</p>
                                            <p className="middle-name">NGA</p>
                                        </span>
                                    </div>

                                    <div md="7" className="nin-area">
                                        <p className="nin-title">UserID</p>
                                        <p className="nin-number">{'ABCDEF-8910'}</p>
                                        {/* <p className="nin-number">{this.state.doc.userid}</p> */}
                                    </div>
                                </div>

                                <div className="center-names">
                                    <p className="title">Surname</p>
                                    {/* <p className="name">{this.state.doc.sn}</p> */}
                                    <p className="name">{'John'}</p>

                                    <p className="title">Given Names</p>
                                    <p className="name">{`${'Sam'} ${'Okoro'}`}</p>
                                </div>

                                <div className="stamp-area">
                                    <b className="stamp-title">Verification Stamp</b>
                                    <canvas id="mycanvas" className="stamp"></canvas>
                                </div>
                            </div>

                            <div>
                                <Table
                                    className="table app-table nin-transaction-table nin-export-table"
                                    bordered
                                >
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Transaction ID</th>
                                            <th>Verification Type</th>
                                            <th>Verification Status</th>
                                            <th>Verification Agent ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="info">
                                            <td>{'12MN3KNK44403'}</td>
                                            <td>{'MNCK230904O03E'}</td>
                                            <td className="green">FULL</td>
                                            <td
                                                className={
                                                    //   this.state.doc.status === "failed"
                                                    //     ? "error-text"
                                                    //     : "green"

                                                    'green'
                                                }
                                            >
                                                {/* {this.state.doc.status} */}
                                                {'OK'}
                                            </td>
                                            {/* <td>{this.state.userid}</td> */}
                                            <td>{'OK'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <p style={{ marginTop: '10px', marginBottom: '10px' }}>
                                Please click on the 'Download PDF' button
                            </p>
                            <Button
                                style={{
                                    marginRight: '20px',
                                    marginBottom: '20px',
                                    width: '150px'
                                }}
                                outline
                                color="secondary"
                                onClick={() => {
                                    window.history.back(); /*this.props.history.goBack();*/
                                }}
                            >
                                Close
                            </Button>

                            <Button
                                style={{
                                    marginRight: '20px',
                                    marginBottom: '20px',
                                    width: '150px'
                                }}
                                outline
                                color="success"
                                // onClick={this.downloadPDF}
                            >
                                Download PDF
                            </Button>
                        </div>
                    </div>
                )}
            </Container>
        );
    }
}

export default TestModal;
