import React from 'react';
import Button from "@material-ui/core/Button";
import {useDispatch} from "react-redux";
import uuid from 'uuid';

export default function LoginPage() {
    const dispatch = useDispatch();
    const showMessage = () => {
        dispatch({
            type: 'push',
            name: 'messages',
            data: {
                message: uuid.v4(),
                variant: 'info'
            }
        });
    };
    return (
        <div>
            Login
            <Button onClick={showMessage}>Toto</Button>
        </div>
    );
}
