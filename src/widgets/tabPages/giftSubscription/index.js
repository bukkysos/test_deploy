import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../appContext';
import { Modal, SuccessContent } from '../../../components';
import { GiftCard } from '../../../components/card/giftCard';

const GiftSubscription = () => {
    const [modalState, setModalState] = useState(false);
    const [context, setContext] = useContext(AppContext);
    const [response, setResponse] = useState({ status: '', responseText: '' });

    const history = useHistory();

    useEffect(() => {
        setContext(modalState);
    }, [modalState, response, setContext]);

    const getResponse = (status, responseText) => {
        setResponse({ status, responseText });
        setModalState(true);
    };

    return (
        <>
            <div className={`${modalState ? 'blur' : ''} ${context ? '' : ''}`}>
                <h3 className="tab_page_title mx-auto">Gift Credits</h3>
                <p className="mx-auto tab_page_subtitle">
                    To share your credits with others, simply input their User ID and the amount of
                    credits you would like to share.
                </p>

                <div className="col-12 d-flex justify-content-center px-4">
                    <GiftCard
                        buttonText={'Gift Credits'}
                        defaultUserObject={history.location.state}
                        icon={null}
                        getResponse={getResponse}
                    />
                </div>
            </div>
            {modalState ? (
                <Modal
                    onclick={(modal) => setModalState(modal)}
                    content={
                        <SuccessContent
                            responseType={response.status ? 'success' : 'error'}
                            responseTexts={response.responseText}
                            btnAction={() => {}}
                        />
                    }
                    showCloseButton={true}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export { GiftSubscription };
