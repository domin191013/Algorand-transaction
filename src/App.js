import React, { useState, useEffect } from 'react';
import { connector } from './adapters/walletConnect';
import { Button } from '@material-ui/core';

const App = () => {
    const [wallet, setWallet] = useState("");

    useEffect(() => {
        if (connector.connected) {
            console.log("Current wallet is", connector.accounts[0]);
            setWallet(connector.accounts[0]);
        }
        const escFunction = (event) => {
            if (event.keyCode === 27) QRCodeModal.close();
        };
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const connectToMobileWallet = () => {
        if (connector.connected) return;
        if (connector.pending) return QRCodeModal.open(connector.uri);
        connector.createSession();
    };

    const disconnectMobileWallet = () => {
        if (!connector.connected) return;
        connector.killSession();
        setWallet("");
    };

    connector.on("connect", (error, payload) => {
        try {
            if (error) {
                throw error;
            }
            console.log("Wallet Connected");
            setWallet(connector.accounts[0]);
        } catch (error) {
            console.error(error);
        }
    });

    connector.on("disconnect", (error) => {
        try {
            if (error) {
                throw error;
            }
            console.log("Wallet Disconnected");
            localStorage.clear();
        } catch (error) {
            console.error(error);
        }
    });

    useEffect(() => {
        console.log(wallet);
    }, [wallet])

    return (
        <div
            style={{
                left: '25%',
                marginTop: '20%',
                marginLeft: '25%',
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                height: "200px",
                width: "50%",
                flexWrap: "nowrap",
                alignItems: "center",
                alignContent: "space-around"
            }}
        >
            <Button color="primary"
                variant="contained"
                disabled={wallet != ""} onClick={() => { connectToMobileWallet() }}
            >
                Connect Wallet
            </Button>
            <Button color="primary"
                variant="contained"
                disabled={wallet == ""} onClick={() => { disconnectMobileWallet() }}
            >
                Disconnect Wallet
            </Button>
        </div>
    );
};

export default App;